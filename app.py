from flask import Flask, request, jsonify
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV, cross_val_score
from sklearn.preprocessing import OneHotEncoder, LabelEncoder, StandardScaler
from imblearn.over_sampling import SMOTE
from collections import Counter
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import warnings
import joblib
import os
from werkzeug.utils import secure_filename
import pickle

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    df = pd.DataFrame(data)
    model = load_model()
    prediction = model.predict(df)
    return jsonify(prediction.tolist())

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

@app.route('/tune_model', methods=['POST'])
def tune_model():
    if 'dataset' not in request.files and 'existingDataset' not in request.form:
        return jsonify({"error": "No dataset file provided"}), 400

    # Use the existing dataset if provided
    if 'existingDataset' in request.form:
        dataset_name = request.form['existingDataset']
        # Load the dataset from a predefined location
        dataset_file = os.path.join('datasets', dataset_name)
        df = pd.read_csv(dataset_file)
    else:
        # Load dataset from the uploaded file
        dataset_file = request.files['dataset']
        df = pd.read_csv(dataset_file)

    # Extract hyperparameters from form data
    max_depth = request.form.get('max_depth', default=None, type=int)
    min_samples_split = request.form.get('min_samples_split', default=2, type=int)
    min_samples_leaf = request.form.get('min_samples_leaf', default=1, type=int)

    # Handle missing values
    df.fillna('Unknown', inplace=True)

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

    # Handle missing values before encoding
    X_train = X_train.fillna(X_train.mean())
    X_test = X_test.fillna(X_test.mean())

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
    report = classification_report(y_test, y_pred, target_names=y_encoder.classes_, output_dict=True, zero_division=0)
    accuracy = accuracy_score(y_test, y_pred)

    response = {
        "message": "Model tuned and saved successfully.",
        "cross_validation_scores": cv_scores.tolist(),
        "mean_cross_validation_accuracy": cv_mean,
        "classification_report": report,
        "accuracy": accuracy
    }

    return jsonify(response)
def load_model():
    with open('model.pkl', 'rb') as f:
        return pickle.load(f)

def update_model(filename):
    with open(filename, 'rb') as f:
        model = pickle.load(f)
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pkl'}

if __name__ == '__main__':
    app.config['UPLOAD_FOLDER'] = 'uploads'
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
