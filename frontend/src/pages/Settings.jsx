import React, { useState } from 'react';
import Header from '../components/common/Header';
import Toggle from '../components/common/Toggle';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { User, Shield, Bell, Lock, LogOut } from 'lucide-react';

const Settings = () => {
  const [arpSpoofDetector, setArpSpoofDetector] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const handleArpSpoofDetectorToggle = () => {
    setArpSpoofDetector(!arpSpoofDetector);
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    console.log('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-[#0d1117] text-[#c9d1d9] min-h-screen scrollbar-hide">
      <Header title="Settings" />
      <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
        <Card title="User Information" className="mb-6 bg-[#161b22] border border-[#30363d]">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <User className="text-[#8b949e]" size={24} />
              <div>
                <label className="block text-sm text-[#8b949e]">Name</label>
                <p className="text-lg text-white">{currentUser.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <User className="text-[#8b949e]" size={24} />
              <div>
                <label className="block text-sm text-[#8b949e]">Email</label>
                <p className="text-lg text-white">{currentUser.email}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Security Settings" className="mb-6 bg-[#161b22] border border-[#30363d]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="text-[#8b949e]" size={24} />
              <p>ARP Spoof Detector</p>
            </div>
            <Toggle isOn={arpSpoofDetector} handleToggle={handleArpSpoofDetectorToggle} />
          </div>
        </Card>

        <Card title="Notifications" className="mb-6 bg-[#161b22] border border-[#30363d]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bell className="text-[#8b949e]" size={24} />
              <p>Enable Notifications</p>
            </div>
            <Toggle isOn={notificationsEnabled} handleToggle={handleNotificationsToggle} />
          </div>
        </Card>

        <Card title="Update Password" className="mb-6 bg-[#161b22] border border-[#30363d]">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <Input type="password" label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="bg-[#0d1117] border border-[#30363d] text-white" />
            <Input type="password" label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="bg-[#0d1117] border border-[#30363d] text-white" />
            <Input type="password" label="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="bg-[#0d1117] border border-[#30363d] text-white" />
            <Button type="submit" className="w-full bg-[#238636] hover:bg-[#2ea043] text-white">
              Update Password
            </Button>
          </form>
        </Card>

        <Card className="bg-[#161b22] border border-[#30363d]">
          <Button onClick={handleLogout} className="w-full bg-[#238636] hover:bg-[#2ea043] flex items-center justify-center space-x-2 text-white">
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default Settings;