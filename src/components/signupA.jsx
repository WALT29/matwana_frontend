import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toastify from 'toastify-js'; 
import 'toastify-js/src/toastify.css'; 
import './signup.css';
const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors,setErrors]=useState({})
  const [backEndErrors,setBackEndErrors]=useState('')

  const validateForm=()=>{
    const newErrors={}

    if (name.length<3){
      newErrors.name='Name must be at least 3 characters long'
    }

    if (isNaN(phoneNumber) || phoneNumber.length !== 10) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    }

    if (!email.includes('@')){
      newErrors.email='Enter the email in a valid format'
    }

    if(password.length<8){
      newErrors.password='Password should have at least 8 characters'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length===0;

  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const userData = {
      name,
      phone_number: phoneNumber,
      email,
      password,
      role: 'admin', 
    };

    fetch('http://127.0.0.1:5555/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    .then((response) =>{
      if(!response.ok){
        throw new Error('Invalid details checks your inputs,there is a user with that phone number /name');
      }
      return response.json()
    })
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
      
      navigate('/login');
    })
    .catch((error) => {
      console.log(error)
      setBackEndErrors(error.message)
      Toastify({
        text: "Check your inputs and try again.",
        duration: 2000,
        gravity: "top",
        position: 'right',
        backgroundColor: "#f44336",
        stopOnFocus: true,
      }).showToast();
    });
  };

  return (
    <div className="signup-form">
      <form onSubmit={handleSubmit}>
        <h2>Signup</h2>
        {backEndErrors && <p className="error backend-error">{backEndErrors}</p>}
        <label className="labels">Name:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <label className="labels">Phone Number:</label>
        <input 
          type="text" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
          required 
        />
        {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}

        <label className="labels">Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label className="labels">Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label className="labels">Confirm Password:</label>
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
