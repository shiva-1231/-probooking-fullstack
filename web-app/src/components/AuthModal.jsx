import React, { useState } from 'react';
import { loginUser, signupUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Username aur Password dono likhein!');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const data = await loginUser(username.trim(), password);
        if (data.access) {
          localStorage.setItem('webUserToken', data.access);
          localStorage.setItem('webUserName', username.trim());
          onAuthSuccess(data.access, username.trim());
          setUsername('');
          setPassword('');
          onClose();
        }
      } else {
        await signupUser(username.trim(), password);
        alert('Account ban gaya! 🎉 Ab Login karein.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '400px',
          padding: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F1F5F9',
            border: 'none',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ✕
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', marginBottom: '6px' }}>
          {isLogin ? 'Welcome Back 👋' : 'Create Account 🚀'}
        </h2>
        <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>
          {isLogin
            ? 'Apne ProBooking account mein login karein'
            : 'Naya account banakar order place karein'}
        </p>

        {error && (
          <div
            style={{
              background: '#FEE2E2',
              color: '#B91C1C',
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '13px',
              marginBottom: '16px',
              fontWeight: '600',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              Username
            </label>
            <input
              type="text"
              placeholder="Apna username likhein"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: '800',
              fontSize: '15px',
              cursor: 'pointer',
              marginTop: '6px',
            }}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '14px', color: '#475569' }}>
          {isLogin ? 'Account nahi hai? ' : 'Pehle se account hai? '}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{ color: '#4F46E5', fontWeight: '800', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign Up Karein' : 'Login Karein'}
          </span>
        </p>
      </div>
    </div>
  );
}