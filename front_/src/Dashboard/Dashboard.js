import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

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
    }
  }, []);

  return (
    <div className="dashboard">
      <h1>Login Successful!</h1>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default Dashboard;