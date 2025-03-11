import React from 'react';
import { Edit, Eye } from 'lucide-react';

const UserTable = ({ users, isAdmin }) => {
  return (
    <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-gray-700 text-gray-100'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>Email</th>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>Role</th>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>Status</th>
              <th className='py-2 px-4 border-b border-gray-800 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className='py-2 px-4 border-b border-gray-600 border-r text-center'>{user.username}</td>
                <td className='py-2 px-4 border-b border-gray-600 border-r text-center'>{user.role}</td>
                <td className='py-2 px-4 border-b border-gray-600 border-r text-center'>
                  <div className='flex items-center justify-center'>
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        user.activeStatus === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                    <span>{user.activeStatus}</span>
                  </div>
                </td>
                <td className='py-2 px-4 border-b border-gray-600 text-center'>
                  {isAdmin ? (
                    <>
                      <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2'
                        title='Edit'
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className='bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded'
                        title='View'
                      >
                        <Eye size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className='bg-gray-500 text-white font-bold py-1 px-2 rounded mr-2 cursor-not-allowed'
                        title='Only admin can edit'
                        disabled
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className='bg-gray-500 text-white font-bold py-1 px-2 rounded cursor-not-allowed'
                        title='Only admin can view'
                        disabled
                      >
                        <Eye size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
