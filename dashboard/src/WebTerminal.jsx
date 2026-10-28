import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TermIcon, Send, Square, RotateCcw, ChevronRight } from 'lucide-react';

/**
 * WebTerminal — Interactive shell terminal using piped child_process on the server.
 * Sends commands via Socket.io pty:input and displays output from pty:output.
 */
export default function WebTerminal({ socket, isAdmin }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const outputEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const onOutput = (data) => {
      // Split data into lines, preserving content
      const text = data.toString();
      setLines(prev => {
        // If last entry is incomplete (no newline), append to it
        if (prev.length > 0 && !prev[prev.length - 1].endsWith('\n')) {
          const updated = [...prev];
          updated[updated.length - 1] += text;
          return updated;
        }
        return [...prev, text];
      });
    };

    const onExit = () => {
      setRunning(false);
      setLines(prev => [...prev, '\n\x1b[90m[Session ended]\x1b[0m\n']);
    };

    socket.on('pty:output', onOutput);
    socket.on('pty:exit', onExit);

    return () => {
      socket.off('pty:output', onOutput);
      socket.off('pty:exit', onExit);
    };
  }, [socket]);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const startSession = () => {
    if (!socket || running) return;
    setLines([]);
    setRunning(true);
    socket.emit('pty:start');
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const stopSession = () => {
    if (!socket) return;
    socket.emit('pty:stop');
    setRunning(false);
  };

  const clearOutput = () => setLines([]);

  const sendCommand = () => {
    const cmd = input.trim();
    if (!cmd || !socket || !running) return;

    // Echo the command in our display
    setLines(prev => [...prev, `$ ${cmd}\n`]);
    // Add to history
    setHistory(prev => [cmd, ...prev.filter(h => h !== cmd)].slice(0, 50));
    setHistoryIdx(-1);
    // Send to server shell
    socket.emit('pty:input', `${cmd}\r`);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(newIdx);
      if (history[newIdx] !== undefined) setInput(history[newIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(newIdx);
      setInput(newIdx === -1 ? '' : history[newIdx]);
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      socket?.emit('pty:input', '\x03'); // Ctrl+C to interrupt
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      clearOutput();
    }
  };

  // Colorize output text
  const renderLine = (line, idx) => {
    let cls = 'shell-line';
    const lower = line.toLowerCase();
    if (line.startsWith('$ ')) cls += ' shell-line--cmd';
    else if (lower.includes('error') || lower.includes('failed') || lower.includes('✗')) cls += ' shell-line--error';
    else if (lower.includes('success') || lower.includes('✓') || lower.includes('done')) cls += ' shell-line--success';
    else if (lower.includes('warn')) cls += ' shell-line--warn';
    else if (line.startsWith('\x1b[90m') || line.includes('[session')) cls += ' shell-line--muted';
    return (
      <div key={idx} className={cls}>
        {line.replace(/\x1b\[[0-9;]*m/g, '')} {/* Strip ANSI codes for simple display */}
      </div>
    );
  };

  return (
    <div className="web-terminal-wrap">
      {/* Title bar */}
      <div className="web-terminal-titlebar">
        <div className="terminal-dots">
          <span style={{ background: running ? '#ff5f57' : '#3f3f46' }} />
          <span style={{ background: running ? '#febc2e' : '#3f3f46' }} />
          <span style={{ background: running ? '#28c840' : '#3f3f46' }} />
        </div>
        <span className="terminal-label">
          {running ? '● Shell Session Active' : '○ Interactive Shell'}
        </span>
        <div className="web-terminal-actions">
          {!isAdmin && <span className="web-terminal-badge locked">Admin Only</span>}
          {running && (
            <button className="web-terminal-btn clear" onClick={clearOutput} title="Clear (Ctrl+L)">
              <RotateCcw size={12} /> Clear
            </button>
          )}
          {running ? (
            <button className="web-terminal-btn stop" onClick={stopSession}>
              <Square size={12} fill="currentColor" /> End Session
            </button>
          ) : (
            <button className="web-terminal-btn start" onClick={startSession} disabled={!isAdmin}>
              <TermIcon size={12} /> Open Shell
            </button>
          )}
        </div>
      </div>

      {/* Output area */}
      <div className="shell-output" onClick={() => inputRef.current?.focus()}>
        {!running && lines.length === 0 ? (
          <div className="web-terminal-idle">
            <div className="web-terminal-idle-icon">$_</div>
            <p>
              {isAdmin
                ? 'Click "Open Shell" to start an interactive shell session in the project directory.'
                : 'Interactive terminal is restricted to Admin users.'}
            </p>
            {isAdmin && (
              <div className="shell-hint-list">
                <span>↑↓ History</span>
                <span>Ctrl+C Interrupt</span>
                <span>Ctrl+L Clear</span>
              </div>
            )}
          </div>
        ) : (
          <>
            {lines.map((line, idx) => renderLine(line, idx))}
            <div ref={outputEndRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      {running && (
        <div className="shell-input-bar">
          <ChevronRight size={14} className="shell-prompt-icon" />
          <input
            ref={inputRef}
            className="shell-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command and press Enter..."
            autoComplete="off"
            spellCheck={false}
          />
          <button className="shell-send-btn" onClick={sendCommand} disabled={!input.trim()}>
            <Send size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
