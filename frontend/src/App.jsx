import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Network from './pages/Network';
import LoginPage from './pages/LoginPage';
import Reports from './pages/Reports';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogin = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      if (!token || !username) {
        setIsLoggedIn(false);
        navigate('/'); // Redirect to login page
        return;
      }

      // Send logout request
      const response = await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) throw new Error('Logout failed');

      console.log(`User ${username} logged out`);

      // Clear local storage and update state
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <ToastContainer
        autoClose={2500}
        closeButton={true}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
      />
      {isLoggedIn && <Sidebar handleLogout={handleLogout} />}
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/" element={<LoginPage handleLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/Home" element={<Home />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/Settings" element={<Settings handleLogout={handleLogout} />} />
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
