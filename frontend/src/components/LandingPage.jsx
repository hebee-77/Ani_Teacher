import React, { useEffect, useState } from 'react';
import { useTransition } from '../context/TransitionContext';

export default function LandingPage() {
  const { triggerTransition } = useTransition();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
    return () => revealObs.disconnect();
  }, []);

  const premiumScroll = (e, id) => {
    e.preventDefault();
    const target = id === 'top' ? document.body : document.getElementById(id);
    if (!target) return;
    const start = window.scrollY;
    const end = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY - 72;
    const distance = end - start;
    if (Math.abs(distance) < 2) return;
    const duration = Math.min(1400, Math.max(900, Math.abs(distance) * 0.6));
    let startTime = null;
   
    function smootherstep(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }
   
    function step(ts) {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      window.scrollTo(0, start + distance * smootherstep(p));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  const handleStartLearning = (e) => {
    triggerTransition('/app', e);
  };

  return (
    <div id="landing">
      <nav className={`nav ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="nav-logo" onClick={(e) => premiumScroll(e, 'top')} style={{ cursor: 'pointer' }}>Cogni<span>fy</span></div>
        <div className="nav-links">
          <a href="#features" onClick={(e) => premiumScroll(e, 'features')}>Features</a>
          <a href="#about" onClick={(e) => premiumScroll(e, 'about')}>About</a>
        </div>
        <button className="nav-cta" onClick={handleStartLearning}>Try It Free</button>
      </nav>
     
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-badge"><span className="badge-dot"></span> Powered by Claude AI</div>
        <h1>Learn code with your<br /><em>personal AI teacher</em></h1>
        <p className="hero-sub">An intelligent learning companion that explains complex code, answers your questions, and guides you through concepts — with a real animated avatar.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={handleStartLearning}>
            Start Learning
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="btn-ghost">Watch Demo</button>
        </div>
        <div className="hero-preview">
          <div className="preview-frame">
            <div className="preview-bar">
              <div className="pbar-dot"></div><div className="pbar-dot"></div><div className="pbar-dot"></div>
              <span style={{ fontSize: '11px', color: 'var(--text3)', marginLeft: '12px', fontFamily: 'var(--font-mono)' }}>cognify.app/learn</span>
            </div>
            <div className="preview-content">
              <div className="preview-sidebar">
                <div className="preview-nav-item active"><div className="preview-nav-icon" style={{ background: '#c9a84c', opacity: 1, borderRadius: '50%' }}></div> Home</div>
                <div className="preview-nav-item"><div className="preview-nav-icon"></div> History</div>
                <div className="preview-nav-item"><div className="preview-nav-icon"></div> Settings</div>
                <div className="preview-nav-item"><div className="preview-nav-icon"></div> Avatar</div>
              </div>
              <div className="preview-main">
                <div className="input-label" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)' }}>Your code</div>
                <div className="preview-input-area">function fibonacci(n) &#123;<br />&nbsp;&nbsp;if (n &lt;= 1) return n;<br />&nbsp;&nbsp;return fibonacci(n-1) + fibonacci(n-2);<br />&#125;</div>
                <div className="preview-output">
                  <span style={{ color: 'var(--gold)', fontSize: '10px', fontWeight: 500 }}>✦ Cognify explains</span><br />
                  This is a recursive implementation of the Fibonacci sequence. Each call breaks the problem into two smaller subproblems...
                </div>
              </div>
              <div className="preview-avatar-panel">
                <svg viewBox="0 0 80 140" width="70" height="120">
                  <ellipse cx="40" cy="135" rx="25" ry="5" fill="rgba(0,0,0,0.06)"/>
                  <rect x="22" y="65" width="36" height="55" rx="8" fill="#c9a84c" opacity="0.9"/>
                  <polygon points="40,68 37,80 40,85 43,80" fill="#8a6820"/>
                  <rect x="8" y="68" width="14" height="8" rx="4" fill="#c9a84c" opacity="0.9"/>
                  <rect x="58" y="68" width="14" height="8" rx="4" fill="#c9a84c" opacity="0.9"/>
                  <circle cx="40" cy="50" r="18" fill="#f0d9a8"/>
                  <ellipse cx="40" cy="34" rx="15" ry="7" fill="#2a1a08"/>
                  <rect x="25" y="34" width="30" height="6" rx="0" fill="#2a1a08"/>
                  <circle cx="33" cy="48" r="3" fill="#fff"/>
                  <circle cx="47" cy="48" r="3" fill="#fff"/>
                  <circle cx="34" cy="48.5" r="1.8" fill="#2a1a08"/>
                  <circle cx="48" cy="48.5" r="1.8" fill="#2a1a08"/>
                  <path d="M34 56 Q40 61 46 56" stroke="#c97040" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  <rect x="27" y="118" width="11" height="20" rx="4" fill="#3a3a3a"/>
                  <rect x="42" y="118" width="11" height="20" rx="4" fill="#3a3a3a"/>
                </svg>
                <span style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: 500 }}>Prof. Ada</span>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator" onClick={(e) => premiumScroll(e, 'features')}>
          <div className="scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>
     
      <div className="strip">
        <div className="strip-inner">
          <div className="strip-stat"><div className="strip-num">50K+</div><div className="strip-label">Learners</div></div>
          <div className="strip-stat"><div className="strip-num">1M+</div><div className="strip-label">Explanations</div></div>
          <div className="strip-stat"><div className="strip-num">40+</div><div className="strip-label">Languages</div></div>
          <div className="strip-stat"><div className="strip-num">98%</div><div className="strip-label">Satisfaction</div></div>
        </div>
      </div>
     
      <section className="features" id="features">
        <div className="section-label reveal">Capabilities</div>
        <div className="section-title reveal">Everything you need<br />to master code</div>
        <div className="features-grid reveal">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Deep AI Explanations</h3>
            <p>Powered by Claude, get clear, contextual explanations for any code — from beginner syntax to advanced algorithms.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👩‍🏫</div>
            <h3>Animated Avatar Teacher</h3>
            <p>An expressive avatar that gestures, waves, and reacts — making learning feel like a real one-on-one session.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Syntax Highlighting</h3>
            <p>Beautiful, readable code output with full syntax highlighting and markdown rendering for every response.</p>
          </div>
        </div>
      </section>
     
      <section className="cta-section" id="about">
        <h2 className="reveal">Ready to learn<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>differently?</em></h2>
        <p className="reveal">Join thousands of developers who learn faster with an AI teacher.</p>
        <button className="btn-primary reveal" onClick={handleStartLearning} style={{ margin: '0 auto', display: 'inline-flex' }}>
          Open Cognify Free
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </section>
     
      <footer>
        <div className="footer-logo">Cogni<span>fy</span></div>
        <p>© 2025 Cognify. Built with Claude AI.</p>
      </footer>
    </div>
  );
}
