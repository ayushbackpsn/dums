import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', minHeight: '70vh', alignItems: 'center' }}>
      <div className="glass-card form-container" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Login to access your premium collection</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '1.1rem', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              placeholder="Email address" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: '3rem' }}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '1.1rem', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '3rem' }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : <><LogIn size={20} /> Login Now</>}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign up <ArrowRight size={14} style={{ verticalAlign: 'middle' }} /></Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
