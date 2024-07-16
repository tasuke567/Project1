from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load the model and feature names
model, feature_names = joblib.load('model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        app.logger.info(f'Received data: {data}')
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        # Extract and validate input data
        input_data = []
        for feature in feature_names:
            if feature not in data:
                app.logger.error(f'Missing feature: {feature}')
                return jsonify({'error': f'Missing feature: {feature}'}), 400
            input_data.append(data[feature])

        input_data = np.array(input_data).reshape(1, -1)
        app.logger.info(f'Input data array: {input_data}')

        # Make prediction
        prediction = model.predict(input_data)
        app.logger.info(f'Prediction: {prediction}')
        return jsonify({'prediction': int(prediction[0])})
    except Exception as e:
        app.logger.error(f'Error during prediction: {e}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
