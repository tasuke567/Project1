from flask import Flask, request, jsonify, abort
import pandas as pd
import joblib
from sklearn.tree import DecisionTreeClassifier
import logging
from werkzeug.utils import secure_filename
import os
import warnings
from flask_cors import CORS
import numpy as np
from typing import Dict, Any, List
import numpy as np
import pandas as pd
import logging
from typing import Dict, List, Tuple, Any
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, f1_score, confusion_matrix
from imblearn.over_sampling import SMOTE
import joblib
import logging
from dataclasses import dataclass

warnings.filterwarnings('ignore')
app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['DATASETS_FOLDER'] = './datasets'
app.config['MODEL_PATH'] = './model/best_decision_tree.joblib'

@dataclass
class ModelComponents:
    model: Any
    encoder: OneHotEncoder
    scaler: StandardScaler
    label_encoder: LabelEncoder
    feature_names: List[str]
    categorical_features: List[str]

try:
    model_path = os.path.join(os.path.dirname(__file__), 'model/best_decision_tree.joblib')
    print(f"🔄 Attempting to load model from: {model_path}")
    
    if not os.path.exists(model_path):
        print(f"❌ Model file not found at: {model_path}")
        model_data = None
    else:
        print(f"✅ Model file exists, size: {os.path.getsize(model_path)} bytes")
        model_data = joblib.load(model_path)
        print(f"🔥 Model loaded successfully! Features: {len(model_data.feature_names)}")
        
except Exception as e:
    print(f"💥 Critical load error: {str(e)}")
    import traceback
    traceback.print_exc()
    model_data = None

