import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react'

import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="Login" element={<Login />} /> 
        <Route path="dashboard" element={<Dashboard />} />
        {/* Add more routes for your other pages */}
      </Routes>
    </Router>
  );
}

export default App;