import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'
import {
  Copy,
  Check,
  Shield,
  Layers,
  Terminal,
  Eye,
  RefreshCw,
  GitBranch,
  Lock,
  ArrowRight,
  ExternalLink,
  Cpu,
  Smartphone,
  Laptop
} from 'lucide-react'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tsgf-theme') || 'dark'
      setTheme(saved)
      if (saved === 'light') {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
      } else {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      }
    } catch (e) {}
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem('tsgf-theme', next)
    } catch (e) {}
    if (next === 'light') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
  }

  const copyInstall = () => {
    const cmd = 'curl -fsSL https://raw.githubusercontent.com/gnanesh-16/TSGF/main/install.sh | bash'
    navigator.clipboard?.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page-wrapper">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* HERO SECTION */}
      <section className="band hero-section" id="hero">
        <div className="container-wrapper">
          <div className="hero-copy">
            <h1 className="hero-heading">
              <span className="hero-tone">All your agent lanes.</span>
              One factory, one wave, zero human bottlenecks.
            </h1>
            <p className="hero-lede">
              Google Antigravity, Claude Code, Codex, and Cursor share the same autonomous software development factory through TSGF. Set up once, plan dependency waves, isolate worker lanes in disposable worktrees, and enforce deterministic merge gates.
            </p>
            <div className="hero-actions">
              <a href="#quickstart" className="btn btn-primary btn-lg">
                Get started free
              </a>
              <a
                href="https://github.com/gnanesh-16/TSGF/blob/main/CLAUDE.md"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-lg"
              >
                Read the docs
              </a>
              <a
                href="./diagrams/skill-map/index.html"
                className="btn btn-secondary btn-lg"
                style={{ borderColor: 'var(--accent)' }}
              >
                Explore Skill Map Canvas →
              </a>
            </div>
          </div>

          {/* FIGURE: INTERACTIVE DASHBOARD STAGE */}
          <figure className="stage-figure">
            <Dashboard theme={theme} toggleTheme={toggleTheme} />

            <figcaption className="stage-legend">
              <ol className="legend-list">
                <li className="legend-item">
                  <span className="marker-num">1</span>
                  <span>Google Antigravity, Claude Code, Codex, and Cursor each connect with their own token. You choose what each lane can execute.</span>
                </li>
                <li className="legend-item">
                  <span className="marker-num">2</span>
                  <span>Everything your agents share, from isolated worktrees and wave scheduler to visual regression testing, safety hooks, and atomic merge gates.</span>
                </li>
                <li className="legend-item">
                  <span className="marker-num">3</span>
                  <span>Every commit, test run, QA screenshot, and review critique lands here, with the worker lane that did it and verifiable proof.</span>
                </li>
              </ol>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* RUNTIMES RIBBON */}
      <section className="band runtimes-section">
        <div className="container-wrapper">
          <h2 className="runtimes-caps">Works with the agents you already use</h2>
          <div className="runtimes-flex">
            <span className="runtime-item">
              Google Antigravity
              <span className="runtime-badge-primary">Primary Host</span>
            </span>
            <span className="runtime-item">Claude Code</span>
            <span className="runtime-item">OpenAI Codex CLI</span>
            <span className="runtime-item">Cursor IDE</span>
            <span className="runtime-item">OpenClaw</span>
            <span className="runtime-item">eve</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '400' }}>
              and any other agent that supports MCP or .agents/ skills
            </span>
          </div>
        </div>
      </section>

      {/* PROBLEM & VALUE PROP: CAPABILITY GRID */}
      <section className="band feature-section" id="architecture">
        <div className="container-wrapper">
          <div className="section-head">
            <h2 className="section-title-large">
              <span className="hero-tone">Your agent can't verify its own code, spins out of control, or breaks production.</span>
              With TSGF, it can.
            </h2>
            <div className="section-copy-large">
              <p>
                TSGF is one autonomous factory framework that holds what an agent needs to build production software for you: dependency-ordered wave planning, 3 isolated worker lanes, deterministic safety hooks, automated visual QA proof sheets, and atomic merge gates.
              </p>
              <p>
                Then connect your agents. Google Antigravity in your primary studio, Claude Code on your terminal, and Codex in CI share the same skills, memory, and rules. Switch agent harnesses anytime and it starts with everything the factory already knows.
              </p>
            </div>
          </div>

          <div className="capability-grid">
            {/* Tile 1: Wave Orchestration */}
            <article className="cap-card">
              <div className="cap-card-icon">
                <Layers size={22} />
              </div>
              <div>
                <h3 className="cap-card-title">Wave Orchestration</h3>
                <p className="cap-card-desc">
                  Dependency-ordered waves decompose complex backlogs into parallel execution sets. The orchestrator never codes directly in the primary session, eliminating context pollution.
                </p>
              </div>
              <div className="cap-card-quote">
                "/tsgf wave plan 4: cards #101, #102 dispatched"
              </div>
            </article>

            {/* Tile 2: Isolated Worktrees */}
            <article className="cap-card">
              <div className="cap-card-icon">
                <GitBranch size={22} />
              </div>
              <div>
                <h3 className="cap-card-title">Isolated Worktree Lanes</h3>
                <p className="cap-card-desc">
                  Every worker (tsgf-build, tsgf-qa, tsgf-review) executes inside an isolated git worktree under .agents/worktrees/. Untrusted agent code never touches your clean main branch.
                </p>
              </div>
              <div className="cap-card-quote">
                "git worktree add -b tsgf/101 .agents/worktrees/wt-101"
              </div>
            </article>

            {/* Tile 3: Safety Guard Hooks */}
            <article className="cap-card">
              <div className="cap-card-icon">
                <Lock size={22} />
              </div>
              <div>
                <h3 className="cap-card-title">Deterministic Safety Guards</h3>
                <p className="cap-card-desc">
                  6 pre-execution shell hooks prevent credential leaks, main branch pushes, and outside file deletions at the OS level. A confused agent cannot bypass them.
                </p>
              </div>
              <div className="cap-card-quote">
                "Blocked: cannot push directly to protected branch main"
              </div>
            </article>

            {/* Tile 4: Visual QA Proof */}
            <article className="cap-card">
              <div className="cap-card-icon">
                <Eye size={22} />
              </div>
              <div>
                <h3 className="cap-card-title">Dual-Viewport Visual QA</h3>
                <p className="cap-card-desc">
                  Automated Playwright dual-viewport screenshots (1200px desktop + 375px mobile) rendered in markdown proof tables before any PR can be approved.
                </p>
              </div>
              <div className="cap-card-quote">
                "Visual verification: 0px deviation against baseline"
              </div>
            </article>

            {/* Tile 5: Closed-Loop QA */}
            <article className="cap-card">
              <div className="cap-card-icon">
                <RefreshCw size={22} />
              </div>
              <div>
                <h3 className="cap-card-title">Closed-Loop Auto-Remediation</h3>
                <p className="cap-card-desc">
                  When QA finds a regression or broken test, the trace is automatically filed as a candidate bug ticket in Backlog and scheduled into the next wave.
                </p>
              </div>
              <div className="cap-card-quote">
                "Filing candidate bug #104: Auth token expiry race"
              </div>
            </article>

            {/* Tile 6: Review Memory */}
            <article className="cap-card">
              <div className="cap-card-icon">
                <Shield size={22} />
              </div>
              <div>
                <h3 className="cap-card-title">Review Memory & Calibration</h3>
                <p className="cap-card-desc">
                  Persistent critique memory tracks past review feedback and enforces TDD diff size limits (&lt;400 lines) with calibrated linter passes before merge.
                </p>
              </div>
              <div className="cap-card-quote">
                "Approved: adheres to TDD discipline and diff budget"
              </div>
            </article>

            {/* Tile 7: Multi-Host Engine */}
            <article className="cap-card">
              <div className="cap-card-icon">
                <Cpu size={22} />
              </div>
              <div>
                <h3 className="cap-card-title">Google Antigravity Primary</h3>
                <p className="cap-card-desc">
                  Engineered first-class for Google Antigravity, while symlinking cleanly into Claude Code, OpenAI Codex, and Cursor via a universal .agents/ contract.
                </p>
              </div>
              <div className="cap-card-quote">
                "tsgf-host.sh --host antigravity: 8 skills, 6 hooks armed"
              </div>
            </article>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
            <div className="badge-pill" style={{ padding: '8px 18px', fontSize: '13px', background: 'var(--card)', border: '1px solid var(--border)' }}>
              Set up once. Every agent lane shares it.
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS & SETUP PROMPT */}
      <section className="band feature-section" id="how-it-works" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container-wrapper">
          <div className="section-head">
            <h2 className="section-title-large">
              <span className="hero-tone">How it works.</span>
              Paste one command and your factory sets itself up.
            </h2>
            <p className="section-copy-large" style={{ display: 'block' }}>
              There are no complex configuration files to edit manually. The installer arms the 6 safety hooks, registers the 8 factory skills into Google Antigravity and Claude Code, and sets up your isolated worktree lane directories.
            </p>
          </div>

          <div className="setup-two-up" id="quickstart">
            <ol className="step-rows">
              <li className="step-row-item">
                <span className="step-number">01</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Run the one-line installer</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    TSGF configures .agents/ and .claude/ hooks, sets up git protections, and verifies host runtime readiness.
                  </p>
                </div>
              </li>

              <li className="step-row-item">
                <span className="step-number">02</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Launch Google Antigravity or Claude Code</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Invoke <code style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>/tsgf run</code> in your agent session. The orchestrator plans dependency waves from your board.
                  </p>
                </div>
              </li>

              <li className="step-row-item">
                <span className="step-number">03</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Autonomous worker lanes take over</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Build, QA, and Review lanes execute in isolated worktrees, run tests, capture Playwright visual proof, and auto-merge verified PRs.
                  </p>
                </div>
              </li>
            </ol>

            <div className="setup-codebox">
              <div className="codebox-header">
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Step one, in full
                </span>
                <button
                  onClick={copyInstall}
                  className="btn btn-secondary"
                  style={{ height: '26px', padding: '0 8px', fontSize: '11.5px', gap: '4px' }}
                >
                  {copied ? <Check size={12} style={{ color: 'var(--success)' }} /> : <Copy size={12} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="codebox-pre">
                <code>curl -fsSL https://raw.githubusercontent.com/gnanesh-16/TSGF/main/install.sh | bash</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* FLOW SECTION */}
      <section className="band feature-section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container-wrapper">
          <div className="section-head">
            <h2 className="section-title-large">
              <span className="hero-tone">Trigger your factory from anywhere.</span>
              It does the work in isolated lanes.
            </h2>
            <p className="section-copy-large" style={{ display: 'block' }}>
              Coding agents get stuck when left unsupervised. TSGF coordinates multi-lane waves with atomic gates: a signal files a ticket, build workers implement TDD tests, QA captures visual proof, and merge gates verify code quality before it hits main.
            </p>
          </div>

          <ol className="flow-container">
            <li className="flow-step-item">
              <p className="flow-label">
                <Smartphone size={18} />
                You signal a task or bug
              </p>
              <div className="flow-card">
                <p className="bubble-out">
                  "The checkout flow is throwing 500s on main. Can you fix it?"
                </p>
              </div>
            </li>

            <li className="flow-step-item">
              <p className="flow-label">
                <Laptop size={18} />
                TSGF orchestrates isolated lanes
              </p>
              <div className="flow-card">
                <div className="terminal-box">
                  <span>$ /tsgf wave plan</span>
                  <span data-tone="info">Wave 1: [Card #101] fix checkout error</span>
                  <span>-&gt; Allocated: .agents/worktrees/wt-101</span>
                  <span>-&gt; Running tests...</span>
                  <span data-tone="success">14 passing (TDD mode)</span>
                  <span data-tone="success">Visual proof: 1200px + 375px verified</span>
                  <span>$ tsgf-merge-gate.sh --pr 42</span>
                  <span data-tone="success">Gate passed: auto-merged to main</span>
                </div>
              </div>
            </li>

            <li className="flow-step-item">
              <p className="flow-label">
                <Smartphone size={18} />
                It delivers with verified proof
              </p>
              <div className="flow-card">
                <p className="bubble-out" style={{ color: 'var(--success)' }}>
                  "Fixed. Resolved session validation null pointer. PR #42 merged with 14 passing unit tests and verified mobile Playwright screenshot."
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* SAFEGUARDS */}
      <section className="band feature-section" id="safeguards" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container-wrapper">
          <div className="section-head">
            <h2 className="section-title-large">
              <span className="hero-tone">Agents get only what you allow.</span>
              The limits live in TSGF hooks, not in the LLM prompt.
            </h2>
            <p className="section-copy-large" style={{ display: 'block' }}>
              TSGF checks permissions, file paths, branch protections, and rate limits on every git and bash invocation. A hallucinating agent cannot talk its way past an OS-level guard hook it never controlled.
            </p>
          </div>

          <ul className="safeguards-grid">
            <li className="safeguard-item">
              <Lock size={24} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Worktree boundary enforcement</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                Workers can only write inside .agents/worktrees/ or .claude/worktrees/. Direct modification of primary repository files is blocked.
              </p>
            </li>

            <li className="safeguard-item">
              <Shield size={24} style={{ color: 'var(--success)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Protected branch shields</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                Hooks physically block git push origin main. Every change must pass through the verified merge gate script.
              </p>
            </li>

            <li className="safeguard-item">
              <RefreshCw size={24} style={{ color: 'var(--info)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>A record of every action</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                The attribution ledger records what each worker did, which worktree it executed in, and whether tests and visual checks passed.
              </p>
            </li>

            <li className="safeguard-item">
              <Terminal size={24} style={{ color: 'var(--warning)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Instant teardown &amp; revocation</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                Run tsgf-stop.sh to immediately terminate all running worker subprocesses and remove temporary worktrees cleanly.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="band closing-section">
        <div className="container-wrapper">
          <h2 className="closing-heading">
            <span className="hero-tone">Free and open source.</span>
            Launch your software factory.
          </h2>
          <div className="closing-actions">
            <div className="hero-actions">
              <a href="#quickstart" className="btn btn-primary btn-lg">
                Get started free
              </a>
              <a
                href="https://github.com/gnanesh-16/TSGF/blob/main/CLAUDE.md"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-lg"
              >
                Read the docs
              </a>
              <a
                href="./diagrams/skill-map/index.html"
                className="btn btn-secondary btn-lg"
              >
                Open Skill Map Canvas
              </a>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '12px' }}>
              No credit card or proprietary token required. MIT Licensed.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              If you are an agent, start at <a href="https://github.com/gnanesh-16/TSGF/blob/main/AGENTS.md" style={{ color: 'var(--accent)' }}>AGENTS.md</a> or read the <a href="https://github.com/gnanesh-16/TSGF/blob/main/CLAUDE.md" style={{ color: 'var(--accent)' }}>CLAUDE.md architecture guide</a>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
