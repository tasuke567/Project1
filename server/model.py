from dataclasses import dataclass
from typing import Any, List
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder

@dataclass
class ModelComponents:
    model: Any
    encoder: OneHotEncoder
    scaler: StandardScaler
    label_encoder: LabelEncoder
    feature_names: List[str]
    categorical_features: List[str] 