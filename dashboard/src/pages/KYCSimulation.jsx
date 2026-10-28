import React, { useState, useCallback } from 'react';
import {
  CheckCircle, XCircle, Camera, FileText, User, Shield,
  ChevronRight, RotateCcw, Play, Clock, AlertTriangle,
  Fingerprint, Eye, ScanLine, Loader, BadgeCheck, Ban,
  UserX, FileX, RefreshCw, ChevronDown, Info,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const SCENARIOS = {
  success: {
    id: 'success',
    label: 'KYC Approved',
    shortLabel: 'Success',
    icon: BadgeCheck,
    color: '#10b981',
    colorSubtle: 'rgba(16, 185, 129, 0.08)',
    colorBorder: 'rgba(16, 185, 129, 0.2)',
    colorGlow: 'rgba(16, 185, 129, 0.15)',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    description: 'All checks passed. Identity verified successfully.',
    steps: [
      { id: 'doc_upload', label: 'Document Upload', icon: FileText, status: 'pass', detail: 'PAN Card uploaded & validated' },
      { id: 'selfie', label: 'Selfie Capture', icon: Camera, status: 'pass', detail: 'Live selfie captured' },
      { id: 'face_match', label: 'Face Match', icon: Eye, status: 'pass', detail: '98.4% confidence match' },
      { id: 'name_verify', label: 'Name Verification', icon: User, status: 'pass', detail: 'Name matches PAN record' },
      { id: 'liveness', label: 'Liveness Check', icon: Fingerprint, status: 'pass', detail: 'Liveness detected: real person' },
      { id: 'final', label: 'Final Decision', icon: Shield, status: 'pass', detail: 'KYC APPROVED' },
    ],
    result: {
      status: 'APPROVED',
      message: 'Your KYC has been successfully verified.',
      subMessage: 'Account activation will be completed within 24 hours.',
      applicantId: 'KFT-2024-A8821',
      riskScore: 12,
      confidence: 98.4,
    },
  },
  rejected: {
    id: 'rejected',
    label: 'KYC Rejected',
    shortLabel: 'Rejected',
    icon: Ban,
    color: '#ef4444',
    colorSubtle: 'rgba(239, 68, 68, 0.08)',
    colorBorder: 'rgba(239, 68, 68, 0.2)',
    colorGlow: 'rgba(239, 68, 68, 0.15)',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    description: 'KYC rejected due to document quality / policy violation.',
    steps: [
      { id: 'doc_upload', label: 'Document Upload', icon: FileText, status: 'pass', detail: 'Document received' },
      { id: 'selfie', label: 'Selfie Capture', icon: Camera, status: 'pass', detail: 'Selfie received' },
      { id: 'face_match', label: 'Face Match', icon: Eye, status: 'fail', detail: 'Face match failed: 31% confidence' },
      { id: 'name_verify', label: 'Name Verification', icon: User, status: 'fail', detail: 'Could not extract name from document' },
      { id: 'liveness', label: 'Liveness Check', icon: Fingerprint, status: 'fail', detail: 'Spoof detected — replay attack' },
      { id: 'final', label: 'Final Decision', icon: Shield, status: 'fail', detail: 'KYC REJECTED' },
    ],
    result: {
      status: 'REJECTED',
      message: 'Your KYC application has been rejected.',
      subMessage: 'Please contact support or resubmit with valid documents.',
      applicantId: 'KFT-2024-B3347',
      riskScore: 89,
      confidence: 31,
    },
  },
  selfie_mismatch: {
    id: 'selfie_mismatch',
    label: 'Selfie Mismatch',
    shortLabel: 'Selfie Mismatch',
    icon: UserX,
    color: '#f59e0b',
    colorSubtle: 'rgba(245, 158, 11, 0.08)',
    colorBorder: 'rgba(245, 158, 11, 0.2)',
    colorGlow: 'rgba(245, 158, 11, 0.15)',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    description: 'Selfie photo does not match the identity document photo.',
    steps: [
      { id: 'doc_upload', label: 'Document Upload', icon: FileText, status: 'pass', detail: 'PAN Card validated successfully' },
      { id: 'selfie', label: 'Selfie Capture', icon: Camera, status: 'pass', detail: 'Selfie captured & processed' },
      { id: 'face_match', label: 'Face Match', icon: Eye, status: 'fail', detail: '38.7% confidence — MISMATCH DETECTED' },
      { id: 'name_verify', label: 'Name Verification', icon: User, status: 'pass', detail: 'Name matches PAN record' },
      { id: 'liveness', label: 'Liveness Check', icon: Fingerprint, status: 'pass', detail: 'Liveness confirmed' },
      { id: 'final', label: 'Final Decision', icon: Shield, status: 'fail', detail: 'SELFIE MISMATCH — REQUIRES REVIEW' },
    ],
    result: {
      status: 'SELFIE_MISMATCH',
      message: 'Selfie does not match your identity document.',
      subMessage: 'Please retake your selfie in good lighting and resubmit.',
      applicantId: 'KFT-2024-C5519',
      riskScore: 61,
      confidence: 38.7,
    },
  },
  name_mismatch: {
    id: 'name_mismatch',
    label: 'Name Mismatch',
    shortLabel: 'Name Mismatch',
    icon: FileX,
    color: '#8b5cf6',
    colorSubtle: 'rgba(139, 92, 246, 0.08)',
    colorBorder: 'rgba(139, 92, 246, 0.2)',
    colorGlow: 'rgba(139, 92, 246, 0.15)',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    description: 'Name on document does not match the registered account name.',
    steps: [
      { id: 'doc_upload', label: 'Document Upload', icon: FileText, status: 'pass', detail: 'Document uploaded & parsed' },
      { id: 'selfie', label: 'Selfie Capture', icon: Camera, status: 'pass', detail: 'Selfie matched — 91.2% confidence' },
      { id: 'face_match', label: 'Face Match', icon: Eye, status: 'pass', detail: 'Face verified successfully' },
      { id: 'name_verify', label: 'Name Verification', icon: User, status: 'fail', detail: '"Rahul Sharma" ≠ "R. Sharma" — NAME MISMATCH' },
      { id: 'liveness', label: 'Liveness Check', icon: Fingerprint, status: 'pass', detail: 'Liveness confirmed' },
      { id: 'final', label: 'Final Decision', icon: Shield, status: 'fail', detail: 'NAME MISMATCH — MANUAL REVIEW REQUIRED' },
    ],
    result: {
      status: 'NAME_MISMATCH',
      message: 'Name on document does not match your account.',
      subMessage: 'Update your name in the application or provide matching documents.',
      applicantId: 'KFT-2024-D7782',
      riskScore: 44,
      confidence: 91.2,
    },
  },
};

const STEP_DELAY_MS = 700;

// ─── Utility ──────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScenarioCard({ scenario, isActive, onClick }) {
  const Icon = scenario.icon;
  return (
    <button
      className={`kyc-scenario-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Select ${scenario.label} scenario`}
      style={{
        '--s-color': scenario.color,
        '--s-subtle': scenario.colorSubtle,
        '--s-border': scenario.colorBorder,
        '--s-glow': scenario.colorGlow,
      }}
    >
      <div className="kyc-sc-icon-wrap">
        <Icon size={20} />
      </div>
      <div className="kyc-sc-info">
        <span className="kyc-sc-title">{scenario.shortLabel}</span>
        <span className="kyc-sc-desc">{scenario.description}</span>
      </div>
      {isActive && <div className="kyc-sc-active-dot" />}
    </button>
  );
}

