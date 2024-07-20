import React from "react";

function LoginForm({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) {
  return (
    <form
      onSubmit={handleLogin}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg text-lg font-medium mt-6"
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
  );
}

export default LoginForm;
