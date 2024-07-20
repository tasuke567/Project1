import React, { useState } from "react";
import Form from "./Form";
import CombinedComponent from "./CombinedComponent";
import "./output.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    // Implement your authentication logic here
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="App min-h-screen flex flex-col">
      <header className="App-header">
        <nav className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-2xl font-bold">
              Smartphone Survey
            </div>
            <div>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthenticated(true)} // This will show the login form
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-grow">
        {isAuthenticated ? (
          <CombinedComponent />
        ) : (
          <div className="flex justify-center items-center min-h-full">
            <form
              onSubmit={handleLogin}
              className="max-w-md w-full p-6 bg-white shadow-md rounded-lg text-lg font-medium"
            >
              <h2 className="text-2xl font-bold mb-6">Login</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input w-full"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </button>
            </form>
          </div>
        )}
        <Form />
      </main>
    </div>
  );
}

export default App;
