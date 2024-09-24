import React, { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
import TrainingResults from "./TrainingResults";
function TuningForm({ onSubmit }) {
  const [result, setResult] = useState(null);
  const [tuningData, setTuningData] = useState({
    maxDepth: "",
    minSamplesSplit: "",
    minSamplesLeaf: "",
  });
  const [error, setError] = useState(null);
  const [availableDatasets, setAvailableDatasets] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/datasets`)
      .then((response) => response.json())
      .then((data) => setAvailableDatasets(data))
      .catch((error) => console.error("Error fetching datasets:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTuningData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleDatasetCheckboxChange = (e) => {
  //   const { value, checked } = e.target;
  //   setTuningData((prevData) => {
  //     const newExistingDataset = [...prevData.existingDataset];
  //     if (checked) {
  //       // Add to array if checked and not already included
  //       if (!newExistingDataset.includes(value)) {
  //         newExistingDataset.push(value);
  //       }
  //     } else {
  //       // Remove from array if unchecked
  //       const index = newExistingDataset.indexOf(value);
  //       if (index > -1) {
  //         newExistingDataset.splice(index, 1);
  //       }
  //     }
  //     return { ...prevData, existingDataset: newExistingDataset };
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const formData = new FormData(e.target);
    console.log("Form data before sending:", Object.fromEntries(formData));
    const selectedDataset = formData.get("dataset");
    if (!selectedDataset) {
      setError("Please select a dataset");
      return;
    }
    let minSamplesSplit = parseInt(tuningData.minSamplesSplit);
    if (isNaN(minSamplesSplit) || minSamplesSplit < 2) {
    minSamplesSplit = 2; // ตั้งค่าเริ่มต้นเป็น 2 ถ้าค่าไม่ถูกต้อง
    setError("Min Samples Split ต้องมีค่าอย่างน้อย 2");
    return; 
  }
    formData.append("max_depth", tuningData.maxDepth);
    formData.append("min_samples_split", tuningData.minSamplesSplit);
    formData.append("min_samples_leaf", tuningData.minSamplesLeaf);

    try {
      const response = await fetch(`http://127.0.0.1:5000/tune_model`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }

      const result = await response.json();
      console.log("classification_report:", result.classification_report); // ตรวจสอบโครงสร้าง
      setResult(result);
      setError(null);
    } catch (err) {
      setResult(null);
      console.error("Error in form submission:", err);
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg text-lg font-medium mt-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Tune Model</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Max Depth</label>
          <input
            type="number"
            name="maxDepth"
            value={tuningData.maxDepth}
            onChange={handleChange}
            className="form-input w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Min Samples Split</label>
          <input
            type="number"
            name="minSamplesSplit"
            value={tuningData.minSamplesSplit}
            onChange={handleChange}
            className="form-input w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Min Samples Leaf</label>
          <input
            type="number"
            name="minSamplesLeaf"
            value={tuningData.minSamplesLeaf}
            onChange={handleChange}
            className="form-input w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="dataset">Select Dataset:</label>
          <select name="dataset" id="dataset" required>
            <option value="">-- Select a dataset --</option>
            {availableDatasets.map((dataset) => (
              <option key={dataset} value={dataset}>
                {dataset}
              </option>
            ))}
          </select>
        </div>
        {error && <div className="error-message text-red-500">{error}</div>}
        {result && (
          <div className="result-message mt-4">
            <TrainingResults results={result} error={error} /> {/* ส่ง result ไปยัง TrainingResults */}
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default TuningForm;
