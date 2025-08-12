import React, { useState } from 'react';
import '../css/Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
        console.log(data);
      if (data.success) {
        
        // Redirect based on role from backend
        if (data.data.role === 'admin') {
          navigate('/admin/dashboard', { state: { userData: data } });
        } else if (data.data.role === 'student') {
          navigate('/student/dashboard', { state: { userData: data } });
        } else {
          setError('Unknown role. Please contact support.');
        }
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (error) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="home-container">
      <h1 className="title">Smart Canteen System</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Home;
