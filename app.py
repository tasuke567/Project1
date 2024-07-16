from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import logging
import pandas as pd

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

# Load the model and feature names
model, _ = joblib.load('model.pkl')  # Replace 'model.pkl' with your actual model file
feature_names = model.feature_names_  # Or the correct attribute for your model

app.logger.info(f'Expected feature names: {feature_names}')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        app.logger.info(f'Received data: {data}')
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        # Create a DataFrame from the input data
        input_df = pd.DataFrame([data])

        # One-Hot Encoding (replace with your actual feature names)
        input_df = pd.get_dummies(input_df, columns=[
            "เพศ", "ช่วงอายุ", "สถานภาพ", "อาชีพ", "ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน",
            "ปัจจัยที่พิจารณาเมื่อซื้อสมาร์ทโฟนออนไลน์มากที่สุด", "ปัญหาในการซื้อสมาร์ทโฟนออนไลน์"
        ])

        # Ensure all features are present after one-hot encoding
        missing_features = set(feature_names) - set(input_df.columns)
        if missing_features:
            return jsonify({'error': f'Missing features: {", ".join(missing_features)}'}), 400

        # Reorder columns to match the model's expected order
        input_df = input_df[feature_names]

        # Make prediction
        prediction = model.predict(input_df)
        app.logger.info(f'Prediction: {prediction}')
        return jsonify({'prediction': int(prediction[0])})
    except Exception as e:
        app.logger.error(f'Error during prediction: {e}')
        return jsonify({'error': 'Internal server error'}), 500
