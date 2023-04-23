import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import GameInterface from '../GameInterface/GameInterface';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
   const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [avatarLink, setAvatarLink] = useState("");
   const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  



  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('access_token');

    if (token) {
      localStorage.setItem('jwt_token', token);
      window.history.replaceState({}, '', '/');
      // setShowPasswordForm(true); // show password form if 2FA is enabled
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
    axios.get('http://10.11.1.1:3000/user/data', config)
      .then(response => {
        const { avatar, twoFactorSecret } = response.data;
        if(!twoFactorSecret)
        {
          window.location.href = `/game?avatar=${avatar}`;
        }


        setTwoFactorEnabled(twoFactorSecret);
        setAvatarLink(avatar);
        setShowPasswordForm(twoFactorSecret); 
      })
      .catch(error => {
        console.error(error);
      });
   
  }, []);

  const handleAvatarUpload = async (event) => {
    event.preventDefault();
    const fileInput = event.target.elements.file;
  if (!fileInput) {
    console.error('File input not found');
    return;
  }
  const file = fileInput.files[0];
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

    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post(
        'http://10.11.1.1:3000/users/avatar',
        formData,
        config
      );
  
      setAvatarLink(response.data);
      
    } catch (error) {
      console.error(error);
    }
  };


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
        'http://10.11.1.1:3000/auth/check-2fa',
        { password },
        config
      );
  
      if (response.data.success) {
        // Handle successful validation
        setShowPasswordForm(false);
        setPasswordCorrect(true);
        window.location.href = `/game?avatar=${avatarLink}`;
      }
    } catch (error) {

      alert('Incorrect password entered. this incident will be reported.');
      window.location.href = '/login'
    }
  
    // setShowPasswordForm(false); // hide password form after submission
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