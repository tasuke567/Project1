class ModelComponents:
    def __init__(self, model, encoder, scaler, label_encoder, feature_names, categorical_features):
        self.model = model
        self.encoder = encoder
        self.scaler = scaler
        self.label_encoder = label_encoder
        self.feature_names = feature_names
        self.categorical_features = categorical_features
