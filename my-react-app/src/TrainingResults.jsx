import React from "react";

const TrainingResults = ({ results, error }) => {
  if (!results) {
    // ถ้ามี error ให้แสดง error แทนข้อความรอผลลัพธ์
    if (error) {
      return <div className="error-message text-red-500">{error}</div>;
    } else {
      return <div>รอผลการฝึก...</div>; 
    }
  }

  const {
    cross_validation_scores,
    mean_cross_validation_accuracy,
    classification_report,
    accuracy,
  } = results;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Training Results</h2>

      {/* Cross-Validation Scores */}
      {cross_validation_scores && cross_validation_scores.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Cross-Validation Scores:</h3>
          <ul className="list-disc pl-5">
            {cross_validation_scores.map((score, index) => (
              <li key={index}>Fold {index + 1}: {score.toFixed(4)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Mean Cross-Validation Accuracy */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Mean Cross-Validation Accuracy:</h3>
        <p>{mean_cross_validation_accuracy.toFixed(4)}</p>
      </div>

      {/* Accuracy */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Accuracy:</h3>
        <p>{accuracy.toFixed(4)}</p>
      </div>

      {/* Classification Report */}
      <div className="mb-4" style={{ overflowX: 'auto' }}>
        <h3 className="text-xl font-semibold">Classification Report:</h3>
        <table className="min-w-full bg-white border border-gray-300 ">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Class</th>
              <th className="border p-2">Precision</th>
              <th className="border p-2">Recall</th>
              <th className="border p-2">F1-score</th>
              <th className="border p-2">Support</th>
            </tr>
          </thead>
          <tbody>
          {Object.entries(classification_report).map(
              ([key, value]) =>
                key !== "accuracy" && (
                <tr key={key}>
                  <td className="border p-2">{key}</td>
                  <td className="border p-2">{value.precision.toFixed(2)}</td>
                  <td className="border p-2">{value.recall.toFixed(2)}</td>
                  <td className="border p-2">{value["f1-score"].toFixed(2)}</td>
                  <td className="border p-2">{value.support}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainingResults;