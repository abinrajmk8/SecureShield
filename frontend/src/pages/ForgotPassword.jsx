// ForgotPassword.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset link has been sent to your email.");
        setError("");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setError(data.message || "Something went wrong.");
        setMessage("");
      }
    } catch (err) {
      console.error("Forgot password fetch error:", err); // Add detailed logging
      setError(`An error occurred: ${err.message}. Please try again.`);
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-900 relative">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 relative"
      >
        <motion.h1
          className="text-2xl mb-4 text-center font-bold text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Reset Password
        </motion.h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {message && (
            <div className="mb-4 text-green-400 text-center">{message}</div>
          )}
          {error && (
            <div className="mb-4 text-red-400 text-center">{error}</div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded shadow-md"
          >
            Send Reset Link
          </motion.button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;