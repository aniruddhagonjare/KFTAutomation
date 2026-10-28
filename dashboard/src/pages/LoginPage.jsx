import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Eye, EyeOff, ShieldAlert, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE, encodeCredentials } from '../utils/helpers';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = encodeCredentials(username, password);
      const { data } = await axios.post(
        `${API_BASE}/api/auth/login`,
        { payload },
        { withCredentials: true }
      );
      if (data.success) onLogin(data.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-grid" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="login-card"
      >
        <div className="login-logo-wrap">
          <img
            src="/KFT.svg"
            alt="Knight Fintech"
            className="login-logo"
            onError={(e) => { e.target.src = '/kft-logo.png'; }}
          />
        </div>

        <div className="login-heading">
          <Lock size={18} />
          <h2>Secure Access</h2>
        </div>
        <p className="login-sub">
          Sign in with your whitelisted credentials to access the Automation Control Center.
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label className="field-label" htmlFor="login-user">Username or Email</label>
            <div className="field-wrap">
              <User size={16} className="field-icon" />
              <input
                id="login-user"
                className="field-input"
                type="text"
                placeholder="your.name@knightfintech.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="login-pwd">Password</label>
            <div className="field-wrap">
              <Lock size={16} className="field-icon" />
              <input
                id="login-pwd"
                className="field-input"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pwd-toggle"
                onClick={() => setShowPwd((v) => !v)}
                tabIndex={-1}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="login-error"
              >
                <ShieldAlert size={15} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="login-spinner" /> : <><Lock size={14} /> Sign In</>}
          </button>
        </form>

        <p className="login-footer-note">
          Only whitelisted KFT team members can access this system.
        </p>
      </motion.div>
    </div>
  );
}
