from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from joblib import load
import pickle
from multiprocessing import Manager
from fastapi.middleware.cors import CORSMiddleware
from model_components import ModelComponents  # Import ModelComponents here

# Define the global model components variable
model_components = None

manager = Manager()
model_components = manager.dict()

def load_model():
    try:
        with open("./model/best_decision_tree.pkl", "rb") as f:
            model = pickle.load(f, fix_imports=True)
            model_components["model"] = model.model
            model_components["encoder"] = model.encoder
            model_components["scaler"] = model.scaler
            model_components["label_encoder"] = model.label_encoder
            model_components["categorical_features"] = model.categorical_features
    except Exception as e:
        print(f"Error loading model components: {str(e)}")
        model_components.clear()
        
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
