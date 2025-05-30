// frontend/src/pages/Users.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import StatusCard from '../components/common/StatusCard';
import { UserPlus, Users as UsersIcon, UserCheck, UserX, UserCog, RefreshCw } from 'lucide-react';
import UserTable from '../components/Tables/UserTable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ 
    
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    role: 'user' 
  });

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const updateUser = async (username, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5173/api/update-role', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => user.username === username ? { ...user, role: newRole } : user));
     // toast.success('User role updated successfully!', { autoClose: 1500 });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error updating user role. Please try again.', { autoClose: 2000 });
    }
  };

  const deleteUser = async (username) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/delete-user', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user.username !== username));
      toast.success('User deleted successfully!', { autoClose: 1500 });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user. Please try again.', { autoClose: 2000 });
    }
  };

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
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch('http://localhost:3000/api/currentUser', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.confirmPassword) {
      toast.error('Please fill all fields.');
      return;
    }
    if (newUser.password !== newUser.confirmPassword) {
      toast.error('Passwords do not match.', { autoClose: 500 });
      return;
    }
    setAddUserLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUser.name,
          username: newUser.email,  
          password: newUser.password, 
          role: newUser.role || 'user', 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to register user');
      }

      const data = await res.json();
      console.log('User registered successfully:', data);
      toast.success('User added successfully!', { autoClose: 1500 });

      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', confirmPassword: '', role: 'user' }); // Reset fields
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error(error.message || 'Failed to add user. Please try again.', { autoClose: 2000 });
    } finally {
      setAddUserLoading(false); // Re-enable Add button
    }
  };

  return (
    <div className='flex-1 overflow-auto relative z-10'>
    
      <Header title='User Management' />
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {showAddModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-96'>
              <h2 className='text-lg font-bold text-white mb-4'>Add New User</h2>

              <input 
                type='text' placeholder='Name' value={newUser.name} 
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className='w-full mb-2 p-2 bg-gray-700 text-white rounded'
              />
              <input 
                type='email' placeholder='Email' value={newUser.email} 
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                autoComplete='off'
                className='w-full mb-2 p-2 bg-gray-700 text-white rounded'
              />
              <input 
                type='password' placeholder='New Password' value={newUser.password || ''}  
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                autoComplete='new-password'
                className='w-full mb-2 p-2 bg-gray-700 text-white rounded'
              />
              <input 
                type='password' placeholder='Confirm Password' value={newUser.confirmPassword || ''}  
                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                autoComplete='new-password'
                className='w-full mb-4 p-2 bg-gray-700 text-white rounded'
              />
              <select 
                value={newUser.role} 
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className='w-full mb-4 p-2 bg-gray-700 text-white rounded'
              >
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
              </select>
              <div className='flex justify-end'>
                <button onClick={() => setShowAddModal(false)} className='text-gray-300 hover:text-white mr-3'>Cancel</button>
                <button 
                  onClick={handleAddUser}
                  disabled={addUserLoading} // Disable button when loading
                  className={`bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded ${
                    addUserLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {addUserLoading ? 'Adding...' : 'Add'} 
                </button>
              </div>
            </div>
          </div>
        )}

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
              <button
                onClick={() => setShowAddModal(true)}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center'
              >
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

        {loading ? <p className='text-gray-300'>Loading users...</p> : (
          <UserTable 
            isAdmin={isAdmin} 
            users={filteredUsers} 
            updateUser={updateUser} 
            deleteUser={deleteUser} 
            toast={toast} // Pass the `toast` function to `UserTable`
          />
        )}
      </main>
    </div>
  );
};

export default Users;