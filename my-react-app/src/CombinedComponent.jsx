import React, { useState } from "react";

const CombinedComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingDataset, setExistingDataset] = useState("");
  const [maxDepth, setMaxDepth] = useState("");
  const [minSamplesSplit, setMinSamplesSplit] = useState(2);
  const [minSamplesLeaf, setMinSamplesLeaf] = useState(1);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleExistingDatasetChange = (event) => {
    setExistingDataset(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (selectedFile) {
      formData.append("dataset", selectedFile);
    } else {
      formData.append("existingDataset", existingDataset);
    }
    formData.append("max_depth", maxDepth);
    formData.append("min_samples_split", minSamplesSplit);
    formData.append("min_samples_leaf", minSamplesLeaf);

    try {
      const response = await fetch(
        "https://project1-l0cx.onrender.com/tune_model",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg text-lg font-medium">
      <h2 className="text-2xl font-bold mb-6">Tune Model</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Select Existing Dataset
          </label>
          <select
            value={existingDataset}
            onChange={handleExistingDatasetChange}
            className="form-select w-full"
          >
            <option value="">Select a dataset</option>
            <option value="dataset1.csv">Dataset 1</option>
            <option value="dataset2.csv">Dataset 2</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Or Upload a New Dataset
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="form-input w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Max Depth</label>
          <input
            type="number"
            value={maxDepth}
            onChange={(e) => setMaxDepth(e.target.value)}
            className="form-input w-full"
            placeholder="Leave empty for default"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Min Samples Split</label>
          <input
            type="number"
            value={minSamplesSplit}
            onChange={(e) => setMinSamplesSplit(e.target.value)}
            className="form-input w-full"
            min="2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Min Samples Leaf</label>
          <input
            type="number"
            value={minSamplesLeaf}
            onChange={(e) => setMinSamplesLeaf(e.target.value)}
            className="form-input w-full"
            min="1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CombinedComponent;
