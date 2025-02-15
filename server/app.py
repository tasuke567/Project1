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

@dataclass
class ModelComponents:
    model: Any
    encoder: OneHotEncoder
    scaler: StandardScaler
    label_encoder: LabelEncoder
    feature_names: List[str]
    categorical_features: List[str]
    
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
        
    def preprocess_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """Preprocess the input data with proper Thai language handling"""
        # Create a copy to avoid modifying original data
        df = data.copy()
        
        # Handle missing values with appropriate Thai placeholder
        df.fillna('ไม่ระบุ', inplace=True)
        
        # Convert all categorical columns to string and clean
        for col in self.categorical_features:
            df[col] = df[col].astype(str).str.strip()
            
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

if __name__ == "__main__":
    categorical_features = [
        'เพศ', 'ช่วงอายุ', 'สถานภาพ', 'ท่านใช้แอปพลิเคชันใดบ้างเป็นประจำ?',
        'กิจกรรมที่ใช้สมาร์ทโฟนมากที่สุด 3 อันดับ', 'ท่านใช้สมาร์ทโฟนนานเท่าใดในหนึ่งวัน',
        'สมาร์ทโฟนสำคัญในชีวิตประจำวันอย่างไร', 'ปัจจัยที่พิจารณาเมื่อซื้อสมาร์ทโฟนออนไลน์มากที่สุด',
        'ความพึงพอใจจากยี่ห้อสมาร์ทโฟนที่ใช้ในปัจจุบัน', 'ปัญหาในการซื้อสมาร์ทโฟนออนไลน์',
        'รายได้ต่อเดือน', 'อาชีพ'
    ]
    
    predictor = SmartphoneBrandPredictor(categorical_features)
    data = pd.read_csv("./datasets/dataset2.csv")
    results = predictor.train(data, 'ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน')   

    # After predictor initialization
    print("Components initialized:", hasattr(predictor.components, 'label_encoder'))  # Should be True

    # Load the model components correctly
    model_data = joblib.load('model/best_decision_tree.joblib')
    model = model_data.model
    encoder = model_data.encoder
    scaler = model_data.scaler
    y_encoder = model_data.label_encoder
    categorical_features = model_data.categorical_features
    feature_names = model_data.feature_names

    print("Feature count:", len(feature_names))
    print("Encoder matches features:", np.array_equal(encoder.get_feature_names_out(categorical_features), feature_names))

    print("Training features:", feature_names[:5])
    print("Encoder features:", encoder.get_feature_names_out(categorical_features)[:5])

    # After loading model_data
    print("Actual features:", len(predictor.components.feature_names))
    print("Saved features:", len(model_data.feature_names))  # Now valid here

# Create Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['DATASETS_FOLDER'] = './datasets'
app.config['MODEL_PATH'] = './best_decision_tree.joblib'
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Allowed file extensions for CSV upload
ALLOWED_EXTENSIONS = {'csv'}

# Function to check allowed file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data
        data = request.get_json()
        app.logger.debug(f"Received data: {data}")
        
        # Create DataFrame from input
        input_df = pd.DataFrame([data])
        
        # 1. Preprocess categorical features
        for col in categorical_features:
            # Convert to string and handle missing values
            input_df[col] = input_df[col].astype(str).fillna('ไม่ระบุ').str.strip()
            
        # 2. One-hot encoding (critical fix)
        encoded_data = encoder.transform(input_df[categorical_features])
        
        # 3. Strict column alignment
        # Create DataFrame with EXACTLY the same columns as training data
        encoded_df = pd.DataFrame(
            encoded_data,
            columns=encoder.get_feature_names_out(categorical_features)
        )
        encoded_df = encoded_df.reindex(columns=feature_names, fill_value=0)
        
        # 4. Force numeric conversion
        encoded_df = encoded_df.astype(np.float64)
        
        # 5. Debug logs for verification
        app.logger.debug(f"Feature count: {len(encoded_df.columns)}")
        app.logger.debug(f"Expected features: {len(feature_names)}")
        app.logger.debug(f"First 5 features: {encoded_df.columns.tolist()[:5]}")
        
        # 6. Feature scaling
        scaled_data = scaler.transform(encoded_df)
        
        # Make prediction
        prediction = model.predict(scaled_data)
        predicted_brand = y_encoder.inverse_transform(prediction)
        
        return jsonify({
            "predicted_brand": predicted_brand[0],
            "confidence": float(np.max(model.predict_proba(scaled_data)))
        })
        
    except Exception as e:
        app.logger.error(f"Prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/model_info', methods=['GET'])
def get_model_info():
    """Get information about the trained model"""
    return jsonify({
        "features": feature_names.tolist(),
        "classes": y_encoder.classes_.tolist(),
        "categorical_features": categorical_features
    })

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)


def allowed_dataset_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'csv', 'xlsx', 'xls'}

