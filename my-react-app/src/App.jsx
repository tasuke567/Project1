import React, { useState } from "react";
import Form from "./Form";
import UploadModel from "./UploadModel";
import NavBar from "./NavBar";
import LoginForm from "./LoginForm";
import TuningForm from "./TuningForm";
import "./output.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showTuningForm, setShowTuningForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true);
      setShowLoginForm(false);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const toggleLoginForm = () => {
    setShowLoginForm((prevShowLoginForm) => !prevShowLoginForm);
  };

  const handleTuningSubmit = async (data) => {
    const formData = new FormData();
    formData.append("max_depth", data.maxDepth);
    formData.append("min_samples_split", data.minSamplesSplit);
    formData.append("min_samples_leaf", data.minSamplesLeaf);
    formData.append("dataset", data.dataset);

    try {
      const response = await fetch(
        "https://project1-l0cx.onrender.com/tune_model",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Model tuning completed successfully");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while tuning the model.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <NavBar
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          toggleLoginForm={toggleLoginForm}
        />
      </header>
      <main>
        {isAuthenticated ? (
          <>
            <button
              onClick={() => setShowTuningForm((prev) => !prev)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              {showTuningForm ? "Hide Tuning Form" : "Show Tuning Form"}
            </button>
            {showTuningForm && <TuningForm onSubmit={handleTuningSubmit} />}
            <UploadModel />
          </>
        ) : (
          showLoginForm && (
            <LoginForm
              handleLogin={handleLogin}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
            />
          )
        )}
        <Form />
      </main>
    </div>
  );
}

export default App;
