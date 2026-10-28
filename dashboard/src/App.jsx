import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import KYCSimulation from './pages/KYCSimulation';
import EnvManager from './EnvManager';
import { API_BASE } from './utils/helpers';

// ─── Loading splash ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#080b14', flexDirection: 'column', gap: 16,
    }}>
      <div className="login-spinner" style={{
        width: 32, height: 32,
        border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1',
      }} />
      <p style={{ color: '#4b5563', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Restoring Session...
      </p>
    </div>
  );
}

// ─── Root App — handles auth, socket, routing ─────────────────────────────────
export default function App() {
  const [auth, setAuth] = useState({ user: null, loading: true });
  const [socket, setSocket] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [status, setStatus] = useState('idle');
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, passed: 0, failed: 0 });
  const [currentScript, setCurrentScript] = useState(null);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleLogin = (user) => setAuth({ user, loading: false });

  const handleLogout = async () => {
    try { await axios.post(`${API_BASE}/api/auth/logout`, {}, { withCredentials: true }); } catch {}
    if (socket) { socket.disconnect(); setSocket(null); }
    setScripts([]);
    setLogs([]);
    setAuth({ user: null, loading: false });
  };

  // Restore existing session from HttpOnly cookie on page load/reload
  useEffect(() => {
    axios.get(`${API_BASE}/api/auth/me`, { withCredentials: true })
      .then(({ data }) => {
        setAuth(data.success
          ? { user: data.data.user, loading: false }
          : { user: null, loading: false }
        );
      })
      .catch(() => setAuth({ user: null, loading: false }));
  }, []);

  // ── Socket ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!auth.user) return;

    const s = io(API_BASE, { withCredentials: true });

    s.on('connect_error', (err) => {
      if (err.message === 'UNAUTHORIZED') handleLogout();
    });

    s.on('log', (data) => setLogs((prev) => [...prev.slice(-1000), data]));

    s.on('error-msg', ({ message }) =>
      setLogs((prev) => [...prev, `[System Error] ${message}\n`])
    );

    s.on('status', ({ status: st, script, exitCode }) => {
      setStatus(st);
      if (st === 'idle') {
        setCurrentScript(null);
        if (exitCode === 0) setStats((p) => ({ ...p, passed: p.passed + 1 }));
        else if (exitCode !== null) setStats((p) => ({ ...p, failed: p.failed + 1 }));
      } else {
        setCurrentScript(script);
        setStats((p) => ({ ...p, total: p.total + 1 }));
      }
    });

    setSocket(s);
    return () => s.disconnect();
  }, [auth.user]);

  // ── Scripts ───────────────────────────────────────────────────────────────
  const fetchScripts = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/scripts`, { withCredentials: true });
      setScripts(data.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  };

  useEffect(() => {
    if (auth.user) fetchScripts();
  }, [auth.user]);

  // ── Script execution ──────────────────────────────────────────────────────
  const runScript = (name) => {
    if (!socket) return;
    setLogs([`[${new Date().toLocaleTimeString()}] Initializing: ${name}\n`]);
    socket.emit('run-script', { name });
  };

  const stopScript = () => {
    if (socket) socket.emit('stop-script');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (auth.loading) return <LoadingScreen />;
  if (!auth.user) return <LoginPage onLogin={handleLogin} />;

  const isAdmin = auth.user.role === 'admin';

  const dashboardProps = {
    socket, scripts, status, logs, stats, currentScript,
    isAdmin, fetchScripts, runScript, stopScript,
  };

  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar auth={auth} isAdmin={isAdmin} onLogout={handleLogout} />

        <div className="main">
          <Routes>
            {/* Main dashboard — category filter via ?category= URL param */}
            <Route path="/" element={<Dashboard {...dashboardProps} />} />

            {/* KYC Simulation */}
            <Route path="/kyc" element={<KYCSimulation />} />

            {/* Variables page — admin only */}
            <Route
              path="/variables"
              element={
                isAdmin
                  ? <div className="content"><EnvManager /></div>
                  : <Navigate to="/" replace />
              }
            />

            {/* Catch-all → home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
