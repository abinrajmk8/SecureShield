// frontend/src/components/Tables/UserView.jsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const UserView = ({ selectedUser, closeModal }) => {
  const [userDetails, setUserDetails] = useState(null); // State to store fetched user details
  const [loading, setLoading] = useState(false); // State to handle loading

  // Fetch user details based on the selected username
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (selectedUser?.username) {
        setLoading(true);
        try {
          const response = await fetch('http://localhost:3000/api/users');
          if (!response.ok) {
            throw new Error('Failed to fetch user details');
          }
          const data = await response.json();
          // Find the user with the matching username
          const user = data.find((u) => u.username === selectedUser.username);
          if (user) {
            setUserDetails(user); // Set the fetched user details
          } else {
            throw new Error('User not found');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [selectedUser]);

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-96'>
        {/* Modal Header with Close Button */}
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold text-gray-100'>View User</h2>
          <button onClick={closeModal} className='text-gray-300 hover:text-white'>
            <X size={20} /> {/* Close icon */}
          </button>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className='text-center text-gray-300'>Loading user details...</div>
        ) : userDetails ? (
          <>
            <div className='mb-4'>
              <label className='block text-gray-100 mb-2'>Name</label>
              <input
                type='text'
                value={userDetails.name}
                readOnly
                className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-100 mb-2'>Email</label>
              <input
                type='email'
                value={userDetails.username}
                readOnly
                className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-100 mb-2'>Role</label>
              <input
                type='text'
                value={userDetails.role}
                readOnly
                className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-100 mb-2'>Company ID</label>
              <input
                type='text'
                value={userDetails.companyId}
                readOnly
                className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-100 mb-2'>Last Login</label>
              <input
                type='text'
                value={userDetails.lastLogin ? new Date(userDetails.lastLogin).toLocaleString() : 'N/A'}
                readOnly
                className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-100 mb-2'>Last Logout</label>
              <input
                type='text'
                value={userDetails.lastLogout ? new Date(userDetails.lastLogout).toLocaleString() : 'N/A'}
                readOnly
                className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-100 mb-2'>Status</label>
              <input
                type='text'
                value={userDetails.activeStatus}
                readOnly
                className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
              />
            </div>
          </>
        ) : (
          <div className='text-center text-gray-300'>No user details found.</div>
        )}

        {/* Modal Footer */}
        <div className='flex justify-end'>
          <button
            onClick={closeModal}
            className='bg-gray-500 hover:bg-gray-700 text-white py-1 px-4 rounded'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserView;