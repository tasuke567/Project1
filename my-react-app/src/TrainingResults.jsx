import React from "react";

const TrainingResults = ({ results }) => {
  if (!results) return null;

  const {
    cross_validation_scores,
    mean_cross_validation_accuracy,
    classification_report,
    accuracy,
  } = results;

  const renderClassificationReport = () => {
    if (typeof classification_report === "string") {
      return (
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
          {classification_report}
        </pre>
      );
    } else if (typeof classification_report === "object") {
      return (
        <table className="min-w-full bg-white border border-gray-300">
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
                    <td className="border p-2">
                      {value.precision?.toFixed(2) || "N/A"}
                    </td>
                    <td className="border p-2">
                      {value.recall?.toFixed(2) || "N/A"}
                    </td>
                    <td className="border p-2">
                      {value["f1-score"]?.toFixed(2) || "N/A"}
                    </td>
                    <td className="border p-2">{value.support || "N/A"}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      );
    }
    return (
      <p className="text-red-500">
        Classification report format not recognized
      </p>
    );
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Training Results</h2>
      {cross_validation_scores && cross_validation_scores.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Cross-Validation Scores:</h3>
          <ul className="list-disc pl-5">
            {cross_validation_scores.map((score, index) => (
              <li key={index} className="mb-1">
                Fold {index + 1}:{" "}
                {typeof score === "number" ? score.toFixed(4) : score}
              </li>
            ))}
          </ul>
        </div>
      )}
      {mean_cross_validation_accuracy !== undefined && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">
            Mean Cross-Validation Accuracy:
          </h3>
          <p className="text-lg">
            {typeof mean_cross_validation_accuracy === "number"
              ? mean_cross_validation_accuracy.toFixed(4)
              : mean_cross_validation_accuracy}
          </p>
        </div>
      )}
      {accuracy !== undefined && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Accuracy:</h3>
          <p className="text-lg">
            {typeof accuracy === "number" ? accuracy.toFixed(4) : accuracy}
          </p>
        </div>
      )}
      {classification_report && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Classification Report:</h3>
          {renderClassificationReport()}
        </div>
      )}
    </div>
  );
};

export default TrainingResults;
