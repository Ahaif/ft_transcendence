import React, { useState } from 'react';
import axios from 'axios';
import './Enable2FA.css';


function Enable2FA() {


  const [qrCodeUrl, setQRCodeUrl] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.get('http://localhost:3000/auth/enable-2fa');
      setQRCodeUrl(response.data.qrCodeUrl);
    } catch (error) {
      console.error('Error getting QR code URL:', error);
    }
  };


  return (
    <div className="enable-2fa-container">
      <h1>Enable Two-Factor Authentication</h1>
      <p>Two-factor authentication adds an extra layer of security to your account.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="enable-2fa">Enable 2FA</label>
          <input type="checkbox" id="enable-2fa" name="enable-2fa" />
        </div>
        <button type="submit">Submit</button>
      </form>
      <div className="qr-code-container">
        {qrCodeUrl && <img src={qrCodeUrl} alt="QR code" />}
      </div>
      <div className="skip-2fa-container">
        <p>Or, if you want to skip this step for now, you can continue to your dashboard:</p>
        <a href="/dashboard">Go to Dashboard</a>
      </div>
    </div>
  );
}


export default Enable2FA;
