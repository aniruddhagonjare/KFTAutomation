import React, { useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import WebTerminal from '../WebTerminal';
import { classifyLog } from '../utils/helpers';

export default function LogTerminal({ logs, status, socket, isAdmin, terminalTab, setTerminalTab }) {
  const terminalEndRef = useRef(null);

  // Auto-scroll to latest log line
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <section className="terminal-section">
      {/* Tab switcher */}
      <div className="terminal-tabs">
        <button
          className={`terminal-tab ${terminalTab === 'logs' ? 'active' : ''}`}
          onClick={() => setTerminalTab('logs')}
        >
          <TerminalIcon size={13} /> Script Logs
          {status === 'running' && <span className="tab-live-dot" />}
        </button>
        <button
          className={`terminal-tab ${terminalTab === 'shell' ? 'active' : ''}`}
          onClick={() => setTerminalTab('shell')}
        >
          $ Interactive Shell
          {!isAdmin && <span className="tab-locked-icon">🔒</span>}
        </button>
      </div>

      {/* Script Log Viewer */}
      {terminalTab === 'logs' && (
        <div className="terminal-wrap">
          <div className="terminal-titlebar">
            <div className="terminal-dots"><span /><span /><span /></div>
            <span className="terminal-label">STDOUT · STDERR</span>
            {status === 'running' ? (
              <span className="terminal-live-badge">LIVE</span>
            ) : (
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em' }}>IDLE</span>
            )}
          </div>
          <div className="terminal-body">
            {logs.length === 0 ? (
              <div className="terminal-idle">
                <TerminalIcon size={40} />
                <p>{isAdmin ? 'Select a routine above to start execution' : 'You have view-only access. Logs will appear here when a script runs.'}</p>
              </div>
            ) : (
              <>
                {logs.map((line, i) => (
                  <div key={i} className="log-row">
                    <span className="log-line-num">{i + 1}</span>
                    <span className={`log-text ${classifyLog(line)}`}>{line}</span>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </>
            )}
          </div>
        </div>
      )}

      {/* Interactive Web Terminal */}
      {terminalTab === 'shell' && (
        <WebTerminal socket={socket} isAdmin={isAdmin} />
      )}
    </section>
  );
}
