from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import pickle
from model.model_components import ModelComponents

# Define ModelComponents class BEFORE loading joblib
class ModelComponents:
    def __init__(self, model, encoder, scaler, label_encoder, feature_names, categorical_features):
        self.model = model
        self.encoder = encoder
        self.scaler = scaler
        self.label_encoder = label_encoder
        self.feature_names = feature_names
        self.categorical_features = categorical_features

# Load model components at the start of the app
try:
    with open("./model/best_decision_tree.pkl", "rb") as f:
        model_components = pickle.load(f, fix_imports=True)

    model = model_components.model
    encoder = model_components.encoder
    scaler = model_components.scaler
    label_encoder = model_components.label_encoder
    categorical_features = model_components.categorical_features

    # Check if the model is loaded successfully
    if not all([model, encoder, scaler, label_encoder]):
        raise ValueError("One or more model components failed to load.")

except Exception as e:
    model = encoder = scaler = label_encoder = categorical_features = None
    print(f"Error loading model components: {str(e)}")

# Create FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request model
class SmartphoneFeatures(BaseModel):
    features: dict

@app.get("/health")
def health_check():
    if model:
        return {"status": "ok"}
    return {"status": "error", "message": "Model not loaded"}

@app.post("/predict")
def predict(data: SmartphoneFeatures):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        input_data = [data.features.get(col, "Unknown") for col in categorical_features]
        encoded_input = encoder.transform([input_data])
        scaled_input = scaler.transform(encoded_input)
        prediction = model.predict(scaled_input)
        predicted_label = label_encoder.inverse_transform(prediction)[0]
        return {"predicted_brand": predicted_label}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
