import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Key, 
  Save, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Lock,
} from 'lucide-react';


const API_BASE = 'http://localhost:3001';

// ─── Category config — group env vars by prefix/keyword ──────────────────────
const CATEGORIES = [
  {
    id: 'tokens',
    label: '🔑 Auth Tokens',
    color: '#818cf8',
    alwaysMasked: false,
    match: (key) => /token|Token|jwt|auth|Auth/i.test(key) && !key.includes('Hash') && !key.includes('Secret') && !key.includes('Code'),
  },
  {
    id: 'hashes',
    label: '🔐 Hashes & Codes',
    color: '#34d399',
    alwaysMasked: false,
    match: (key) => /hash|Hash|code|Code|secret|Secret|key|Key/i.test(key),
  },
  {
    id: 'db',
    label: '🗄️ Database',
    color: '#fb923c',
    alwaysMasked: true,   // DB credentials are NEVER shown in plaintext
    match: (key) => /db|DB|sql|SQL|server|SERVER/i.test(key),
  },
  {
    id: 'api',
    label: '🌐 API Config',
    color: '#38bdf8',
    alwaysMasked: false,
    match: (key) => /url|URL|base|BASE|endpoint/i.test(key),
  },
  {
    id: 'user',
    label: '👤 User Data',
    color: '#c084fc',
    alwaysMasked: false,
    match: (key) => /customer|partner|Customer|Partner|lead|userId|user/i.test(key),
  },
  {
    id: 'other',
    label: '⚙️ Other',
    color: '#94a3b8',
    alwaysMasked: false,
    match: () => true,
  },
];

function categorize(vars) {
  const grouped = {};
  CATEGORIES.forEach(c => (grouped[c.id] = []));

  vars.forEach(v => {
    const cat = CATEGORIES.find(c => c.match(v.key));
    if (cat) grouped[cat.id].push(v);
  });
  return grouped;
}

// ─── Single variable row ──────────────────────────────────────────────────────
function EnvRow({ envKey, originalValue, onUpdate, alwaysMasked }) {
  const [value, setValue] = useState(originalValue);
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isDirty = value !== originalValue;
  // Long values OR db category are always masked
  const isMasked = alwaysMasked || value.length > 40;
  // DB fields never get a show toggle — they stay hidden always
  const canReveal = isMasked && !alwaysMasked;
  const inputType = isMasked && (alwaysMasked || !visible) ? 'password' : 'text';

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      await onUpdate(envKey, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setValue(originalValue);
  };

  return (
    <div className={`env-row ${isDirty ? 'dirty' : ''}`}>
      <div className="env-key">
        <Key size={12} className="env-key-icon" />
        <span>{envKey}</span>
      </div>
      <div className="env-value-wrap">
        <input
          className="env-input"
          type={inputType}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="(empty)"
        />
        {canReveal && (
          <button className="env-eye-btn" onClick={() => setVisible(v => !v)} title={visible ? 'Hide' : 'Reveal'}>
            {visible ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
        {alwaysMasked && (
          <span className="env-locked-icon" title="Sensitive — always hidden">
            <Lock size={13} />
          </span>
        )}
      </div>
      <button
        className={`env-save-btn ${!isDirty ? 'dim' : ''} ${saved ? 'saved' : ''}`}
        onClick={handleSave}
        disabled={!isDirty || saving}
        title="Save (Enter)"
      >
        {saved ? <CheckCircle2 size={14} /> : saving ? <RefreshCw size={14} className="spin" /> : <Save size={14} />}
        {saved ? 'Saved' : 'Save'}
      </button>
    </div>
  );
}

// ─── Category accordion ───────────────────────────────────────────────────────
function EnvCategory({ category, vars, onUpdate }) {
  const [open, setOpen] = useState(category.id === 'tokens');

  if (vars.length === 0) return null;

  return (
    <div className="env-category">
      <button className="env-category-header" onClick={() => setOpen(o => !o)}>
        <span className="env-category-label" style={{ color: category.color }}>
          {category.label}
        </span>
        {category.alwaysMasked && (
          <span className="env-category-shield" title="Credentials hidden for security">
            <Lock size={11} /> Protected
          </span>
        )}
        <span className="env-category-count">{vars.length}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && (
        <div className="env-category-body">
          {vars.map(v => (
            <EnvRow
              key={v.key}
              envKey={v.key}
              originalValue={v.value}
              alwaysMasked={category.alwaysMasked}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Add New Variable ─────────────────────────────────────────────────────────
function AddVarForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');

  const handleAdd = () => {
    if (!newKey.trim()) return;
    onAdd(newKey.trim(), newVal);
    setNewKey('');
    setNewVal('');
    setOpen(false);
  };

  return (
    <div className="env-add-wrap">
      {!open ? (
        <button className="env-add-trigger" onClick={() => setOpen(true)}>
          <Plus size={13} /> Add New Variable
        </button>
      ) : (
        <div className="env-add-form">
          <input className="env-add-input" placeholder="VARIABLE_NAME" value={newKey} onChange={e => setNewKey(e.target.value)} />
          <input className="env-add-input flex1" placeholder="value" value={newVal} onChange={e => setNewVal(e.target.value)} />
          <button className="env-save-btn" onClick={handleAdd} disabled={!newKey.trim()}>
            <Save size={13} /> Add
          </button>
          <button className="env-cancel-btn" onClick={() => setOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

// ─── Main EnvManager Page ─────────────────────────────────────────────────────
export default function EnvManager() {
  const [vars, setVars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');

  const fetchVars = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${API_BASE}/api/env`, { withCredentials: true });
      setVars(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load environment variables.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVars(); }, []);

  const handleUpdate = async (key, value) => {
    await axios.patch(`${API_BASE}/api/env`, { updates: { [key]: value } }, { withCredentials: true });
    setVars(prev => prev.map(v => v.key === key ? { ...v, value } : v));
    showToast(`✓ ${key} updated`);
  };

  const handleAdd = async (key, value) => {
    await handleUpdate(key, value);
    if (!vars.find(v => v.key === key)) {
      setVars(prev => [...prev, { key, value }]);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const filtered = search
    ? vars.filter(v => v.key.toLowerCase().includes(search.toLowerCase()) || v.value.toLowerCase().includes(search.toLowerCase()))
    : vars;

  const grouped = categorize(filtered);

  return (
    <div className="env-page">
      {/* Header */}
      <div className="env-header">
        <div>
          <h2 className="env-title">Environment Variables</h2>
          <p className="env-subtitle">Manage tokens and config from your <code>.env</code> file. Changes are saved to disk instantly.</p>
        </div>
        <button className="icon-btn" onClick={fetchVars} title="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="env-search-wrap">
        <Search size={14} />
        <input
          className="env-search-input"
          type="text"
          placeholder="Search variables..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="env-error">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="env-loading">
          <div className="login-spinner" style={{ width: 24, height: 24, border: '2px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
          <span>Loading variables...</span>
        </div>
      ) : (
        <>
          {CATEGORIES.map(cat => (
            <EnvCategory
              key={cat.id}
              category={cat}
              vars={grouped[cat.id] || []}
              onUpdate={handleUpdate}
            />
          ))}
          <AddVarForm onAdd={handleAdd} />
        </>
      )}

      {/* Toast */}
      {toast && (
        <div className="env-toast">
          <CheckCircle2 size={14} /> {toast}
        </div>
      )}
    </div>
  );
}
