import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // added state variable
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/Signup', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message); // set error message from the response
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit" onClick={handleLogin}>
          Login
        </button>
        {errorMessage && <p className="error">{errorMessage}</p>} {/* render error message if it exists */}
      </form>
    </div>
  );
};

export default Login;
