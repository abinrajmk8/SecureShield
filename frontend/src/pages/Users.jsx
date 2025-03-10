import React from 'react';
import { UserPlus, Search } from 'lucide-react';
import './Users.css';


const Users = () => {
  return (
    <div className="user-management-container">
      <h1 className="header">User Management</h1>

      <div className="action-bar">
        <button className="add-user-btn">
          <UserPlus size={26} style={{ marginRight: '1px' }} />
        </button>
        <div className="search-container">
          <Search size={20} style={{ marginRight: '45px' }} className="search-icon" />
          <input type="text" placeholder="Search Users" className="search-input" />
        </div>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>johndoe@example.com</td>
            <td>Admin</td>
            <td className="status-active">Active</td>
            <td>
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jane Smith</td>
            <td>janesmith@example.com</td>
            <td>User</td>
            <td className="status-inactive">Inactive</td>
            <td>
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Users;