function StepRow({ step, state, index, color }) {
  const Icon = step.icon;

  const isComplete = state === 'done';
  const isRunning = state === 'running';
  const isPending = state === 'pending';

  let statusIcon;
  if (isRunning) statusIcon = <Loader size={16} className="kyc-spin" style={{ color }} />;
  else if (isComplete && step.status === 'pass') statusIcon = <CheckCircle size={16} style={{ color: '#10b981' }} />;
  else if (isComplete && step.status === 'fail') statusIcon = <XCircle size={16} style={{ color: '#ef4444' }} />;
  else statusIcon = <div className="kyc-step-pending-dot" />;

  return (
    <div
      className={`kyc-step-row ${isRunning ? 'running' : ''} ${isComplete ? 'complete' : ''} ${isPending ? 'pending' : ''}`}
      style={{ '--s-color': color }}
    >
      <div className="kyc-step-index">{String(index + 1).padStart(2, '0')}</div>
      <div className="kyc-step-icon-wrap">
        <Icon size={14} />
      </div>
      <div className="kyc-step-content">
        <span className="kyc-step-label">{step.label}</span>
        {isComplete && (
          <span
            className="kyc-step-detail"
            style={{ color: step.status === 'pass' ? '#10b981' : '#ef4444' }}
          >
            {step.detail}
          </span>
        )}
        {isRunning && (
          <span className="kyc-step-detail" style={{ color }}>
            Processing...
          </span>
        )}
      </div>
      <div className="kyc-step-status">{statusIcon}</div>
    </div>
  );
}

