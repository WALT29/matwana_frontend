import React, { useState } from 'react';
import Toastify from 'toastify-js'; 
import 'toastify-js/src/toastify.css'; 
import '../Admin/adduser.css';

const AddCustomer = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const userData = {
      name,
      phone_number: phoneNumber,
      email,
      password,
      role, 
    };

    fetch('https://matwana-backend-copy.onrender.com/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Signup successful:', data);
      Toastify({
        text: "Account has been created successfully!",
        duration: 3000,
        gravity: "top", 
        position: 'right', 
        backgroundColor: "#4CAF50", 
        stopOnFocus: true,
      }).showToast();
      
    })
    .catch((error) => {
      console.error('Error during signup:', error);
    });
  };

  return (
    <div className="add-form">
      <form onSubmit={handleSubmit}>
        <h2>ADD USERS</h2>
        
        <label>Name:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />

        <label>Phone Number:</label>
        <input 
          type="text" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
          required 
        />

        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />

        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <label>Confirm Password:</label>
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />

        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="customer">Customer</option>
        </select>

        <button type="submit">ADD CUSTOMER</button>
      </form>
    </div>
  );
};

export default AddCustomer;
