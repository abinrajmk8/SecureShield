import React ,{useEffect,useState} from 'react';
import { Edit, Eye ,X} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserTable = ({ users, isAdmin ,updateUser,deleteUser}) => {
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [updatedRole, setUpdatedRole] = useState('');
const [loading, setLoading] = useState(false); // Add this line

// Open modal and set user data
const handleEditClick = (user) => {
  setSelectedUser(user);
  setUpdatedRole(user.role);
  setIsModalOpen(true);
};

// Close modal
const closeModal = () => {
  setIsModalOpen(false);
  setSelectedUser(null);
};
const handleSave = async () => {
  if (selectedUser && updatedRole) {
    setLoading(true); // Disable buttons
    try {
      await updateUser(selectedUser.username, updatedRole);
      toast.success('User role updated successfully!');
      closeModal();
    } catch (error) {
      toast.error('Error updating user role. Please try again.');
    } finally {
      setLoading(false); // Re-enable buttons
    }
  }
};

// Handle Delete button click
const handleDelete = async () => {
  if (selectedUser) {
    setLoading(true); // Disable buttons
    try {
      await deleteUser(selectedUser.username);
      toast.success('User deleted successfully!');
      closeModal();
    } catch (error) {
      toast.error('Error deleting user. Please try again.');
    } finally {
      setLoading(false); // Re-enable buttons
    }
  }
};

  return (
    <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'>
      <ToastContainer autoClose={2500} />
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-gray-700 text-gray-100'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>Name</th>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>Email</th>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>Role</th>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>Status</th>
              <th className='py-2 px-4 border-b border-gray-800 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className='py-2 px-4 border-b border-gray-600 border-r text-center'>{user.name}</td>
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
                        onClick={() => handleEditClick(user)}
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
 {/* Edit User Modal */}
 {isModalOpen && selectedUser && (
  <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
    <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-96'>
      {/* Modal Header with Close Button */}
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold text-gray-100'>Edit User</h2>
        <button
          onClick={closeModal}
          className='text-gray-300 hover:text-white'
        >
          <X size={20} /> {/* Close icon */}
        </button>
      </div>

      {/* Modal Body */}
      <div className='mb-4'>
        <label className='block text-gray-100 mb-2'>Name</label>
        <input
          type='text'
          value={selectedUser.name}
          readOnly
          className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-100 mb-2'>Email</label>
        <input
          type='email'
          value={selectedUser.username}
          readOnly
          className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-100 mb-2'>Role</label>
        <select
          value={updatedRole}
          onChange={(e) => setUpdatedRole(e.target.value)}
          className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
        >
          <option value='admin'>Admin</option>
          <option value='user'>User</option>
        </select>
      </div>

      {/* Modal Footer */}
      <div className='flex justify-end'>
        <button
          onClick={handleDelete}
          disabled={loading} 
          className={`bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded mr-2
             ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }
          `}
        >
          Delete
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default UserTable;
