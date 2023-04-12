import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token_intra');

    navigate('/login');
  };

  useEffect(() => {
    // alert("rendred");
    const getAccessToken = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const accessToken = searchParams.get('access_token');
        if (accessToken) {
          localStorage.setItem('access_token_intra', accessToken);
          // Remove the access token from the URL to prevent accidental sharing
          // window.history.replaceState({}, '', '/');
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAccessToken();
  }, []);


  return (
    <div className="dashboard">
      <h1>Login Successful!</h1>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default Dashboard;