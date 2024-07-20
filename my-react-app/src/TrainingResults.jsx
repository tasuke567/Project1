import React from "react";

const TrainingResults = ({ results }) => {
  if (!results) return null;

  const {
    cross_validation_scores,
    mean_cross_validation_accuracy,
    classification_report,
    accuracy,
  } = results;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Training Results</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Cross-Validation Scores:</h3>
        <ul>
          {cross_validation_scores.map((score, index) => (
            <li key={index}>
              Fold {index + 1}: {score}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">
          Mean Cross-Validation Accuracy:
        </h3>
        <p>{mean_cross_validation_accuracy}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Accuracy:</h3>
        <p>{accuracy}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Classification Report:</h3>
        <pre>{JSON.stringify(classification_report, null, 2)}</pre>
      </div>
    </div>
  );
};

export default TrainingResults;
