import React, { useState } from "react";

function UploadModel() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("model", file);

    try {
      const response = await fetch(
        "https://project1-l0cx.onrender.com/upload_model",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while uploading the model.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg text-lg font-medium">
      <h1 className="text-2xl font-bold mb-6">Upload New Model</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input type="file" onChange={handleFileChange} />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload Model
        </button>
      </form>
    </div>
  );
}

export default UploadModel;
