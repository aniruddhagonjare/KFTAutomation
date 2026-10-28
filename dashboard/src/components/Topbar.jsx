import React from 'react';
import { Search, RefreshCw, Settings, Eye } from 'lucide-react';

export default function Topbar({ stats, isAdmin, filter, setFilter, fetchScripts }) {
  return (
    <header className="topbar">
      <div className="search-wrapper">
        <Search />
        <input
          className="search-input"
          type="text"
          placeholder="Search automation scripts..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="topbar-stats">
        {!isAdmin && (
          <div className="viewer-badge">
            <Eye size={14} /> View Only
          </div>
        )}
        <div className="stat-item">
          <span className="stat-label">Runs</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="sep" />
        <div className="stat-item">
          <span className="stat-label">Passed</span>
          <span className="stat-value success">{stats.passed}</span>
        </div>
        <div className="sep" />
        <div className="stat-item">
          <span className="stat-label">Failed</span>
          <span className="stat-value danger">{stats.failed}</span>
        </div>
        <div className="sep" />
        <button className="icon-btn" onClick={fetchScripts} title="Refresh scripts">
          <RefreshCw size={18} />
        </button>
        <button className="icon-btn" title="Settings">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
