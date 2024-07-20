import React, { useState } from "react";

function TuningForm({ onSubmit }) {
  const [maxDepth, setMaxDepth] = useState("");
  const [minSamplesSplit, setMinSamplesSplit] = useState("");
  const [minSamplesLeaf, setMinSamplesLeaf] = useState("");
  const [dataset, setDataset] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ maxDepth, minSamplesSplit, minSamplesLeaf, dataset });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg text-lg font-medium mt-6"
    >
      <h2 className="text-2xl font-bold mb-6">Tune Model</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Max Depth</label>
        <input
          type="number"
          value={maxDepth}
          onChange={(e) => setMaxDepth(e.target.value)}
          className="form-input w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Min Samples Split</label>
        <input
          type="number"
          value={minSamplesSplit}
          onChange={(e) => setMinSamplesSplit(e.target.value)}
          className="form-input w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Min Samples Leaf</label>
        <input
          type="number"
          value={minSamplesLeaf}
          onChange={(e) => setMinSamplesLeaf(e.target.value)}
          className="form-input w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Upload Dataset</label>
        <input
          type="file"
          onChange={(e) => setDataset(e.target.files[0])}
          className="form-input w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  );
}

export default TuningForm;