@app.route('/upload_dataset', methods=['POST'])
def upload_dataset():
    if 'dataset' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['dataset']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_dataset_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['DATASETS_FOLDER'], filename))
        return jsonify({"message": "Dataset uploaded successfully"}), 200
    else:
        return jsonify({"error": "Invalid file type. Allowed types are CSV, XLSX, and XLS."}), 400


@app.route('/upload_model', methods=['POST'])
def upload_model():
    if 'model' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['model']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        update_model(filename)
        return jsonify({"message": "Model updated successfully"}), 200

# @app.route('/tune_model', methods=['POST'])
# def tune_model():
    # try:
    #     max_depth = request.form.get('max_depth', default=None, type=int)
    #     min_samples_split = request.form.get('min_samples_split', default=2, type=int)
    #     min_samples_leaf = request.form.get('min_samples_leaf', default=1, type=int)
    #     dataset_name = request.form.get('dataset', default=None)

    #     if not dataset_name:
    #         return jsonify({"error": "No dataset provided"}), 400

    #     # Load dataset from file
    #     dataset_path = os.path.join('datasets', dataset_name)
    #     if not os.path.exists(dataset_path):
    #         return jsonify({"error": "Dataset file not found"}), 400

    #     # Load dataset from file
    #     df = pd.read_csv(dataset_path)

    #     return jsonify(response);

    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500

@app.route('/tune_model', methods=['POST'])
def tune_model():
    try:
        logging.debug(f"Received form data: {request.form}")
        max_depth = request.form.get('max_depth')
        min_samples_split = request.form.get('min_samples_split')
        min_samples_leaf = request.form.get('min_samples_leaf')
        datasets = request.form.getlist('existing_dataset[]')  # This should match client-side FormData

        required_params = ['max_depth', 'min_samples_split', 'min_samples_leaf', 'dataset']
        for param in required_params:
            if param not in request.form:
                return jsonify({"error": f"Missing required parameter: {param}"}), 400

        
        dataset_name = request.form['dataset']
        logging.debug(f"Received dataset name: {dataset_name}") 
        results = []
        
        
        datasets_folder = os.path.abspath(app.config['DATASETS_FOLDER']) 
        dataset_path = os.path.join(datasets_folder, dataset_name)
        
       # ตรวจสอบว่าไฟล์ dataset มีอยู่จริงหรือไม่
        if not os.path.exists(dataset_path):
            return jsonify({"error": f"Dataset file {dataset_name} not found"}), 404

        # ดึงค่าพารามิเตอร์อื่นๆ
        max_depth = int(request.form.get('max_depth', 30))
        min_samples_split = int(request.form.get('min_samples_split', 2))
        min_samples_leaf = int(request.form.get('min_samples_leaf', 1))

        
        logging.debug(f"Received form data: {request.form}")
        # Load dataset from file
        df = pd.read_csv(dataset_path)


        # Drop unnecessary columns
        if 'Timestamp' in df.columns and 'Email address' in df.columns:
            df.drop(['Timestamp', 'Email address'], axis=1, inplace=True)

        # Handle missing values
        for col in df.select_dtypes(include=['object']).columns:
            df[col].fillna('Unknown', inplace=True)
        for col in df.select_dtypes(exclude=['object']).columns:
            df[col].fillna(df[col].mean(), inplace=True)

        # Combine classes with less than a threshold number of instances into "Other"
        threshold = 2
        y_counts = Counter(df['ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน'])
        df['ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน'] = df['ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน'].apply(
            lambda x: 'Other' if y_counts[x] < threshold else x
        )

        # Convert categorical features to numerical
        categorical_features = ['เพศ', 'ช่วงอายุ', 'สถานภาพ', 'ท่านใช้แอปพลิเคชันใดบ้างเป็นประจำ?',
                                'กิจกรรมที่ใช้สมาร์ทโฟนมากที่สุด 3 อันดับ', 'ท่านใช้สมาร์ทโฟนนานเท่าใดในหนึ่งวัน',
                                'สมาร์ทโฟนสำคัญในชีวิตประจำวันอย่างไร', 'ปัจจัยที่พิจารณาเมื่อซื้อสมาร์ทโฟนออนไลน์มากที่สุด',
                                "ความพึงพอใจจากยี่ห้อสมาร์ทโฟนที่ใช้ในปัจจุบัน", "ปัญหาในการซื้อสมาร์ทโฟนออนไลน์",
                                'รายได้ต่อเดือน', 'อาชีพ']

        for col in categorical_features:
            df[col] = df[col].astype("category").cat.codes + 1

        # Split data into features and target
        X = df.drop('ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน', axis=1)
        y = df['ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน']

        # Label encode the target variable
        y_encoder = LabelEncoder()
        y = y_encoder.fit_transform(y)

        # Split data into training and testing sets (Stratified Sampling)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

        # One-hot encode categorical features
        encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
        X_train_encoded = encoder.fit_transform(X_train[categorical_features])
        X_test_encoded = encoder.transform(X_test[categorical_features])

        # Create dataframes with encoded features
        encoded_df_train = pd.DataFrame(X_train_encoded, columns=encoder.get_feature_names_out(categorical_features))
        encoded_df_test = pd.DataFrame(X_test_encoded, columns=encoder.get_feature_names_out(categorical_features))

        # Drop original categorical features and join encoded features
        X_train = X_train.drop(categorical_features, axis=1).reset_index(drop=True).join(encoded_df_train)
        X_test = X_test.drop(categorical_features, axis=1).reset_index(drop=True).join(encoded_df_test)

        # Feature scaling (StandardScaler)
        scaler = StandardScaler()
        X_train = scaler.fit_transform(X_train)
        X_test = scaler.transform(X_test)

        # Handle class imbalance using SMOTE with a smaller number of neighbors
        smote = SMOTE(random_state=42, k_neighbors=1)
        X_train, y_train = smote.fit_resample(X_train, y_train)

        # Hyperparameter tuning using Grid Search
        param_grid = {
            'max_depth': [max_depth] if max_depth else [None, 10, 20, 30, 40, 50],
            'min_samples_split': [min_samples_split],
            'min_samples_leaf': [min_samples_leaf],
            'class_weight': ['balanced', None]
        }

        grid_search = GridSearchCV(DecisionTreeClassifier(random_state=42), param_grid, cv=StratifiedKFold(5), n_jobs=-1)
        grid_search.fit(X_train, y_train)

        best_model = grid_search.best_estimator_

        # Save the tuned model
        joblib.dump(best_model, 'model.pkl')

        # Evaluate the model using cross-validation
        cv_scores = cross_val_score(best_model, X_train, y_train, cv=5)
        cv_mean = cv_scores.mean()

        # Predict on test set
        y_pred = best_model.predict(X_test)

        # Evaluate the model
        report = classification_report(y_test, y_pred, target_names=y_encoder.classes_, output_dict=True)
        accuracy = accuracy_score(y_test, y_pred)

        response = {
            "message": "Model tuned and saved successfully.",
            "cross_validation_scores": cv_scores.tolist(),
            "mean_cross_validation_accuracy": cv_mean,
            "classification_report": report,
            "accuracy": accuracy,
        }

        return jsonify(response), 200

    except FileNotFoundError:
        logging.error(f"Dataset file {dataset_name} not found")
        return jsonify({"error": f"Dataset file {dataset_name} not found"}), 404
    except pd.errors.EmptyDataError:
        logging.error(f"Dataset file {dataset_name} is empty")
        return jsonify({"error": f"Dataset file {dataset_name} is empty"}), 400
    except Exception as e:
        logging.error(f"Error during model tuning: {e}")
        return jsonify({"error": str(e)}), 500

