from flask import Flask, request, jsonify
import pickle
import os

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    df = pd.DataFrame(data)
    model = load_model()
    prediction = model.predict(df)
    return jsonify(prediction.tolist())

@app.route('/upload_model', methods=['POST'])
def upload_model():
    if 'model' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['model']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        update_model(filename)
        return jsonify({"message": "Model updated successfully"}), 200

@app.route('/tune_model', methods=['POST'])
def tune_model():
    max_depth = request.json.get('max_depth')
    min_samples_split = request.json.get('min_samples_split')
    min_samples_leaf = request.json.get('min_samples_leaf')
    dataset_file = request.files['dataset']

    # Read the dataset
    df = pd.read_csv(dataset_file)
    X = df.drop('target', axis=1)
    y = df['target']

    # Train the model
    model = DecisionTreeClassifier(
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        min_samples_leaf=min_samples_leaf
    )
    model.fit(X, y)

    # Save the model
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)

    return jsonify({"message": "Model tuned and saved successfully."})

def load_model():
    with open('model.pkl', 'rb') as f:
        return pickle.load(f)

def update_model(filename):
    with open(filename, 'rb') as f:
        model = pickle.load(f)
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pkl'}

if __name__ == '__main__':
    app.config['UPLOAD_FOLDER'] = 'uploads'
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
