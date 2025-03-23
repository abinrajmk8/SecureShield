import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Toggle from '../components/common/Toggle';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { User, Shield, Bell, Lock, LogOut, Edit } from 'lucide-react';

const Settings = ({ handleLogout }) => {
  const [arpSpoofDetector, setArpSpoofDetector] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [editName, setEditName] = useState(false); // Toggle for editing name
  const [name, setName] = useState(''); // State for user's name

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/currentUser', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const userData = await response.json();
        setCurrentUser(userData);
        setName(userData.name); // Set the user's name
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch ARP Spoof Detector value on page load
  useEffect(() => {
    const fetchArpSpoofDetector = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/settings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch ARP Spoof Detector value');
        const data = await response.json();
        setArpSpoofDetector(data.arpspoofedetector);
      } catch (error) {
        console.error('Error fetching ARP Spoof Detector value:', error);
      }
    };
    fetchArpSpoofDetector();
  }, []);

  // Update ARP Spoof Detector value
  const handleArpSpoofDetectorToggle = async () => {
    const newValue = !arpSpoofDetector;
    try {
      const response = await fetch('http://localhost:3000/api/settings/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ arpspoofedetector: newValue }),
      });
      if (!response.ok) throw new Error('Failed to update ARP Spoof Detector value');
      setArpSpoofDetector(newValue);
    } catch (error) {
      console.error('Error updating ARP Spoof Detector value:', error);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!response.ok) throw new Error('Failed to update password');
      alert('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password update error:', error);
      alert('Error updating password.');
    }
  };

  const handleUpdateName = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error('Failed to update name');
      alert('Name updated successfully!');
      setEditName(false); // Close edit mode
    } catch (error) {
      console.error('Name update error:', error);
      alert('Error updating name.');
    }
  };

  // Function to generate initials
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    } else {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-850 text-[#c9d1d9] min-h-screen">
      <Header title="Settings" />
      <main className="max-w-5xl mx-auto py-8 px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg border border-[#30363d]">
          {currentUser && (
            <div className="flex flex-col items-center space-y-4">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border border-[#30363d]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border border-[#30363d] flex items-center justify-center bg-blue-500 text-white text-2xl font-semibold">
                  {getInitials(currentUser.name)}
                </div>
              )}
              <div className="text-center">
                {editName ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-32"
                    />
                    <Button onClick={handleUpdateName} className="bg-[#238636] hover:bg-[#2ea043]">
                      Save
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-semibold">{name}</p>
                    <Edit
                      className="text-blue-500 cursor-pointer"
                      size={16}
                      onClick={() => setEditName(true)}
                    />
                  </div>
                )}
                <p className="text-sm text-gray-400">@{currentUser.username}</p>
              </div>
              <Button className="bg-[#238636] hover:bg-[#2ea043] w-full">View Profile</Button>
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div className="col-span-2 space-y-6">
          <Card title="Account" className="p-6 rounded-lg bg-[#161b22] border border-[#30363d]">
            <div className="flex justify-between items-center">
              <p>Your email</p>
              <p className="text-gray-400">{currentUser?.email}</p> {/* Display email as plain text */}
            </div>
          </Card>

          <Card title="Security" className="p-6 rounded-lg bg-[#161b22] border border-[#30363d]">
            <div className="flex justify-between items-center">
              <p>Enable ARP Spoof Detector</p>
              <div className="relative">
                <Toggle
                  isOn={arpSpoofDetector}
                  handleToggle={handleArpSpoofDetectorToggle}
                  disabled={currentUser?.role !== 'admin'} // Disable toggle if not admin
                />
                {currentUser?.role !== 'admin' && (
                  <div className="absolute -top-8 left-0 bg-[#30363d] text-white text-sm px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                    Only admin can enable this setting
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card title="Notifications" className="p-6 rounded-lg bg-gray-800 border border-[#30363d]">
            <div className="flex justify-between items-center">
              <p>Enable Notifications</p>
              <Toggle isOn={notificationsEnabled} handleToggle={() => setNotificationsEnabled(!notificationsEnabled)} />
            </div>
          </Card>

          <Card title="Update Password" className="p-6 rounded-lg bg-[#161b22] border border-[#30363d]">
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <Input type="password" label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              <Input type="password" label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              <Input type="password" label="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <Button type="submit" className="w-full bg-[#238636] hover:bg-[#2ea043]">Update Password</Button>
            </form>
          </Card>

          <Card className="p-6 rounded-lg bg-[#161b22] border border-[#30363d]">
            <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center space-x-2">
              <LogOut size={24} />
              <span>Logout</span>
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;