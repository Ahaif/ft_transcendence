import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import './GameInterface.css';

function GameInterface() {
  const navigate = useNavigate();
  const [avatarLink, setAvatarLink] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isDisplayNameEntered, setIsDisplayNameEntered] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('access_token');
    
    if (token) {
      localStorage.setItem('jwt_token', token);
      window.history.replaceState({}, '', '/');
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
      const {avatar, displayName } = response.data;
      if(displayName)
      {
        setDisplayName(displayName)
        setIsDisplayNameEntered(true);
        
      }
      else
      {
        setIsDisplayNameEntered(false);
      }

      if (avatar) {
        setAvatarLink(avatar);
      }
    })


  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('jwt_token');
    navigate('/login');
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        'http://10.11.1.1:3000/user/displayName',
        { displayName },
        config
      );
     
      if (response.data.displayName) {
        setIsDisplayNameEntered(true);
      }
    } catch (error) {
      // if (error.response && error.response.data.message === 'Display name already exists') {
      //   alert('Display name already exists');
      // } else {
      //   alert('Error setting display name');
      // }
      alert('Name already Exist')
      
    }
  
  };

  // const jwtToken = localStorage.getItem('jwt_token');
  // if (!jwtToken) {
  //   navigate('/login');
  //   return null;
  // }

  if (!isDisplayNameEntered) {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="display-name-input">Enter your display name:</label>
          <input
            type="text"
            name="display-name"
            id="display-name-input"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="gameInterface">
        <>
          <h1>Login Successful ! {displayName}</h1>
          <div className="avatar-container">
            <div className="avatar">
              <img src={avatarLink} alt="avatar" />
              <label className="avatar-label" htmlFor="avatar-input">
                Change
              </label>
            </div>
  
            <input
              className="upload-btn"
              type="file"
              name="file"
              id="avatar-input"
              onChange={handleAvatarUpload}
            />
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </>
      </div>
    );
  }

  }

 

export default GameInterface;
