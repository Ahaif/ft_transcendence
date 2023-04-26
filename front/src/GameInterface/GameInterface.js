import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import './GameInterface.css';

function GameInterface() {
  const navigate = useNavigate();
  const [avatarLink, setAvatarLink] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isDisplayNameEntered, setIsDisplayNameEntered] = useState(true);
  const [isLoaded, setIsLoaded] = useState(true);
  const [onlineStatus, setOnlineStatus] =  useState('');


useEffect(() => {
  console.log({onlineStatus});
}, [onlineStatus])

 
  useEffect(() => {
    console.log("useEffect");


      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('access_token');
    
      if (token) {
        localStorage.setItem('jwt_token', token);
        // window.history.replaceState({}, '', '/');
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

      fetch_data();
    
      async function fetch_data() {
        try {
          const response =  await axios.get('http://10.11.1.1:3000/user/data', config);
    
          const { avatar, displayName, status } = response.data;
    
          if (displayName) {
            
            setDisplayName(displayName);
            setIsDisplayNameEntered(true);
            setIsLoaded(false);
            
           
          } else {
            setIsDisplayNameEntered(false);
          }
    
          if (avatar) {
            setAvatarLink(avatar);
          }
          if(status === "disconnected")
          {
            change_status();
            console.log("passed")
          }
        } catch (error) {
          console.error(error);
        }
      }
   
    }, []);

  const handleLogout = async () => {
    
    const jwtToken = localStorage.getItem('jwt_token');
    if(!jwtToken)
    {
      console.log("jwt_token is not found")
      return
    }
    const config = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    console.log(jwtToken)
    const data = {
      status: 'disconnected'
    };
    
    await axios.put('http://10.11.1.1:3000/api/id/status/change',data, config);
    navigate('/login');

    localStorage.removeItem('access_token');
    localStorage.removeItem('jwt_token');
  };

  const handleAvatarUpload = async (event) => {
    event.preventDefault();
    // console.log(event.target.elements.file)
    const fileInput = event.target.files[0];
    if (!fileInput) {
      console.error('File input not found');
      return;
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

    const formData = new FormData();
    formData.append('file', fileInput);

    try {
      const response = await axios.post(
        'http://10.11.1.1:3000/user/avatar',
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
        setOnlineStatus("connected")
        setIsLoaded(false);
      }
  
    } catch (error) {
      alert('Name already Exist')
    }
  };


  const change_status = async()=>{

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

        const data = { status: 'connected' };
        // console.log(data)
        await axios.put('http://10.11.1.1:3000/api/id/status/change', data, config);
        setOnlineStatus('connected');

  }

  // if(isDisplayNameEntered)
  // {
  //   change_status()
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
  } else if(!isLoaded) {
    return (
      <div className="gameInterface">
        <>
          <h1>Login Successful ! </h1>
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
          <div className="display-name">
              {displayName}
           </div>
           <div className="online-status">
              {onlineStatus}
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
