import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Layers } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Topbar from '../components/Topbar';
import ScriptCard from '../components/ScriptCard';
import LogTerminal from '../components/LogTerminal';
import { SCRIPT_CATEGORIES, CATEGORY_ICONS } from '../utils/helpers';

export default function Dashboard({
  socket, scripts, status, logs, stats, currentScript,
  isAdmin, fetchScripts, runScript, stopScript,
}) {
  // Category is stored in URL (?category=Web+UI) so it survives reload
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'All';

  const [filter, setFilter] = useState('');
  const [terminalTab, setTerminalTab] = useState('logs');

  const filtered = scripts.filter((s) =>
    (category === 'All' || s.category === category) &&
    s.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <Topbar
        stats={stats}
        isAdmin={isAdmin}
        filter={filter}
        setFilter={setFilter}
        fetchScripts={fetchScripts}
      />

      <div className="content">
        {/* Script Grid */}
        <section>
          <div className="section-header">
            <div className="section-title">
              <Layers size={14} />
              Routines ({filtered.length})
            </div>
            {status === 'running' && (
              <span className="running-badge">▶ Running: {currentScript}</span>
            )}
          </div>

          <div className="script-grid">
            <AnimatePresence>
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <Search size={36} />
                  <p>No scripts matched your search</p>
                </div>
              ) : (
                filtered.map((script) => (
                  <ScriptCard
                    key={script.name}
                    script={script}
                    isRunning={currentScript === script.name}
                    disabled={(status === 'running' && currentScript !== script.name) || !isAdmin}
                    canRun={isAdmin}
                    onRun={() => runScript(script.name)}
                    onStop={stopScript}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Terminal Section */}
        <LogTerminal
          logs={logs}
          status={status}
          socket={socket}
          isAdmin={isAdmin}
          terminalTab={terminalTab}
          setTerminalTab={setTerminalTab}
        />
      </div>
    </>
  );
}
