import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('jwt_token');
    navigate('/login');
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('access_token');
    if (token) {
      localStorage.setItem('jwt_token', token);
      window.history.replaceState({}, '', '/');
      setShowPasswordForm(true); // show password form if 2FA is enabled
    }
  }, []);

  const handlePasswordSubmit = async (event) => {
    event.preventDefault(); 
    const password = event.target.password.value; 
    // TODO: validate the password and send it to the server for verification
    const jwtToken = localStorage.getItem('jwt_token');
    console.log(jwtToken);
    if (!jwtToken) {
      console.error('JWT token not found');
      return;
    }
  
    const config = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
  
    try {
      const response = await axios.post(
        'http://localhost:3000/auth/check-2fa',
        { password },
        config
      );
  
      if (response.data.success) {
        // Handle successful validation
        window.location.href = '/dashboard';
      }
    } catch (error) {

      alert('Incorrect password entered. this incident will be reported.');
      window.location.href = '/login'
    }
  
    setShowPasswordForm(false); // hide password form after submission
  };



  return (
    <div className="dashboard">
      <h1>Login Successful!</h1>
      {showPasswordForm ? (
        <form onSubmit={handlePasswordSubmit}>
          <label>
             Google auth Password:
            <input type="password" name="password" />
          </label>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <button onClick={handleLogout}>Log out</button>
      )}
    </div>
  );
};

export default Dashboard;