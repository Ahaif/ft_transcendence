import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('access_token_intra');
    navigate('/login');
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('access_token');
    if (token) {
      localStorage.setItem('access_token', token);
      setShowPasswordForm(true); // show password form if 2FA is enabled
    }
  }, []);

  const handlePasswordSubmit = async (event) => {
    event.preventDefault(); // prevent default form submission behavior
    const password = event.target.password.value; // get the password from the form input
    // TODO: validate the password and send it to the server for verification
    const jwtToken = localStorage.getItem('access_token');
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
        console.log('2FA enabled successfully');
      } else {
        // Handle failed validation
        console.log('2FA validation failed');
      }
    } catch (error) {
      console.error('Error validating password:', error);
    }
  
    setShowPasswordForm(false); // hide password form after submission
  };



  return (
    <div className="dashboard">
      <h1>Login Successful!</h1>
      {showPasswordForm ? (
        <form onSubmit={handlePasswordSubmit}>
          <label>
            Password:
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