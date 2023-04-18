import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react'

import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Enable2FA from './Enable2FA/Enable2FA';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/enable-2fa" element={<Enable2FA />} />
        {/* Add more routes for your other pages */}
      </Routes>
    </Router>
  );
}

export default App;