function ResultBanner({ scenario, result }) {
  const statusMap = {
    APPROVED: { label: 'APPROVED', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
    REJECTED: { label: 'REJECTED', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
    SELFIE_MISMATCH: { label: 'SELFIE MISMATCH', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
    NAME_MISMATCH: { label: 'NAME MISMATCH', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' },
  };

  const s = statusMap[result.status] || statusMap.REJECTED;

  return (
    <div
      className="kyc-result-banner"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      <div className="kyc-result-status" style={{ color: s.color }}>
        {result.status === 'APPROVED'
          ? <CheckCircle size={28} />
          : result.status === 'NAME_MISMATCH'
            ? <FileX size={28} />
            : result.status === 'SELFIE_MISMATCH'
              ? <UserX size={28} />
              : <XCircle size={28} />}
        <span>{s.label}</span>
      </div>

      <p className="kyc-result-message">{result.message}</p>
      <p className="kyc-result-sub">{result.subMessage}</p>

      <div className="kyc-result-meta">
        <div className="kyc-meta-item">
          <span className="kyc-meta-label">Applicant ID</span>
          <span className="kyc-meta-value">{result.applicantId}</span>
        </div>
        <div className="kyc-meta-item">
          <span className="kyc-meta-label">Risk Score</span>
          <span className="kyc-meta-value" style={{ color: result.riskScore > 70 ? '#ef4444' : result.riskScore > 40 ? '#f59e0b' : '#10b981' }}>
            {result.riskScore} / 100
          </span>
        </div>
        <div className="kyc-meta-item">
          <span className="kyc-meta-label">Face Match</span>
          <span className="kyc-meta-value">{result.confidence}%</span>
        </div>
        <div className="kyc-meta-item">
          <span className="kyc-meta-label">Timestamp</span>
          <span className="kyc-meta-value">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KYCSimulation() {
  const [selectedId, setSelectedId] = useState('success');
  const [stepStates, setStepStates] = useState({}); // { stepId: 'pending'|'running'|'done' }
  const [simRunning, setSimRunning] = useState(false);
  const [simDone, setSimDone] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const scenario = SCENARIOS[selectedId];

  const resetSim = useCallback(() => {
    setStepStates({});
    setSimRunning(false);
    setSimDone(false);
  }, []);

  const handleSelectScenario = (id) => {
    if (simRunning) return;
    setSelectedId(id);
    resetSim();
  };

  const runSimulation = useCallback(async () => {
    if (simRunning) return;
    setSimDone(false);
    setStepStates({});
    setSimRunning(true);

    const steps = SCENARIOS[selectedId].steps;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      // Mark current as running
      setStepStates((prev) => ({ ...prev, [step.id]: 'running' }));
      await sleep(STEP_DELAY_MS);

      // Mark current as done
      setStepStates((prev) => ({ ...prev, [step.id]: 'done' }));
      await sleep(180);
    }

    setSimRunning(false);
    setSimDone(true);
  }, [selectedId, simRunning]);

  const steps = scenario.steps;
  const completedCount = steps.filter((s) => stepStates[s.id] === 'done').length;
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  return (
    <div className="content kyc-page">
      {/* ── Page header ── */}
      <div className="kyc-page-header">
        <div className="kyc-page-title-group">
          <div className="kyc-page-icon">
            <ScanLine size={20} />
          </div>
          <div>
            <h1 className="kyc-page-title">KYC Simulation</h1>
            <p className="kyc-page-subtitle">
              Select a scenario and run a simulated KYC verification flow
            </p>
          </div>
        </div>
        <button
          className="kyc-info-btn"
          onClick={() => setShowInfo((v) => !v)}
          aria-label="Toggle info"
        >
          <Info size={16} />
          How it works
          <ChevronDown
            size={14}
            style={{ transform: showInfo ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          />
        </button>
      </div>

      {/* ── Info panel ── */}
      {showInfo && (
        <div className="kyc-info-panel">
          <p>
            This simulation mimics a real KYC (Know Your Customer) verification pipeline.
            Choose a scenario below — the engine will step through document upload, selfie capture,
            face-matching, name verification, and liveness checks — then render the final decision.
            No real data is processed.
          </p>
          <div className="kyc-info-tags">
            {Object.values(SCENARIOS).map((s) => (
              <span key={s.id} className="kyc-info-tag" style={{ color: s.color, borderColor: s.colorBorder, background: s.colorSubtle }}>
                {s.shortLabel}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Scenario selector ── */}
      <div className="kyc-section">
        <div className="kyc-section-label">
          <ChevronRight size={13} /> Select Scenario
        </div>
        <div className="kyc-scenarios-grid">
          {Object.values(SCENARIOS).map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              isActive={selectedId === s.id}
              onClick={() => handleSelectScenario(s.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Simulation panel ── */}
      <div className="kyc-sim-panel">
        {/* Left: Steps pipeline */}
        <div className="kyc-pipeline-panel">
          <div className="kyc-pipeline-header">
            <div className="kyc-pipeline-title">
              <ScanLine size={14} />
              Verification Pipeline
            </div>
            {simRunning && (
              <span className="kyc-running-badge">
                <Clock size={11} /> RUNNING
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="kyc-progress-bar-wrap">
            <div
              className="kyc-progress-bar-fill"
              style={{
                width: `${progress}%`,
                background: scenario.gradient,
                boxShadow: simRunning ? `0 0 12px ${scenario.colorGlow}` : 'none',
              }}
            />
          </div>
          <div className="kyc-progress-label">
            {completedCount} / {steps.length} steps
          </div>

          {/* Step rows */}
          <div className="kyc-steps-list">
            {steps.map((step, idx) => (
              <StepRow
                key={step.id}
                step={step}
                index={idx}
                state={stepStates[step.id] || 'pending'}
                color={scenario.color}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="kyc-action-row">
            <button
              id="kyc-run-btn"
              className="kyc-run-btn"
              onClick={runSimulation}
              disabled={simRunning}
              style={{
                background: simRunning ? 'rgba(255,255,255,0.05)' : scenario.gradient,
                boxShadow: simRunning ? 'none' : `0 4px 20px ${scenario.colorGlow}`,
              }}
              aria-label="Run KYC simulation"
            >
              {simRunning ? (
                <><Loader size={15} className="kyc-spin" /> Simulating…</>
              ) : simDone ? (
                <><RefreshCw size={15} /> Run Again</>
              ) : (
                <><Play size={15} /> Run Simulation</>
              )}
            </button>
            {(simRunning || simDone) && (
              <button
                id="kyc-reset-btn"
                className="kyc-reset-btn"
                onClick={resetSim}
                disabled={simRunning}
                aria-label="Reset simulation"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Right: Result / Preview */}
        <div className="kyc-result-panel">
          <div className="kyc-result-panel-header">
            <div className="kyc-pipeline-title">
              <Shield size={14} />
              Decision Output
            </div>
          </div>

          {!simDone && !simRunning && (
            <div className="kyc-result-empty">
              <div
                className="kyc-result-empty-icon"
                style={{ background: scenario.colorSubtle, border: `1px solid ${scenario.colorBorder}` }}
              >
                <scenario.icon size={32} style={{ color: scenario.color }} />
              </div>
              <p className="kyc-result-empty-title">Ready to Simulate</p>
              <p className="kyc-result-empty-sub">
                Selected: <strong style={{ color: scenario.color }}>{scenario.label}</strong>
              </p>
              <p className="kyc-result-empty-hint">
                Click "Run Simulation" to start the KYC verification pipeline
              </p>
            </div>
          )}

          {simRunning && !simDone && (
            <div className="kyc-result-empty">
              <div
                className="kyc-result-loading-icon"
                style={{ background: scenario.colorSubtle, border: `1px solid ${scenario.colorBorder}` }}
              >
                <Loader size={32} className="kyc-spin" style={{ color: scenario.color }} />
              </div>
              <p className="kyc-result-empty-title">Verifying Identity…</p>
              <p className="kyc-result-empty-sub" style={{ color: scenario.color }}>
                Step {completedCount + 1} of {steps.length}
              </p>
              <p className="kyc-result-empty-hint">
                {steps[completedCount]?.label || 'Finalizing…'}
              </p>
            </div>
          )}

          {simDone && (
            <ResultBanner scenario={scenario} result={scenario.result} />
          )}

          {/* Legend */}
          <div className="kyc-legend">
            <div className="kyc-legend-item">
              <CheckCircle size={12} style={{ color: '#10b981' }} /> Pass
            </div>
            <div className="kyc-legend-item">
              <XCircle size={12} style={{ color: '#ef4444' }} /> Fail
            </div>
            <div className="kyc-legend-item">
              <Clock size={12} style={{ color: '#6366f1' }} /> Pending
            </div>
          </div>
        </div>
      </div>

      {/* ── Scenario summary table ── */}
      <div className="kyc-summary-table-wrap">
        <div className="kyc-section-label" style={{ marginBottom: 12 }}>
          <ChevronRight size={13} /> All Scenario Outcomes
        </div>
        <div className="kyc-summary-table">
          <div className="kyc-table-header">
            <span>Scenario</span>
            <span>Face Match</span>
            <span>Risk Score</span>
            <span>Decision</span>
          </div>
          {Object.values(SCENARIOS).map((s) => (
            <div
              key={s.id}
              className={`kyc-table-row ${selectedId === s.id ? 'kyc-table-row--active' : ''}`}
              style={{ '--s-color': s.color }}
              onClick={() => handleSelectScenario(s.id)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${s.label} scenario`}
              onKeyDown={(e) => e.key === 'Enter' && handleSelectScenario(s.id)}
            >
              <span className="kyc-table-scenario">
                <s.icon size={14} style={{ color: s.color }} />
                {s.shortLabel}
              </span>
              <span style={{ color: s.result.confidence >= 80 ? '#10b981' : s.result.confidence >= 50 ? '#f59e0b' : '#ef4444' }}>
                {s.result.confidence}%
              </span>
              <span style={{ color: s.result.riskScore > 70 ? '#ef4444' : s.result.riskScore > 40 ? '#f59e0b' : '#10b981' }}>
                {s.result.riskScore}/100
              </span>
              <span
                className="kyc-table-decision"
                style={{ color: s.color, background: s.colorSubtle, borderColor: s.colorBorder }}
              >
                {s.result.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
