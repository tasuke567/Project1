class ModelComponents:
    def __init__(self, model, encoder, scaler, label_encoder, feature_names, categorical_features):
        self.model = model
        self.encoder = encoder
        self.scaler = scaler
        self.label_encoder = label_encoder
        self.feature_names = feature_names
        self.categorical_features = categorical_features

    def predict(self, data):
        # Preprocess input data
        encoded = self.encoder.transform(data[self.categorical_features])
        scaled = self.scaler.transform(encoded)
        
        # Make prediction
        prediction = self.model.predict(scaled)
        
        # Return the decoded label (brand)
        brand = self.label_encoder.inverse_transform(prediction)
        return brand[0]
