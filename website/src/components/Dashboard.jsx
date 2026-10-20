import React, { useState } from 'react'
import {
  LayoutGrid,
  Activity,
  Bot,
  LayoutTemplate,
  Zap,
  BookOpen,
  AppWindow,
  Plug,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sun,
  Moon,
  ArrowRight,
  Terminal,
  Cpu,
  Lock,
  GitBranch,
  Play,
  RotateCw,
  Eye,
  AlertTriangle,
  FileCheck
} from 'lucide-react'

export default function Dashboard({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [opsCount, setOpsCount] = useState(248)
  const [freshness, setFreshness] = useState('updated just now')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [evalRunning, setEvalRunning] = useState(false)
  const [evalProgress, setEvalProgress] = useState(100)
  const [filterLane, setFilterLane] = useState('all')
  const [guardTestResult, setGuardTestResult] = useState(null)

  const [activities, setActivities] = useState([
    { id: 1, domain: 'merge-gate', action: 'gate-pass', agent: 'tsgf-review', time: 'just now', status: 'merged', variant: 'success' },
    { id: 2, domain: 'qa-lane', action: 'visual-proof', agent: 'tsgf-qa', time: '1m ago', status: 'verified', variant: 'success' },
    { id: 3, domain: 'build-lane', action: 'worktree-task', agent: 'tsgf-build', time: '3m ago', status: 'completed', variant: 'info' },
    { id: 4, domain: 'antigravity', action: 'wave-dispatched', agent: 'orchestrator', time: '7m ago', status: 'done', variant: 'success' },
    { id: 5, domain: 'safety-hook', action: 'push-guard', agent: 'guard-protected-push', time: '14m ago', status: 'protected', variant: 'success' },
    { id: 6, domain: 'collector', action: 'sentry-ingest', agent: 'tsgf-collect', time: '28m ago', status: 'filed', variant: 'success' }
  ])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setOpsCount(prev => prev + 3)
      setFreshness('updated just now')
      setIsRefreshing(false)
      const newAction = {
        id: Date.now(),
        domain: 'safety-hook',
        action: 'guard-audit',
        agent: 'tsgf-preflight',
        time: 'just now',
        status: 'verified',
        variant: 'success'
      }
      setActivities(prev => [newAction, ...prev.slice(0, 7)])
    }, 400)
  }

  const runEvalsSimulation = () => {
    setEvalRunning(true)
    setEvalProgress(10)
    setTimeout(() => setEvalProgress(45), 300)
    setTimeout(() => setEvalProgress(80), 600)
    setTimeout(() => {
      setEvalProgress(100)
      setEvalRunning(false)
      setOpsCount(prev => prev + 4)
    }, 900)
  }

  const testProtectedPushGuard = () => {
    setGuardTestResult('testing')
    setTimeout(() => {
      setGuardTestResult('blocked')
    }, 350)
  }

  const domains = [
    'antigravity-sdk',
    'build-lane',
    'qa-lane',
    'review-lane',
    'safety-hooks',
    'wave-planner',
    'worktrees',
    'evals',
    'visual-qa',
    'signal-collect',
    'merge-gate',
    'review-memory'
  ]

  const filteredActivities = filterLane === 'all'
    ? activities
    : activities.filter(a => a.domain.includes(filterLane) || a.agent.includes(filterLane))

  return (
    <div className="stage-window" id="dashboard-stage">
      {/* Sidebar */}
      <aside className="stage-sidebar">
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '-0.01em' }}>TSGF Factory</span>
          </div>
          <span className="badge-pill">v1.0.0</span>
        </div>

        <div className="sidebar-body">
          <div className="sidebar-group">
            <div className="sidebar-group-label">Factory Plane</div>
            <button
              className={`sidebar-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutGrid size={15} />
              <span>Overview</span>
            </button>
            <button
              className={`sidebar-tab-btn ${activeTab === 'agents' ? 'active' : ''}`}
              onClick={() => setActiveTab('agents')}
            >
              <Bot size={15} />
              <span>Worker Lanes</span>
              <span className="badge-pill" style={{ marginLeft: 'auto', fontSize: '9px', padding: '1px 5px' }}>3</span>
            </button>
            <button
              className={`sidebar-tab-btn ${activeTab === 'waves' ? 'active' : ''}`}
              onClick={() => setActiveTab('waves')}
            >
              <LayoutTemplate size={15} />
              <span>Wave Planner</span>
            </button>
            <button
              className={`sidebar-tab-btn ${activeTab === 'evals' ? 'active' : ''}`}
              onClick={() => setActiveTab('evals')}
            >
              <FileCheck size={15} />
              <span>Evals Suite</span>
              <span className="badge-pill success" style={{ marginLeft: 'auto', fontSize: '9px', padding: '1px 5px' }}>100%</span>
            </button>
            <button
              className={`sidebar-tab-btn ${activeTab === 'safety' ? 'active' : ''}`}
              onClick={() => setActiveTab('safety')}
            >
              <Lock size={15} />
              <span>Safety Hooks</span>
              <span className="badge-pill info" style={{ marginLeft: 'auto', fontSize: '9px', padding: '1px 5px' }}>6</span>
            </button>
            <button
              className={`sidebar-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <Activity size={15} />
              <span>Audit Ledger</span>
            </button>
          </div>

          <div className="sidebar-group">
            <div className="sidebar-group-label">Host Capabilities</div>
            <div className="sidebar-tab-btn" style={{ cursor: 'default', color: 'var(--text)' }}>
              <Zap size={15} style={{ color: 'var(--accent)' }} />
              <span>Google Antigravity</span>
              <span className="badge-pill info" style={{ marginLeft: 'auto', fontSize: '9px' }}>Primary</span>
            </div>
            <div className="sidebar-tab-btn" style={{ cursor: 'default' }}>
              <GitBranch size={15} />
              <span>Claude Code Worktree</span>
            </div>
            <div className="sidebar-tab-btn" style={{ cursor: 'default' }}>
              <Terminal size={15} />
              <span>Codex & Cursor Bridge</span>
            </div>
            <div className="sidebar-tab-btn" style={{ cursor: 'default' }}>
              <Plug size={15} />
              <span>Sentry / PostHog Signal</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="avatar-chip">AG</div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)' }}>Orchestrator Mode</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              antigravity://lead-plane
            </span>
          </div>
        </div>
      </aside>

      {/* Stage Main View */}
      <main className="stage-inset">
        {/* Stage Header */}
        <div className="stage-inset-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>
              {activeTab === 'overview' && 'Factory Overview'}
              {activeTab === 'agents' && 'Worker Lanes (Build, QA, Review)'}
              {activeTab === 'waves' && 'Wave Execution Planner'}
              {activeTab === 'evals' && 'Autonomous Evals & Graders'}
              {activeTab === 'safety' && 'Deterministic Safety Hooks (6/6)'}
              {activeTab === 'activity' && 'Attribution Audit Ledger'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href="/docs"
              className="btn btn-secondary"
              style={{ height: '28px', padding: '0 10px', fontSize: '12px' }}
              onClick={(e) => { e.preventDefault(); alert('TSGF Documentation: See CLAUDE.md and docs/hosts.md in repository root.'); }}
            >
              Docs
            </a>
            <button
              onClick={toggleTheme}
              className="btn-icon"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="stage-inset-content">
          {/* Welcome Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text)' }}>
                Welcome back, Lead Orchestrator
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Your factory plane, active waves, and worker lanes across Google Antigravity & multi-host runtimes.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {freshness}
              </span>
              <button
                className="btn btn-secondary"
                style={{ height: '28px', padding: '0 10px', fontSize: '12px' }}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw size={12} className={isRefreshing ? 'spin-anim' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Metric Tiles */}
              <div className="tiles-grid">
                <div className="tile-card" onClick={() => setActiveTab('agents')} style={{ cursor: 'pointer' }}>
                  <div className="tile-metric">3</div>
                  <div className="tile-label">
                    active worker lanes
                    <span className="marker-num">1</span>
                  </div>
                </div>

                <div className="tile-card">
                  <div className="tile-metric">{opsCount}</div>
                  <div className="tile-label">ops, last 24 h</div>
                </div>

                <div className="tile-card">
                  <div className="tile-metric" style={{ color: 'var(--success)' }}>0</div>
                  <div className="tile-label">unverified PRs merged</div>
                </div>

                <div className="tile-card">
                  <div className="tile-metric">0</div>
                  <div className="tile-label">stuck worktrees</div>
                </div>
              </div>

              {/* Verified Host Connection */}
              <div className="verified-banner">
                <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                <span style={{ color: 'var(--text)' }}>
                  Google Antigravity host connection verified. 8 skills, 6 safety hooks, and worktree isolation armed.
                </span>
                <button
                  onClick={() => setActiveTab('agents')}
                  style={{
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  Manage lanes
                </button>
              </div>

              {/* Capability Plane */}
              <div className="card-panel">
                <div className="card-panel-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>Capability plane</span>
                      <span className="marker-num">2</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      tsgf-core · up 99.99% · 6 safety hooks armed · Google Antigravity Primary
                    </div>
                  </div>
                  <span className="badge-pill success">
                    <span className="dot-indicator"></span>
                    active
                  </span>
                </div>

                <div className="card-panel-body">
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Configured factory domains</div>
                  <div className="domain-pills">
                    {domains.map((dom) => (
                      <span key={dom} className="domain-pill">
                        <span className="dot-indicator"></span>
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card-panel">
                <div className="card-panel-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>Recent activity</span>
                      <span className="marker-num">3</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Everything agents and worker lanes did on this factory plane, from the attribution ledgers.
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className="btn btn-secondary"
                    style={{ height: '26px', padding: '0 10px', fontSize: '11.5px' }}
                  >
                    View all
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div className="card-panel-body" style={{ padding: '8px' }}>
                  <div className="activity-list">
                    {activities.slice(0, 5).map((item) => (
                      <div key={item.id} className="activity-row">
                        <div className="activity-row-left">
                          <span className="badge-pill outline">{item.domain}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text)' }}>{item.action}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.agent}</span>
                        </div>
                        <div className="activity-row-right">
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{item.time}</span>
                          <span className={`badge-pill ${item.variant}`}>{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: WORKER LANES */}
          {activeTab === 'agents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                  TSGF isolates autonomous workers into 3 dedicated lanes. Each lane operates in a strict disposable git worktree.
                </p>
                <button
                  onClick={handleRefresh}
                  className="btn btn-primary"
                  style={{ height: '30px', padding: '0 12px', fontSize: '12px' }}
                >
                  <RotateCw size={12} />
                  <span>Simulate Next Wave Step</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {/* Lane 1: Build */}
                <div className="tile-card" style={{ gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Terminal size={16} style={{ color: 'var(--accent)' }} />
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>tsgf-build</span>
                    </div>
                    <span className="badge-pill success">working</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Task: <strong>feat(auth): refresh session tokens</strong>
                  </div>
                  <div style={{ background: 'var(--surface-alt)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Path: .agents/worktrees/wt-build-101<br />
                    Branch: tsgf/card-101-auth<br />
                    Diff: +182 / -44 (Budget: &lt;400)
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} /> 18 unit tests passing (TDD mode)
                  </div>
                </div>

                {/* Lane 2: QA */}
                <div className="tile-card" style={{ gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Eye size={16} style={{ color: 'var(--info)' }} />
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>tsgf-qa</span>
                    </div>
                    <span className="badge-pill info">verifying</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Task: <strong>Visual proof sheet & Playwright test</strong>
                  </div>
                  <div style={{ background: 'var(--surface-alt)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Viewport: 1200px + 375px mobile<br />
                    Visual Delta: 0px pixel divergence<br />
                    Auto-Remediation: 0 bugs bounced
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--info)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} /> Dual viewport visual matrix attached
                  </div>
                </div>

                {/* Lane 3: Review */}
                <div className="tile-card" style={{ gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>tsgf-review</span>
                    </div>
                    <span className="badge-pill outline">gatekeeper</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Task: <strong>Review memory & lint calibration</strong>
                  </div>
                  <div style={{ background: 'var(--surface-alt)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Atomic Lock: RELEASED<br />
                    Merge Policy: Exit code 0 (Allow)<br />
                    Max Rate: 1 PR per 180s (OK)
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} /> 0 human intervention required
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WAVES */}
          {activeTab === 'waves' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                The Wave Planner automatically schedules dependency-ordered development waves. Independent tasks execute in parallel lanes; dependent tasks await wave promotion.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="card-panel" style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--accent)' }}>Wave 1 (Active — In Progress)</span>
                    <span className="badge-pill success">2 parallel lanes active</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginTop: '8px' }}>
                    <div style={{ background: 'var(--surface-alt)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-tone)', fontFamily: 'var(--font-mono)' }}>CARD #101 · BUG</div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginTop: '2px' }}>Fix token expiration race condition</div>
                      <div style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '6px' }}>Lane: tsgf-build → .agents/worktrees/wt-101</div>
                    </div>
                    <div style={{ background: 'var(--surface-alt)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-tone)', fontFamily: 'var(--font-mono)' }}>CARD #102 · FEAT</div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginTop: '2px' }}>Add dark mode toggle indicator</div>
                      <div style={{ fontSize: '11px', color: 'var(--info)', marginTop: '6px' }}>Lane: tsgf-qa → .agents/worktrees/wt-102</div>
                    </div>
                  </div>
                </div>

                <div className="card-panel" style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-muted)' }}>Wave 2 (Queued — Awaiting Wave 1)</span>
                    <span className="badge-pill outline">Topological dependency</span>
                  </div>
                  <div style={{ background: 'var(--surface-alt)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', maxWidth: '360px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-tone)', fontFamily: 'var(--font-mono)' }}>CARD #103 · REFACTOR</div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginTop: '2px' }}>Consolidate session manager hooks</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Depends on: Card #101</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVALS */}
          {activeTab === 'evals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Evaluation Framework (100% Passing)</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Continuous regression test harness enforcing worktree safety and deduplication logic.
                  </p>
                </div>
                <button
                  onClick={runEvalsSimulation}
                  disabled={evalRunning}
                  className="btn btn-primary"
                  style={{ height: '30px', padding: '0 12px', fontSize: '12px' }}
                >
                  <Play size={12} />
                  <span>{evalRunning ? `Running (${evalProgress}%)...` : 'Run All Evals'}</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                <div className="tile-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '600' }}>collect-duplicate</span>
                    <span className="badge-pill success">100% PASS</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Tests that Sentry / PostHog collectors detect existing tickets in Backlog and never file duplicates.
                  </p>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--success)', marginTop: '8px' }}>
                    evals/collect-duplicate/graders/grade.py: OK
                  </div>
                </div>

                <div className="tile-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '600' }}>worktree-isolation</span>
                    <span className="badge-pill success">100% PASS</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Tests that lane workers attempting file edits outside assigned worktrees are immediately blocked.
                  </p>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--success)', marginTop: '8px' }}>
                    evals/worktree-isolation/graders/grade.py: OK
                  </div>
                </div>

                <div className="tile-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '600' }}>merge-gate-policy</span>
                    <span className="badge-pill success">100% PASS</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Tests merge rate limits, atomic file locking, 400-line diff cap, and sensitive file protections.
                  </p>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--success)', marginTop: '8px' }}>
                    tests/test_guard_hooks.py: 4/4 OK
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SAFETY HOOKS */}
          {activeTab === 'safety' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '600' }}>6 Deterministic Safety Guard Hooks</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Hard OS-level guardrails execute before any tool action. Prompts cannot bypass them.
                  </p>
                </div>
                <button
                  onClick={testProtectedPushGuard}
                  className="btn btn-secondary"
                  style={{ height: '30px', padding: '0 12px', fontSize: '12px' }}
                >
                  <AlertTriangle size={12} style={{ color: 'var(--warning)' }} />
                  <span>Test Push to Main Block</span>
                </button>
              </div>

              {guardTestResult && (
                <div style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '12.5px', color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
                  🚫 Hook Triggered: [hooks/guard-protected-push.py] Blocked! Cannot push directly to protected branch 'main'. Workers must open PRs via isolated worktree.
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px' }}>
                {[
                  { name: 'hooks/guard-worktree-path.py', desc: 'Blocks any command or edit outside .agents/worktrees/' },
                  { name: 'hooks/guard-protected-push.py', desc: 'Blocks git push origin main/master; enforces PR workflow' },
                  { name: 'hooks/guard-secrets.py', desc: 'Blocks staging .env, pem, id_rsa, or credential tokens' },
                  { name: 'hooks/guard-key-literals.py', desc: 'Regex scanner blocks hardcoded API keys in diff' },
                  { name: 'hooks/guard-delete-outside.py', desc: 'Blocks rm/del targeting directories outside repository' },
                  { name: 'hooks/cleanup-wt.py', desc: 'Deterministic worktree cleanup preventing stale locks' },
                ].map((hook) => (
                  <div key={hook.name} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '12px 14px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '600', color: 'var(--text)' }}>{hook.name}</span>
                      <span className="badge-pill success" style={{ fontSize: '9px' }}>ARMED</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{hook.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ACTIVITY */}
          {activeTab === 'activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                  Immutable audit records captured across orchestrator and worker sessions.
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['all', 'build', 'qa', 'review', 'safety'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setFilterLane(filter)}
                      className={`btn ${filterLane === filter ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ height: '24px', padding: '0 8px', fontSize: '11px', textTransform: 'capitalize' }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-panel" style={{ padding: '6px' }}>
                <div className="activity-list">
                  {filteredActivities.map((item) => (
                    <div key={item.id} className="activity-row">
                      <div className="activity-row-left">
                        <span className="badge-pill outline">{item.domain}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text)' }}>{item.action}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.agent}</span>
                      </div>
                      <div className="activity-row-right">
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{item.time}</span>
                        <span className={`badge-pill ${item.variant}`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
