import React, { useState } from "react";
import CombinedComponent from "./CombinedComponent";
import "./style/output.css";
import Form from "./Form";
import NavBar from "./NavBar"
import LoginForm from "./LoginForm";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);


  const handleLogin = (username, password) => {
    // Implement your authentication logic here
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
    setShowLoginForm(!showLoginForm);
  };

  return (
    <div className="App">
      <header className="App-header">
        <NavBar 
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        toggleLoginForm={toggleLoginForm} />
      </header>
      <main>
        {showLoginForm && !isAuthenticated && (
          <LoginForm onLogin={handleLogin} />
        )}
        {isAuthenticated && <CombinedComponent />}
      </main>
      <Form />
    </div>
  );
}

export default App;
