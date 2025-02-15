from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import pandas as pd
from model.model import ModelComponents  # Direct import now

app = Flask(__name__)
CORS(app)

try:
    model_path = os.path.join(os.path.dirname(__file__), 'model/best_decision_tree.joblib')
    if os.path.exists(model_path):
        model_data = joblib.load(model_path)
        print(f"✅ Model loaded successfully from {model_path}")
    else:
        print(f"❌ Model file not found at {model_path}")
    model_data = None
    model_data = joblib.load(model_path)
    print(f"✅ Model loaded successfully from {model_path}")
except Exception as e:
    print(f"❌ Model load failed: {str(e)}")
    model_data = None

@app.route('/predict', methods=['POST'])
def predict():
    if not model_data:
        return jsonify({"error": "Model not loaded", "success": False}), 500
        
    try:
        data = request.get_json()
        input_df = pd.DataFrame([data])
        
        # Preprocessing
        encoded = model_data.encoder.transform(input_df[model_data.categorical_features])
        scaled = model_data.scaler.transform(encoded)
        
        # Prediction
        prediction = model_data.model.predict(scaled)
        brand = model_data.label_encoder.inverse_transform(prediction)
        
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
    app.run(host='0.0.0.0', port=5000)
