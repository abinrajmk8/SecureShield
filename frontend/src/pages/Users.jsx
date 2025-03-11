import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import StatusCard from '../components/common/StatusCard';
import { UserPlus, Users as UsersIcon, UserCheck, UserX, UserCog } from 'lucide-react';
import UserTable from '../components/Tables/UserTable';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchUsers();
  }, []);

  // Calculate counts for status cards
  const totalUsers = users.length;
  const onlineUsers = users.filter((user) => user.activeStatus === 'online').length;
  const admins = users.filter((user) => user.role === 'admin').length;
  const regularUsers = users.filter((user) => user.role === 'user').length;

  // Status card data
  const statusData = [
    { title: 'Total Users', value: totalUsers.toString(), color: 'blue', icon: UsersIcon },
    { title: 'Online Users', value: onlineUsers.toString(), color: 'green', icon: UserCheck },
    { title: 'Admins', value: admins.toString(), color: 'purple', icon: UserCog },
    { title: 'Users', value: regularUsers.toString(), color: 'red', icon: UserX },
  ];

  // Check if the current user is an admin (for demonstration, hardcoded to true)
  const isAdmin = true; // Replace with actual logic to check user role

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title="User Management" />
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* Status Cards */}
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
          {statusData.map((status, index) => (
            <StatusCard
              key={index}
              title={status.title}
              value={status.value}
              color={status.color}
              icon={status.icon}
            />
          ))}
        </div>

        {/* Action Bar */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-gray-100'>User List</h2>
          {isAdmin && (
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center'>
              <UserPlus className='mr-2' />
              Add User
            </button>
          )}
        </div>

        {/* User Table */}
        {loading ? <p className='text-gray-300'>Loading users...</p> : <UserTable isAdmin={isAdmin} users={users} />}
      </main>
    </div>
  );
};

export default Users;