import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import './Dashboard.css';


const Dashboard = () => {
  // const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [avatarLink, setAvatarLink] = useState("");
  



  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('access_token');

    if (token) {
      localStorage.setItem('jwt_token', token);
      window.history.replaceState({}, '', '/');
      setShowPasswordForm(true); // show password form if 2FA is enabled
    }
    const jwtToken = localStorage.getItem('jwt_token');
  
    if (!jwtToken) {
      console.error('JWT token not found');
      return;
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    axios.get('http://localhost:3000/user/data', config)
      .then(response => {
        const { avatar, twoFactorSecret } = response.data;
        if(!twoFactorSecret)
        {
          window.location.href = `/game?access_token=${jwtToken}&avatar=${avatarLink}`;
        }

        setAvatarLink(avatar);
        setShowPasswordForm(twoFactorSecret); 
      })
      .catch(error => {
        console.error(error);
      });
   
  }, []);



  const handlePasswordSubmit = async (event) => {
    event.preventDefault(); 
    const password = event.target.password.value; 
    // TODO: validate the password and send it to the server for verification
    const jwtToken = localStorage.getItem('jwt_token');
  
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
        setShowPasswordForm(false);
        window.location.href = `/game?access_token=${jwtToken}&avatar=${avatarLink}`;
      }
    } catch (error) {

      alert('Incorrect password entered. this incident will be reported.');
      window.location.href = '/login'
    }
  };

  return (
    <div className="dashboard">
      {showPasswordForm ? (
        <form onSubmit={handlePasswordSubmit}>
          <label>
            Google auth Password:
            <input type="password" name="password" />
          </label>
          <button type="submit">Submit</button>
        </form>
      ) : null}
    </div>
  );
  
}
    

export default Dashboard;