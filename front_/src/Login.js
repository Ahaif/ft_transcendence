import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'

import Dashboard from './Dashboard';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
        console.log('passed')
      const response = await axios.post('localhost:3000/auth/signup', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.access_token);
      navigate('dashboard');
    } catch (error) {
      console.log(error);
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
        <button type="submit" onClick={handleSignup}>Login</button>
      </form>
    </div>
  );
};

export default Login;