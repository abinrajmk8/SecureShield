import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Toggle from '../components/common/Toggle';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Shield, Bell, Lock, LogOut, Edit } from 'lucide-react';

const Settings = ({ handleLogout }) => {
  const [arpSpoofDetector, setArpSpoofDetector] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/currentUser', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const userData = await response.json();
        setCurrentUser(userData);
        setName(userData.name);
        setNotificationsEnabled(userData.notificationsEnabled);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchArpSpoofDetector = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/settings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch ARP Spoof Detector setting');
        const data = await response.json();
        setArpSpoofDetector(data.arpspoofedetector);
      } catch (error) {
        console.error('Error fetching ARP Spoof Detector setting:', error);
      }
    };

    fetchCurrentUser();
    fetchArpSpoofDetector();
  }, []);

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
      setEditName(false);
    } catch (error) {
      console.error('Name update error:', error);
      alert('Error updating name.');
    }
  };

  const handleUpdateArpSpoofDetector = async (newValue) => {
    try {
      const response = await fetch('http://localhost:3000/api/settings/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ arpspoofedetector: newValue }),
      });
      if (!response.ok) throw new Error('Failed to update ARP Spoof Detector');
      setArpSpoofDetector(newValue);
      console.log('ARP Spoof Detector updated successfully!');
    } catch (error) {
      console.error('ARP Spoof Detector update error:', error);
      alert('Error updating ARP Spoof Detector.');
    }
  };

  const handleNotificationsToggle = async (newValue) => {
    setNotificationsEnabled(newValue);
    await updateUser({ notificationsEnabled: newValue });
  };

  const updateUser = async (updates) => {
    try {
      const response = await fetch('http://localhost:3000/api/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update user');
      const data = await response.json();
      console.log('User updated:', data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-850 text-[#c9d1d9] min-h-screen">
      <Header title="Settings" />
      <main className="max-w-4xl mx-auto py-8 px-6 lg:px-12 space-y-6">
        {/* Account Section */}
        <Card title="Account" className="p-6 rounded-lg bg-[#161b22] border border-[#30363d]">
          {currentUser && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-lg">Name</p>
                {editName ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-48"
                    />
                    <Button onClick={handleUpdateName} className="bg-[#238636] hover:bg-[#2ea043]">
                      Save
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-bold text-blue-400">{name}</p>
                    <Edit
                      className="text-blue-500 cursor-pointer"
                      size={16}
                      onClick={() => setEditName(true)}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p>Your email</p>
                <p className="text-gray-400">{currentUser?.username}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Security Section */}
        <Card title="Security" className="p-6 rounded-lg bg-[#161b22] border border-[#30363d]">
          <div className="flex justify-between items-center">
            <p>Enable ARP Spoof Detector</p>
            <div className="relative">
              <Toggle
                isOn={arpSpoofDetector}
                handleToggle={() => handleUpdateArpSpoofDetector(!arpSpoofDetector)}
                disabled={currentUser?.role !== 'admin'}
              />
              {currentUser?.role !== 'admin' && (
                <div className="absolute -top-8 left-0 bg-[#30363d] text-white text-sm px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                  Only admin can enable this setting
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card title="Notifications" className="p-6 rounded-lg bg-[#161b22] border border-[#30363d]">
          <div className="flex justify-between items-center">
            <p>Enable Notifications</p>
            <Toggle
              isOn={notificationsEnabled}
              handleToggle={() => handleNotificationsToggle(!notificationsEnabled)}
            />
          </div>
        </Card>

        {/* Update Password Section */}
        <Card title="Update Password" className="p-6 rounded-lg bg-[#161b22] border border-[#30363d]">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full bg-[#238636] hover:bg-[#2ea043]">
              Update Password
            </Button>
          </form>
        </Card>

        {/* Logout Section */}
        <Card className="p-6 rounded-lg bg-[#161b22] border border-[#30363d]">
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center space-x-2"
          >
            <LogOut size={24} />
            <span>Logout</span>
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default Settings;