import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {

  const [errorMessage, setErrorMessage] = useState('');
  // const navigate = useNavigate();


  const handle42Login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://10.11.1.1:3000/auth/generate-42-auth-url');


      window.location.href = response.data.url;
      
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
    }
  };




  return (
    <div className="Login-container">
      <h1>Login Page</h1>
      <form>
        <button type="submit" onClick={handle42Login}>
          Login with 42
        </button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
