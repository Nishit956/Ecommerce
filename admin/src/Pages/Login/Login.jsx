import React, { useState } from 'react';

const Login = () => {
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      window.location.href = "/";
    } else {
      alert("Incorrect admin password");
    }
  };

  return (
    <div className="login-page">
      <h2>Admin Login</h2>
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
