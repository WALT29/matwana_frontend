import React, { useState } from 'react';
import './Login.css'; 
import Toastify from 'toastify-js'; 
import 'toastify-js/src/toastify.css'; 
import { useNavigate } from 'react-router-dom';

const Login = ({ setUserRole }) => {
  const navigate = useNavigate();
  const [phone_number, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      phone_number,
      password,
    };

    fetch('http://127.0.0.1:5555/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Invalid phone number or password'); 
        }
        return response.json();
      })
      .then((data) => {
        console.log('Login successful:', data);

      
        localStorage.setItem('access_token', data.tokens.access_token);
        localStorage.setItem('refresh_token', data.tokens.refresh_token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('id', data.id);
        setUserRole(data.role);

        Toastify({
          text: "Login successful!",
          duration: 1000,
          gravity: "top",
          position: 'right',
          backgroundColor: "#4CAF50",
          stopOnFocus: true,
        }).showToast();

        // Navigate based on user role
        if (data.role === "customer") {
          navigate('/customer');
        } else if (data.role === "admin") {
          navigate('/admin');
        } else if (data.role === "customer_service") {
          navigate('/customer-service');
        } else {
          navigate('/');
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        setErrorMessage('Invalid phone number or password'); 
        Toastify({
          text: "Login failed! Please check your credentials.",
          duration: 3000,
          gravity: "top",
          position: 'right',
          backgroundColor: "#f44336",
          stopOnFocus: true,
        }).showToast();
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        
        
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="form-group">
          <label className="labels">Phone Number:</label>
          <input 
            type="text" 
            value={phone_number} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label className="labels">Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
