import React, { useState, useEffect } from 'react';
import './userslist.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    role: '',
    phone_number: ''
  });
  const [searchPhone, setSearchPhone] = useState(''); 

  useEffect(() => {
    fetch('https://matwana-backend-copy.onrender.com/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`, 
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);  
        setUsers(data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setEditUserData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone_number: user.phone_number,
    });
    setIsEditing(false); 
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setIsEditing(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({
      ...editUserData,
      [name]: value,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`https://matwana-backend-copy.onrender.com/users/${selectedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(editUserData),
    })
      .then((response) => response.json())
      .then((data) => {
        setSelectedUser(data); 
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === data.id ? data : user
          )
        );
        setIsEditing(false); 
      })
      .catch((error) => {
        console.error('Error editing user:', error);
      });
  };

  const handleDelete = (userId) => {
    fetch(`https://matwana-backend-copy.onrender.com/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then(() => {
        setUsers(users.filter((user) => user.id !== userId));
        setSelectedUser(null); 
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  
  const filteredUsers = searchPhone.trim()
  ? users.filter((user) => user.phone_number && user.phone_number.includes(searchPhone.trim()))
  : users;


  if (selectedUser) {
    return (
      <div className="user-details-container">
        <h2 className="section-title">User Details</h2>

        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={editUserData.name}
              onChange={handleEditChange}
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editUserData.email}
              onChange={handleEditChange}
            />
             <label>Role:</label>
            <select
              name="role"
              value={editUserData.role}
              onChange={handleEditChange}
            >
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="customer_service">Customer Service</option>
            </select>

            <label>Phone Number:</label>
            <input
              type="text"
              name="phone_number"
              value={editUserData.phone_number}
              onChange={handleEditChange}
            />
            <div className="buttons-container">
              <button type="submit" className="edit-button">Save Changes</button>
              <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Phone Number:</strong> {selectedUser.phone_number}</p>
            <div className="buttons-container">
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                Edit User
              </button>
              <button className="delete-button" onClick={() => handleDelete(selectedUser.id)}>
                Delete User
              </button>
            </div>
          </div>
        )}
        <button className="back-button" onClick={handleBackToList}>
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="users-list-container">
      <h2 className="section-title">All Users</h2>

      
      <div className="search-container">
        <label>Search by Phone Number:</label>
        <input
          type="text"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          placeholder="Enter phone number"
        />
      </div>

      {filteredUsers.length > 0 ? (
        <ul className="users-list">
          {filteredUsers.map((user) => (
            <li key={user.id} className="user-item" onClick={() => handleUserClick(user)}>
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found with that phone number.</p>
      )}
    </div>
  );
};

export default UsersList;
