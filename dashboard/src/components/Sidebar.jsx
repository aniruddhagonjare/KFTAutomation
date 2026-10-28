import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Globe, Smartphone, BarChart2, Cpu, LayoutDashboard, Layers,
  Crown, User, LogOut, SlidersHorizontal, ScanLine,
} from 'lucide-react';
import { SCRIPT_CATEGORIES } from '../utils/helpers';

const ICONS = {
  'Web UI': Globe, 'Mobile': Smartphone, 'Performance': BarChart2,
  'Utilities': Cpu, 'All': LayoutDashboard, 'Misc': Layers,
};

export default function Sidebar({ auth, isAdmin, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Read current category from URL search params; default to 'All'
  const params = new URLSearchParams(location.search);
  const currentCategory = params.get('category') || 'All';
  const onDashboard = location.pathname === '/';

  const handleCategoryClick = (cat) => {
    navigate(`/?category=${encodeURIComponent(cat)}`);
  };

  const handleVariablesClick = () => {
    navigate('/variables');
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <img
          src="/KFT.svg"
          alt="Knight Fintech"
          className="brand-logo"
          onError={(e) => { e.target.src = '/kft-logo.png'; }}
        />
        <div className="brand-tag">
          <span>KFT Automation Build</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          {auth.user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{auth.user.name}</span>
          <span className={`sidebar-user-role ${isAdmin ? 'admin' : 'viewer'}`}>
            {isAdmin ? <><Crown size={10} /> Admin</> : <><User size={10} /> Viewer</>}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="nav-section-label">Integrations</span>
        {SCRIPT_CATEGORIES.map((cat) => {
          const Icon = ICONS[cat] || Layers;
          // Active = on dashboard route AND this category is selected
          const isActive = onDashboard && currentCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`nav-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              {cat}
            </button>
          );
        })}

        {/* KYC Simulation */}
        <span className="nav-section-label" style={{ marginTop: 16 }}>Simulation</span>
        <button
          onClick={() => navigate('/kyc')}
          className={`nav-btn ${location.pathname === '/kyc' ? 'active' : ''}`}
        >
          <ScanLine size={16} />
          KYC Simulation
        </button>

        {/* Variables — Admin only */}
        {isAdmin && (
          <>
            <span className="nav-section-label" style={{ marginTop: 16 }}>Config</span>
            <button
              onClick={handleVariablesClick}
              className={`nav-btn ${location.pathname === '/variables' ? 'active' : ''}`}
            >
              <SlidersHorizontal size={16} />
              Variables
            </button>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="status-dot" />
        <span className="status-text">Server Online</span>
        <button className="logout-btn" onClick={onLogout} title="Sign Out">
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
