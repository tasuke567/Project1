from flask import Flask, request, jsonify
from flask_cors import CORS
from model import ModelComponents  # Adjust the import path to where it's defined
import joblib
import os
import pandas as pd
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, f1_score
from flask import Flask, request, jsonify
import numpy as np



app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/predict": {"origins": "*"},
    r"/upload_dataset": {"origins": "*"},
    r"/tune_model": {"origins": "*"}
})

# Add CORS headers to all responses
@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Load the model and other components
def load_model():
    try:
        model_data = joblib.load('best_decision_tree.joblib')
        print("✅ Model loaded successfully")
        # ตรวจสอบว่า model_components เป็น instance ของ ModelComponents
        if not isinstance(model_data, ModelComponents):
            raise TypeError("❌ The loaded model is not a valid ModelComponents object!")
        # Assuming model_data is a ModelComponents object
        model = model_data.model  # Access the trained model
        encoder = model_data.encoder  # Access the encoder
        scaler = model_data.scaler  # Access the scaler
        label_encoder = model_data.label_encoder  # Access the label encoder
        feature_names = model_data.feature_names  # Access feature names
        categorical_features = model_data.categorical_features  # Access categorical features
        print(model_data)  # Check what it returns
        print(type(model_data))  # Check the type

        return model_data  # Return the ModelComponents object

    except Exception as e:
        print(f"❌ Model load failed: {str(e)}")
        return None


model_components = load_model()

# Route for making predictions
@app.route('/predict', methods=['POST'])
def predict():
    if not model_components:
        return jsonify({"error": "Model not loaded", "success": False}), 500
    
    try:
        # Get input data from the request
        data = request.get_json()
        input_df = pd.DataFrame([data])  # Convert input data to DataFrame

        # Ensure the input contains the required categorical features
        input_df = input_df[model_components.categorical_features]

        # One-hot encode the categorical features
        encoded_input = model_components.encoder.transform(input_df)

        # Convert to DataFrame and reorder columns
        encoded_df = pd.DataFrame(encoded_input, columns=model_components.encoder.get_feature_names_out(model_components.categorical_features))
        
        # Ensure the columns match the feature names the model expects
        encoded_df = encoded_df[model_components.feature_names]

        # Rescale the data using the trained scaler
        scaled_input = model_components.scaler.transform(encoded_df)

        # Ensure the input is a 2D array
        if scaled_input.ndim == 1:
            scaled_input = scaled_input.reshape(1, -1)

        # Make prediction
        prediction = model_components.model.predict(scaled_input)

        # Convert numerical prediction back to the original label
        brand = model_components.label_encoder.inverse_transform(prediction)
        
        return jsonify({
            "success": True,
            "prediction": brand[0]
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Prediction failed: {str(e)}"
        }), 400

if __name__ == '__main__':
    app.run(debug=True)
    app.run(host='0.0.0.0', port=5000)
