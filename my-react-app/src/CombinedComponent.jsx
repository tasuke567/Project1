import React, { useState } from "react";
import axios from "axios";

const CombinedComponent = () => {
  const [maxDepth, setMaxDepth] = useState("");
  const [minSamplesSplit, setMinSamplesSplit] = useState("");
  const [minSamplesLeaf, setMinSamplesLeaf] = useState("");
  const [existingDataset, setExistingDataset] = useState("dataset1.csv");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    const formData = new FormData();
    formData.append("max_depth", maxDepth);
    formData.append("min_samples_split", minSamplesSplit);
    formData.append("min_samples_leaf", minSamplesLeaf);
    formData.append("existing_dataset", existingDataset);

    try {
      const response = await axios.post(
        "https://project1-l0cx.onrender.com/tune_model",
        formData
      );
      setResult(response.data);
    } catch (error) {
      console.error("Error tuning model:", error);
      setError(
        error.response ? error.response.data : "An unknown error occurred"
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Tune Model</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Max Depth:</label>
            <input
              type="number"
              value={maxDepth}
              onChange={(e) => setMaxDepth(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700">Min Samples Split:</label>
            <input
              type="number"
              value={minSamplesSplit}
              onChange={(e) => setMinSamplesSplit(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700">Min Samples Leaf:</label>
            <input
              type="number"
              value={minSamplesLeaf}
              onChange={(e) => setMinSamplesLeaf(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700">Existing Dataset:</label>
            <select
              value={existingDataset}
              onChange={(e) => setExistingDataset(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="dataset1.csv">dataset1.csv</option>
              <option value="dataset2.csv">dataset2.csv</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md"
            >
              Tune Model
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-4 text-red-600">
            <strong>Error:</strong> {error}
          </div>
        )}
        {result && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Model Tuning Results:</h3>
            <p>
              <strong>Cross-Validation Scores:</strong>{" "}
              {result.cross_validation_scores.join(", ")}
            </p>
            <p>
              <strong>Mean Cross-Validation Accuracy:</strong>{" "}
              {result.mean_cross_validation_accuracy}
            </p>
            <pre>
              <strong>Classification Report:</strong>{" "}
              {JSON.stringify(result.classification_report, null, 2)}
            </pre>
            <p>
              <strong>Accuracy:</strong> {result.accuracy}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedComponent;
