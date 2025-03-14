import React from "react";

function NavBar({ isAuthenticated, handleLogout, toggleLoginForm }) {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Smartphone Survey</div>
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
              onClick={toggleLoginForm}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {/* Login */}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
