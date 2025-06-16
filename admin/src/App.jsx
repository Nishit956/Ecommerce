import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx';
import Admin from './Pages/Admin/Admin.jsx';
import Login from './Pages/Login/Login.jsx';

const App = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const location = useLocation();

  return (
    <div>
      {/* Show Navbar only if not on login page */}
      {location.pathname !== "/login" && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={ localStorage.getItem("adminToken") ? <Admin /> : <Navigate to="/login" />}/>
      </Routes>
    </div>
  );
};

export default App;
