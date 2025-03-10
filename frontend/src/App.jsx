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

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {isLoggedIn && <Sidebar handleLogout={handleLogout} />} 
      <Routes>
        {!isLoggedIn ? (
          <Route path="/" element={<LoginPage handleLogin={handleLogin} />} />
        ) : (
          <>
            <Route path="/Home" element={<Home />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Network" element={<Network />} />
            <Route path='Reports' element={<Reports />} />
            <Route path="*" element={<Navigate to="/Home" />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
