import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <h1>Login Successful!</h1>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default Dashboard;