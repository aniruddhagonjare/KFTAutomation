import React from 'react';
import { Play, Square, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORY_CLASS } from '../utils/helpers';

export default function ScriptCard({ script, isRunning, onRun, onStop, disabled, canRun }) {
  const catClass = CATEGORY_CLASS[script.category] || 'misc';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`script-card ${isRunning ? 'running' : ''} ${disabled && !isRunning ? 'disabled' : ''}`}
    >
      <div className="card-top">
        <span className={`category-badge ${catClass}`}>{script.category}</span>
        <div className="card-status-dot" />
      </div>

      <div className="card-body">
        <div className="card-name" title={script.name}>{script.name}</div>
        <div className="card-command" title={script.command}>{script.command}</div>
      </div>

      {!canRun ? (
        <button className="run-btn locked" disabled>
          <Lock size={12} /> View Only
        </button>
      ) : isRunning ? (
        <button className="run-btn stop" onClick={onStop}>
          <Square size={13} fill="currentColor" /> Stop Execution
        </button>
      ) : (
        <button className="run-btn primary" onClick={onRun} disabled={disabled}>
          <Play size={13} fill="currentColor" /> Run
        </button>
      )}
    </motion.div>
  );
}
