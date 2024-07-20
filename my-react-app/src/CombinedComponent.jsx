import React, { useState } from "react";
import axios from "axios";

const CombinedComponent = () => {
  const [maxDepth, setMaxDepth] = useState("");
  const [minSamplesSplit, setMinSamplesSplit] = useState("");
  const [minSamplesLeaf, setMinSamplesLeaf] = useState("");
  const [existingDataset, setExistingDataset] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("max_depth", maxDepth);
    formData.append("min_samples_split", minSamplesSplit);
    formData.append("min_samples_leaf", minSamplesLeaf);
    formData.append("existing_dataset", existingDataset);

    console.log("FormData entries:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/tune_model",
        formData
      );
      setResult(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error tuning model:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Max Depth:</label>
          <input
            type="number"
            value={maxDepth}
            onChange={(e) => setMaxDepth(e.target.value)}
          />
        </div>
        <div>
          <label>Min Samples Split:</label>
          <input
            type="number"
            value={minSamplesSplit}
            onChange={(e) => setMinSamplesSplit(e.target.value)}
          />
        </div>
        <div>
          <label>Min Samples Leaf:</label>
          <input
            type="number"
            value={minSamplesLeaf}
            onChange={(e) => setMinSamplesLeaf(e.target.value)}
          />
        </div>
        <div>
          <label>Existing Dataset:</label>
          <select
            value={existingDataset}
            onChange={(e) => setExistingDataset(e.target.value)}
          >
            <option value="">Select Dataset</option>
            <option value="dataset1.csv">dataset1.csv</option>
            <option value="dataset2.csv">dataset2.csv</option>
          </select>
        </div>
        <button type="submit">Tune Model</button>
      </form>
      {result && (
        <div>
          <h2>Model Tuning Results:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CombinedComponent;
