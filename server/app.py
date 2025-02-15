from flask import Flask, request, jsonify
import joblib
import os
import pandas as pd
from flask_cors import CORS
from .model import ModelComponents  # 👈 Import from module

app = Flask(__name__)
CORS(app)

try:
    model_path = os.path.join(os.path.dirname(__file__), 'model/best_decision_tree.joblib')
    model_data = joblib.load(model_path)
    print("✅ Model loaded successfully!")
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
        
        encoded = model_data.encoder.transform(input_df[model_data.categorical_features])
        scaled = model_data.scaler.transform(encoded)
        
        prediction = model_data.model.predict(scaled)
        brand = model_data.label_encoder.inverse_transform(prediction)
        
        return jsonify({
            "success": True,
            "prediction": brand[0],
            "features_used": list(model_data.feature_names)
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Prediction failed: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
