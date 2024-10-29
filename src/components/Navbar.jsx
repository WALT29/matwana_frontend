import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import './styles/navbar.css'

const Navbar = () => {
  const navigate=useNavigate()
  const isLoggedIn=!!localStorage.getItem('access_token')
  
  const handleLogout = () => {
    fetch('http://127.0.0.1:5555/auth/logout', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then(response => {
        if (response.ok) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('role');
          localStorage.removeItem('id');

          Toastify({
            text: "Logged out successfully!",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "#4CAF50",
            stopOnFocus: true,
          }).showToast();
          navigate('/');
          
        } else {
          throw new Error('Logout failed');
        }
      })
      .catch(error => {
        console.error('Error logging out:', error);
        Toastify({
          text: "Error logging out. Please try again.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#f44336",
          stopOnFocus: true,
        }).showToast();
      });
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2>MATWANA LOGISTICS</h2>
        <ul className="nav-links">
          {isLoggedIn ? (
            <>
              <li>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