class SmartphoneBrandPredictor:
    def __init__(self, categorical_features: List[str], threshold: int = 2):
        self.categorical_features = categorical_features
        self.threshold = threshold
        self.components = ModelComponents(
            model=None,
            encoder=OneHotEncoder(),
            scaler=StandardScaler(),
            label_encoder=LabelEncoder(),
            feature_names=[],
            categorical_features=self.categorical_features
        )
        
    def preprocess_data(self, data: pd.DataFrame, is_training: bool = True) -> pd.DataFrame:
        """Preprocess the input data with proper Thai language handling"""
        # Create a copy to avoid modifying original data
        df = data.copy()
        
        # Handle missing values with appropriate Thai placeholder
        df.fillna('ไม่ระบุ', inplace=True)
        
        # Convert all categorical columns to string and clean
        for col in self.categorical_features:
            df[col] = df[col].astype(str).str.strip()
            
        if is_training:
            self.components.encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
            encoded_features = self.components.encoder.fit_transform(df[self.categorical_features])
        else:
            encoded_features = self.components.encoder.transform(df[self.categorical_features])
        
        return df
    
    def handle_rare_classes(self, df: pd.DataFrame, target_column: str) -> pd.DataFrame:
        """Combine rare classes with proper handling of Thai characters"""
        y_counts = df[target_column].value_counts()
        df[target_column] = df[target_column].apply(
            lambda x: 'อื่นๆ' if y_counts[x] < self.threshold else x
        )
        return df
    
    def prepare_features(self, 
                        X_train: pd.DataFrame, 
                        X_test: pd.DataFrame,
                        y_train: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare features with one-hot encoding and scaling"""
        # Initialize encoders
        encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
        scaler = StandardScaler()
        
        # One-hot encode categorical features
        X_train_encoded = encoder.fit_transform(X_train[self.categorical_features])
        X_test_encoded = encoder.transform(X_test[self.categorical_features])
        
        # Create DataFrames with encoded features
        encoded_df_train = pd.DataFrame(
            X_train_encoded,
            columns=encoder.get_feature_names_out(self.categorical_features)
        )
        encoded_df_test = pd.DataFrame(
            X_test_encoded,
            columns=encoder.get_feature_names_out(self.categorical_features)
        )
        
        # Scale features
        X_train_scaled = scaler.fit_transform(encoded_df_train)
        X_test_scaled = scaler.transform(encoded_df_test)
        
        # Update components with actual values
        self.components.encoder = encoder
        self.components.scaler = scaler
        self.components.feature_names = encoder.get_feature_names_out(self.categorical_features)
        
        return X_train_scaled, X_test_scaled
    
    def apply_smote(self, 
                    X_train: np.ndarray, 
                    y_train: np.ndarray,
                    min_samples: int = 5) -> Tuple[np.ndarray, np.ndarray]:
        """Apply SMOTE with proper handling of minority classes"""
        # Identify valid classes for SMOTE
        class_counts = pd.Series(y_train).value_counts()
        valid_classes = class_counts[class_counts > min_samples].index
        mask = np.isin(y_train, valid_classes)
        
        # Apply SMOTE only to valid classes
        smote = SMOTE(
            sampling_strategy='not majority',
            random_state=42,
            k_neighbors=2
        )
        X_res, y_res = smote.fit_resample(X_train[mask], y_train[mask])
        
        # Combine with original minority samples
        X_final = np.vstack([X_res, X_train[~mask]])
        y_final = np.concatenate([y_res, y_train[~mask]])
        
        return X_final, y_final
    
    def train(self, data: pd.DataFrame, target_column: str) -> Dict[str, Any]:
        """Train the model with comprehensive logging and validation"""
        try:
            # Preprocess data
            df = self.preprocess_data(data)
            df = self.handle_rare_classes(df, target_column)
            
            # Prepare target variable
            y_encoder = LabelEncoder()
            y = y_encoder.fit_transform(df[target_column])
            self.components.label_encoder = y_encoder
            
            # Split data
            X = df.drop(target_column, axis=1)
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.4, random_state=42, stratify=y
            )
            
            # Prepare features
            X_train_scaled, X_test_scaled = self.prepare_features(X_train, X_test, y_train)
            
            # Apply SMOTE
            X_train_resampled, y_train_resampled = self.apply_smote(X_train_scaled, y_train)
            
            # Train model with class weights
            class_weights = {i: sum(y_train_resampled == i) for i in np.unique(y_train_resampled)}
            model = DecisionTreeClassifier(
                class_weight=class_weights,
                random_state=42
            )
            
            # Fit and evaluate
            model.fit(X_train_resampled, y_train_resampled)
            self.components.model = model
            
            # Calculate metrics
            y_pred = model.predict(X_test_scaled)
            report = classification_report(y_test, y_pred, 
                                        target_names=y_encoder.classes_,
                                        output_dict=True)
            
            # Save model components
            os.makedirs('model', exist_ok=True)
            joblib.dump(self.components, 'model/best_decision_tree.joblib')
            
            # After training
            print("Actual features:", len(self.components.feature_names))
            
            return {
                "success": True,
                "metrics": {
                    "classification_report": report,
                    "f1_macro": f1_score(y_test, y_pred, average='macro'),
                    "class_distribution": pd.Series(y_encoder.inverse_transform(y)).value_counts().to_dict()
                }
            }
            
        except Exception as e:
            logging.error(f"Error during model training: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    def predict(self, input_data: dict) -> dict:
        try:
            # Convert input data to DataFrame
            input_df = pd.DataFrame([input_data])
            
            # Preprocess the input data
            processed_data = self.preprocess_data(input_df, is_training=False)
            
            # Make prediction
            prediction = self.components.model.predict(processed_data)
            
            # Inverse transform the prediction
            predicted_brand = self.components.label_encoder.inverse_transform(prediction)
            
            return {
                "prediction": predicted_brand[0],
                "success": True
            }
        except Exception as e:
            return {
                "error": str(e),
                "success": False
            }

@app.route('/predict', methods=['POST'])
def predict():
    # Check if model is loaded
    if model_data is None:
        return jsonify({
            "success": False,
            "error": "Model not loaded. Please retrain the model first."
        }), 503
    
    try:
        input_data = request.get_json()
        input_df = pd.DataFrame([input_data])
        
        # Validate input features
        missing_features = [f for f in model_data.categorical_features if f not in input_df.columns]
        if missing_features:
            return jsonify({
                "success": False,
                "error": f"Missing required features: {missing_features}"
            }), 400
            
        # Preprocessing
        processed = model_data.encoder.transform(input_df[model_data.categorical_features])
        scaled = model_data.scaler.transform(processed)
        
        # Prediction
        pred = model_data.model.predict(scaled)
        brand = model_data.label_encoder.inverse_transform(pred)
        
        return jsonify({
            "success": True,
            "prediction": brand[0],
            "model_version": "1.0.0"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Prediction error: {str(e)}"
        }), 500

@app.route('/model_info', methods=['GET'])
def get_model_info():
    """Get information about the trained model"""
    return jsonify({
        "features": model_data.feature_names.tolist(),
        "classes": model_data.label_encoder.classes_.tolist(),
        "categorical_features": model_data.categorical_features
    })

@app.route('/')
def health_check():
    return jsonify({
        "status": "running",
        "model_loaded": bool(model_data)
    })

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(host='0.0.0.0', port=5000)
