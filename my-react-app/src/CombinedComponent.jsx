import React, { useState, useEffect } from "react";
import TuningForm from "./TuningForm";
import TrainingResults from "./TrainingResults";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
function CombinedComponent() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/tune_model`, {
        method: "POST",
        body: formData,
        // ไม่ต้องกำหนด Content-Type header เพราะ FormData จะจัดการให้อัตโนมัติ
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
        setError(null);
        console.log("Model tuned successfully:", data);
      } else {
        setResult(null);
        setError(data.error || "An error occurred");
        console.error("Error tuning model:", data.error);
      }
    } catch (err) {
      setResult(null);
      setError(err.message || "An unexpected error occurred");
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <TuningForm onSubmit={handleFormSubmit} />
      {result && (
        <TrainingResults results={results} />
      )}
      {error && (
        <div className="mt-6 p-6 bg-red-100 shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <pre className="bg-red-100 p-4 rounded text-red-600">{error}</pre>
        </div>
      )}
    </div>
  );
}

export default CombinedComponent;
