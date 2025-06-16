import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const backendPort = import.meta.env.VITE_BACKEND_PORT;

  const handleLogin = async () => {
    const response = await fetch(`${backendPort}/api/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem("adminToken", data.token);
      navigate('/');
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