def load_model():
    with open('model.pkl', 'rb') as f:
        return (model, config)
    
@app.route('/datasets', methods=['GET'])
def list_datasets():
    try:
        datasets = os.listdir(app.config['DATASETS_FOLDER'])
        logging.debug(f"Datasets found: {datasets}") 
        return jsonify(datasets)
    except FileNotFoundError:
        logging.error(f"Datasets folder not found at {app.config['DATASETS_FOLDER']}")
        return jsonify({"error": "Datasets folder not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def update_model(filename):
    with open(filename, 'rb') as f:
        model = joblib.load(f)
    with open('model.pkl', 'wb') as f:
        joblib.dump(model, f)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pkl'}


def safe_preprocess_input(data: Dict[str, Any], 
                         categorical_features: List[str],
                         encoder: Any,
                         scaler: Any,
                         feature_names: List[str]) -> np.ndarray:
    """
    Safely preprocess input data with proper type handling and validation
    """
    try:
        # Create DataFrame with explicit type conversion
        input_data = pd.DataFrame([data])
        
        # Safely convert categorical features
        for col in categorical_features:
            if col in input_data.columns:
                # Handle missing values before conversion
                input_data[col] = input_data[col].fillna('Unknown')
                # Safe category conversion with error handling
                try:
                    input_data[col] = input_data[col].astype('category').cat.codes + 1
                except (TypeError, ValueError) as e:
                    logging.warning(f"Error converting column {col}: {e}")
                    input_data[col] = 0  # Fallback value
        
        # One-hot encoding with validation
        encoded_data = encoder.transform(input_data[categorical_features])
        encoded_df = pd.DataFrame(
            encoded_data,
            columns=encoder.get_feature_names_out()
        )
        
        # Ensure all feature columns exist
        encoded_df = encoded_df.reindex(columns=feature_names, fill_value=0)
        
        # Safe numeric conversion
        for col in encoded_df.columns:
            encoded_df[col] = pd.to_numeric(encoded_df[col], errors='coerce').fillna(0)
        
        # Ensure all data is float64
        encoded_df = encoded_df.astype(np.float64)
        
        # Scale features
        scaled_data = scaler.transform(encoded_df)
        
        return scaled_data
        
    except Exception as e:
        logging.error(f"Preprocessing error: {str(e)}")
        raise ValueError(f"Error during preprocessing: {str(e)}")

if __name__ == '__main__':
    app.config['UPLOAD_FOLDER'] = 'uploads'
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
