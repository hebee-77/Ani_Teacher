import React, { useState } from 'react';
import Chat from './Chat';
import AnimeCharacter from './AnimeCharacter';
import { useTransition } from '../context/TransitionContext';

export default function TeacherApp() {
  const { triggerTransition } = useTransition();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [avatarTalking, setAvatarTalking] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    if (isDarkTheme) {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <div id="app" className="visible revealed">
      <div className="app-topbar">
        <button className="back-btn" onClick={(e) => triggerTransition('/', e)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <span className="topbar-center">AI Learning Assistant</span>
        <div className="topbar-actions">
          <div className="app-logo" style={{ fontSize: '16px', marginRight: '4px' }}>Cogni<span>fy</span></div>
        </div>
      </div>
     
      <div className="app-layout">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} id="sidebar">
          <div className="sidebar-header">
            <span className="sidebar-title">Menu</span>
            <button className="collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title="Toggle sidebar">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className="sidebar-nav">
            <div className="nav-item active">
              <span className="nav-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6L8 2l6 4v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg></span>
              <span className="nav-label">Home</span>
            </div>
            <div className="sidebar-section">Learn</div>
            <div className="nav-item">
              <span className="nav-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
              <span className="nav-label">History</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
              <span className="nav-label">Avatar</span>
            </div>
            <div className="sidebar-section">System</div>
            <div className="nav-item">
              <span className="nav-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
              <span className="nav-label">Settings</span>
            </div>
          </div>
          <div className="sidebar-footer">
            <div className="theme-toggle" onClick={toggleTheme}>
              <span className="nav-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3"/></svg></span>
              <span className="nav-label">Theme</span>
              <div className={`toggle-pill ${isDarkTheme ? 'on' : ''}`} id="togglePill"><div className="toggle-dot"></div></div>
            </div>
          </div>
        </div>
     
        {/* Main Panel contains Chat area */}
        <div className="main-panel">
          <Chat setAvatarTalking={setAvatarTalking} />
        </div>
     
        {/* Avatar Panel */}
        <AnimeCharacter isTalking={avatarTalking} />
      </div>
    </div>
  );
}
