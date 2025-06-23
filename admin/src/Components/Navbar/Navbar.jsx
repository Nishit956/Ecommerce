import React from 'react';
import './Navbar.css';
import navlogo from '../../assets/nav-logo.png';
import navProfile from '../../assets/nav-profile.svg';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

   return (
    <div className='navbar'>
      <div className="nav-left">
      <img src={navlogo} alt="Logo" className="nav-logo" />
      <div className='nav-admin'>Admin Panel</div>
      </div>
      <div className="nav-actions">
        <img src={navProfile} className='nav-profile' alt="Profile" />
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;

