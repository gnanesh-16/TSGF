import React from 'react'

export default function Footer() {
  return (
    <footer className="footer-wrap">
      <div className="container-wrapper">
        <div className="footer-grid">
          {/* Brand info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '16px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px', color: 'var(--accent)' }}>
                <path d="M8 14H4.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3" />
                <path d="M10.5 9h9a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z" />
                <path d="M8.5 12.75h13" />
              </svg>
              <span>TSGF</span>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '320px' }}>
              Give Google Antigravity, Claude Code, Codex, and Cursor an autonomous software development factory: isolated worktrees, TDD, visual QA proof, and merge gates.
            </p>
          </div>

          {/* Col 1 */}
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Factory</h4>
            <a href="#how-it-works" className="footer-nav-link">How it works</a>
            <a href="#architecture" className="footer-nav-link">Worker Lanes</a>
            <a href="#safeguards" className="footer-nav-link">Safety Hooks</a>
            <a href="./diagrams/skill-map/index.html" className="footer-nav-link">Skill Map Canvas</a>
          </div>

          {/* Col 2 */}
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">For Agents</h4>
            <a href="https://github.com/gnanesh-16/TSGF/blob/main/AGENTS.md" target="_blank" rel="noreferrer" className="footer-nav-link">AGENTS.md</a>
            <a href="https://github.com/gnanesh-16/TSGF/blob/main/CLAUDE.md" target="_blank" rel="noreferrer" className="footer-nav-link">CLAUDE.md</a>
            <a href="https://github.com/gnanesh-16/TSGF/blob/main/evals/README.md" target="_blank" rel="noreferrer" className="footer-nav-link">Evals Harness</a>
            <a href="https://github.com/gnanesh-16/TSGF/blob/main/install.sh" target="_blank" rel="noreferrer" className="footer-nav-link">Install Script</a>
          </div>

          {/* Col 3 */}
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Community</h4>
            <a href="https://github.com/gnanesh-16/TSGF" target="_blank" rel="noreferrer" className="footer-nav-link">GitHub</a>
            <a href="https://github.com/gnanesh-16/TSGF/issues" target="_blank" rel="noreferrer" className="footer-nav-link">Issues & Signals</a>
            <a href="https://github.com/gnanesh-16/TSGF/pulls" target="_blank" rel="noreferrer" className="footer-nav-link">Pull Requests</a>
            <a href="https://github.com/gnanesh-16/TSGF/releases" target="_blank" rel="noreferrer" className="footer-nav-link">Releases (v1.0.0)</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-sub">
          <span>TSGF · Autonomous Software Factory</span>
          <span>Google Antigravity Primary · One Command Setup</span>
        </div>
      </div>
    </footer>
  )
}
