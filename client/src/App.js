import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles.css'; 
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Report from './Report';
import Status from './Status';
import AdminPage from './Admin';

function App() {
  return (  
    
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/Status" element={<Status />} />
          <Route path="/admin" element={<AdminPage />} /> {/* Route for Admin Page */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


