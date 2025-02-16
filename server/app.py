from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
from fastapi.middleware.cors import CORSMiddleware
from model.model_components import ModelComponents  # Import ModelComponents here

# Define the global model components variable
model_components = None

def load_model():
    global model_components
    try:
        with open("./model/best_decision_tree.pkl", "rb") as f:
            model_components = pickle.load(f, fix_imports=True)

        model = model_components.model
        encoder = model_components.encoder
        scaler = model_components.scaler
        label_encoder = model_components.label_encoder
        categorical_features = model_components.categorical_features

        # Ensure all components are loaded correctly
        if not all([model, encoder, scaler, label_encoder]):
            raise ValueError("One or more model components failed to load.")
    except Exception as e:
        model_components = None
        print(f"Error loading model components: {str(e)}")

# Call load_model before the FastAPI app starts
load_model()

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
    if model_components:
        return {"status": "ok"}
    return {"status": "error", "message": "Model not loaded"}

@app.post("/predict")
def predict(data: SmartphoneFeatures):
    if not model_components:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Access components from the global model_components variable
        input_data = [data.features.get(col, "Unknown") for col in model_components.categorical_features]
        encoded_input = model_components.encoder.transform([input_data])
        scaled_input = model_components.scaler.transform(encoded_input)
        prediction = model_components.model.predict(scaled_input)
        predicted_label = model_components.label_encoder.inverse_transform(prediction)[0]
        return {"predicted_brand": predicted_label}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
