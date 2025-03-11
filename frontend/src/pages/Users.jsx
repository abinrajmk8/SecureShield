import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import StatusCard from '../components/common/StatusCard';
import { UserPlus, Users as UsersIcon, UserCheck, UserX, UserCog, RefreshCw } from 'lucide-react';
import UserTable from '../components/Tables/UserTable';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      if (!token) throw new Error('No token found');

      const response = await fetch('http://localhost:3000/api/currentUser', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Attach token
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  console.log('Is Admin:', isAdmin);

  const totalUsers = users.length;
  const onlineUsers = users.filter((user) => user.activeStatus === 'online').length;
  const admins = users.filter((user) => user.role === 'admin').length;
  const regularUsers = users.filter((user) => user.role === 'user').length;

  const statusData = [
    { title: 'Total Users', value: totalUsers.toString(), color: 'blue', icon: UsersIcon },
    { title: 'Online Users', value: onlineUsers.toString(), color: 'green', icon: UserCheck },
    { title: 'Admins', value: admins.toString(), color: 'purple', icon: UserCog },
    { title: 'Users', value: regularUsers.toString(), color: 'red', icon: UserX },
  ];

  const filteredUsers = users
    .filter((user) => (filter === 'all' ? true : filter === 'admin' ? user.role === 'admin' : user.activeStatus === 'online'))
    .sort((a, b) => (a.role === 'admin' ? -1 : 1));

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='User Management' />
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
          {statusData.map((status, index) => (
            <StatusCard key={index} title={status.title} value={status.value} color={status.color} icon={status.icon} />
          ))}
        </div>

        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-gray-100'>User List</h2>
          <div className='flex items-center'>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className='bg-gray-700 text-white px-4 py-2 rounded-lg mr-4'
            >
              <option value='all'>All Users</option>
              <option value='admin'>Admins</option>
              <option value='online'>Online Users</option>
            </select>
            {isAdmin ? (
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center'>
                <UserPlus className='mr-2' />
                Add User
              </button>
            ) : (
              <button className='bg-gray-500 text-white font-bold py-2 px-4 rounded flex items-center cursor-not-allowed'>
                <UserPlus className='mr-2' />
                Add User
              </button>
            )}
            <button onClick={fetchUsers} className='ml-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center'>
              <RefreshCw className='mr-2' /> Refresh
            </button>
          </div>
        </div>

        {loading ? <p className='text-gray-300'>Loading users...</p> : <UserTable isAdmin={isAdmin} users={filteredUsers} />}
      </main>
    </div>
  );
};

export default Users;