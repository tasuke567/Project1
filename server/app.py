from flask import Flask, request, jsonify, abort  # Include 'abort' in the import
import pandas as pd
import joblib
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV, cross_val_score
from sklearn.preprocessing import OneHotEncoder, LabelEncoder, StandardScaler
from imblearn.over_sampling import SMOTE
from collections import Counter
from sklearn.metrics import classification_report, accuracy_score
import warnings
import os
from flask_cors import CORS
import logging
from werkzeug.utils import secure_filename

warnings.filterwarnings('ignore')
# Load the model and feature names
model_data = joblib.load('./model/best_decision_tree_with_features.joblib')
model = model_data['model']
feature_names = model_data['feature_names']
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['DATASETS_FOLDER'] = './datasets'
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        logging.info("Received a prediction request")
        data = request.get_json(force=True)

        # ตรวจสอบว่ามี feature_names ใน model_data หรือไม่
        if 'feature_names' in model_data:
            feature_names = model_data['feature_names']
        else:
            raise KeyError("'feature_names' key not found in model data")

        # ตรวจสอบว่า data เป็น dict หรือไม่
        if isinstance(data, dict):
            data = [data]

        df = pd.DataFrame(data)

        # ตรวจสอบให้แน่ใจว่าฟีเจอร์ที่จำเป็นมีอยู่
        for col in feature_names:
            if col not in df.columns:
                df[col] = 0  # เพิ่มคอลัมน์ใหม่ด้วยค่า 0 ถ้าขาด

        # จัดเรียงคอลัมน์ให้ตรงตามชื่อฟีเจอร์ที่ใช้ในการฝึก
        df = df.reindex(columns=feature_names, fill_value=0)

        # ตรวจสอบจำนวนฟีเจอร์
        if df.shape[1] != len(feature_names):
            raise ValueError(f"Input data has {df.shape[1]} features, but the model expects {len(feature_names)} features.")

        # คาดการณ์ผลลัพธ์
        prediction = model.predict(df)

        logging.info(f"Prediction result: {prediction.tolist()}")
        
        return jsonify({'prediction': prediction.tolist()})

    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500


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

if __name__ == '__main__':
    app.config['UPLOAD_FOLDER'] = 'uploads'
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)