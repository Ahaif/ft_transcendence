import React, { useState , useEffect} from 'react';
import axios from 'axios';
import './Enable2FA.css';


function Enable2FA() {
  const [qrCodeUrl, setQRCodeUrl] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [avatar, setAvatar] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const jwtToken = localStorage.getItem('jwt_token');
      
      console.log(jwtToken);
      if (!jwtToken) {
        // Handle the case where the JWT token is not present
        console.error('JWT token not found');
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
  
      if (showPasswordInput) {
        const password = event.target['authenticator-password'].value;
  
        const response = await axios.post(
          'http://10.11.1.1:3000/auth/check-2fa',
          { password },
          config
        );
  
        if (response.data.success) {
          // Handle successful validation
          window.location.href = `/dashboard?avatar=${avatar}`;
        } 
        else
        {
          window.location.href = '/login';
        }
      } else {
        const response = await axios.get(
          'http://10.11.1.1:3000/auth/enable-2fa',
          config
        );
  
        setQRCodeUrl(response.data.qrCodeUrl);
        setShowPasswordInput(true);
      }
    } catch (error) {
      console.log('Error validating password: ', error.response.data.message);
      alert('Incorrect password entered. this incident will be reported.');
      window.location.href = '/login'
    }
  };

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const accessToken = searchParams.get('access_token');
        const avatarParam = searchParams.get('avatar');

        if (accessToken) {
          localStorage.setItem('jwt_token', accessToken);
          // Remove the access token from the URL to prevent accidental sharing
          // window.history.replaceState({}, '', '/');
              
        }
        if (avatarParam) {
          setAvatar(avatarParam);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAccessToken();
  }, []);

  return (
    <div className="enable-2fa-container">
      <h1>Enable Two-Factor Authentication</h1>
      <p>Two-factor authentication adds an extra layer of security to your account.</p>
      {qrCodeUrl && (
        <>
          <div className="qr-code-container">
            <img src={qrCodeUrl} alt="QR code" />
          </div>
          {showPasswordInput ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="authenticator-password">Google Authenticator Password</label>
                <input type="password" id="authenticator-password" name="authenticator-password" required />
              </div>
              <button type="submit">Submit</button>
            </form>
          ) : null}
        </>
      )}
      {!qrCodeUrl && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="enable-2fa">Enable 2FA</label>
            <input type="checkbox" id="enable-2fa" name="enable-2fa" />
          </div>
          <button type="submit">Enable 2FA</button>
        </form>
      )}
      <div className="skip-2fa-container">
        <p>Or, if you want to skip this step for now, you can continue to your dashboard:</p>
        <a href={`/dashboard?avatar=${avatar}`}>Go to Dashboard</a>
      </div>
    </div>
  );
}



export default Enable2FA;