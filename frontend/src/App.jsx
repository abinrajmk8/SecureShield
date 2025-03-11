import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Network from './pages/Network';
import LoginPage from './pages/LoginPage';
import Reports from './pages/Reports';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogin = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username); // Store username
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username'); // Retrieve username

      if (!token || !username) return;

      // Send logout request with username
      await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username }) // Send username
      });

      console.log(`User ${username} logged out`);

      // Clear token and username from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {isLoggedIn && <Sidebar handleLogout={handleLogout} />}
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/" element={<LoginPage handleLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} /> {/* Always redirect to login */}
          </>
        ) : (
          <>
            <Route path="/Home" element={<Home />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Network" element={<Network />} />
            <Route path="/Reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/Home" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;