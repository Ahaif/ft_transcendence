import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react'
import Login from './Login/Login'
import GameInterface from './GameInterface/GameInterface';

import Dashboard from './Dashboard/Dashboard';
import Enable2FA from './Enable2FA/Enable2FA';

function App() {

  return (
    <Router>
    <Routes>
    <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/Enable2FA" element={<Enable2FA />} />
      <Route path="/game" element={<GameInterface />} />
      {/* Add more routes for your other pages */}
    </Routes>
    </Router> 
  );
}



export default App;