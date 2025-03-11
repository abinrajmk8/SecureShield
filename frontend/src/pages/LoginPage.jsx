import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoginPage = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username); // Store username in localStorage
        localStorage.setItem("role", data.role); // Store role in localStorage
        handleLogin(data.token, username); // Pass username to handleLogin
        setError(""); // Clear error on success
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-900 relative">
      {/* Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 relative"
      >
        {/* Warning Sign (Above the Form) */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute -top-16 left-0 right-0 mx-auto bg-red-600 text-white text-lg font-bold py-3 px-6 rounded-lg shadow-lg text-center"
            >
              ⚠ Incorrect Credentials ⚠
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <motion.h1
          className="text-2xl mb-4 text-center font-bold text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Login
        </motion.h1>

        <form onSubmit={onSubmit} action="/api/login" method="POST">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-white">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username" // Add name attribute
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="username" // Enable autocomplete for username
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password" // Add name attribute
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(""); // Clear error when typing
              }}
              className="w-full px-3 py-2 mt-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="current-password" // Enable autocomplete for password
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded shadow-md"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;