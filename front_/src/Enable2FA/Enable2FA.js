import React, { useState , useEffect} from 'react';
import axios from 'axios';
import './Enable2FA.css';


function Enable2FA() {


  const [qrCodeUrl, setQRCodeUrl] = useState('');

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
  
      const response = await axios.get(
        'http://localhost:3000/auth/enable-2fa',
        config
      );
  
      setQRCodeUrl(response.data.qrCodeUrl);
    } catch (error) {
      console.error('Error enabling 2FA:', error);
    }
  };
  useEffect(() => {
    // alert("rendred");
    const getAccessToken = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const accessToken = searchParams.get('access_token');
      
        if (accessToken) {
          localStorage.setItem('jwt_token', accessToken);
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
    <div className="enable-2fa-container">
      <h1>Enable Two-Factor Authentication</h1>
      <p>Two-factor authentication adds an extra layer of security to your account.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="enable-2fa">Enable 2FA</label>
          <input type="checkbox" id="enable-2fa" name="enable-2fa" />
        </div>
      </form>
      <div className="qr-code-container">
        {qrCodeUrl && <img src={qrCodeUrl} alt="QR code" />}
      </div>
      <div className="form-group">
          <label htmlFor="authenticator-password">Google Authenticator Password</label>
          <input type="password" id="authenticator-password" name="authenticator-password" required />
        </div>
        <button type="submit">Submit</button>
        <div className="skip-2fa-container">
        <p>Or, if you want to skip this step for now, you can continue to your dashboard:</p>
        <a href="/dashboard">Go to Dashboard</a>
      </div>
    </div>
  );
}


export default Enable2FA;
