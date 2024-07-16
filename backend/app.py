import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load the model and feature names
model, feature_names = joblib.load('./mnt/data/model.pkl')

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    df = pd.DataFrame(data)
    
    # Ensure the feature names match
    for col in feature_names:
        if col not in df.columns:
            df[col] = 0

    # Reorder columns to match the feature names used during training
    df = df[feature_names]
    
    # Make prediction
    prediction = model.predict(df)
    
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
