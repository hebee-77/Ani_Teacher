import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Chat from './Chat';
import AnimeCharacter from './AnimeCharacter';
import { useTransition } from '../context/TransitionContext';

const CONV_KEY = 'cognify_conversations';
const MAX_HISTORY = 5;

function genId() {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function loadConversations() {
  try { return JSON.parse(localStorage.getItem(CONV_KEY)) || []; }
  catch { return []; }
}

function saveConversations(convs) {
  localStorage.setItem(CONV_KEY, JSON.stringify(convs));
}

export default function TeacherApp() {
  const { triggerTransition } = useTransition();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [avatarThinking, setAvatarThinking] = useState(false);
  const [avatarTalking, setAvatarTalking] = useState(false);
  const [latestAiMessage, setLatestAiMessage] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  // Context menu state
  const [ctxMenu, setCtxMenu] = useState(null); // { x, y, convId }
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef(null);

  // Conversation state
  const [conversations, setConversations] = useState(loadConversations);
  const [currentConvId, setCurrentConvId] = useState(() => genId());
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState([]);                // current chat messages

  const historyPanelRef = useRef(null);

  // ── Theme ──────────────────────────────────────────────────────────────────
  const toggleTheme = () => {
    setIsDarkTheme(v => !v);
    if (isDarkTheme) {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    }
  };

  // ── Close history panel on outside click ───────────────────────────────────
  useEffect(() => {
    if (!historyOpen) return;
    const handler = (e) => {
      if (historyPanelRef.current && !historyPanelRef.current.contains(e.target)) {
        setHistoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [historyOpen]);

  // ── Close context menu on outside click / Escape ───────────────────────────
  useEffect(() => {
    if (!ctxMenu) return;
    const onDown = () => setCtxMenu(null);
    const onKey = (e) => { if (e.key === 'Escape') setCtxMenu(null); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [ctxMenu]);

  // Auto-focus rename input
  useEffect(() => {
    if (renamingId && renameInputRef.current) renameInputRef.current.focus();
  }, [renamingId]);

  // ── Save / update a conversation in history ────────────────────────────────
  // Called by Chat whenever messages change (after each AI reply completes)
  const persistConversation = (msgs, convId) => {
    if (msgs.length === 0) return;                           // nothing to save yet
    const title = msgs.find(m => m.role === 'user')?.content?.slice(0, 60) || 'Untitled';
    const now = Date.now();

    setConversations(prev => {
      let updated;
      const existing = prev.find(c => c.id === convId);
      if (existing) {
        updated = prev.map(c =>
          c.id === convId ? { ...c, title, messages: msgs, updatedAt: now } : c
        );
      } else {
        const newConv = { id: convId, title, messages: msgs, createdAt: now, updatedAt: now };
        updated = [newConv, ...prev].slice(0, MAX_HISTORY);
      }
      saveConversations(updated);
      return updated;
    });
  };

  // ── New Chat ───────────────────────────────────────────────────────────────
  const handleNewChat = () => {
    setMessages([]);
    setCurrentConvId(genId());   // fresh id for the new conversation
    setLatestAiMessage('');
    window.speechSynthesis.cancel();
    setAvatarTalking(false);
    setHistoryOpen(false);
  };

  // ── Context menu actions ──────────────────────────────────────────────────
  const handleContextMenu = (e, convId) => {
    e.preventDefault();
    e.stopPropagation();
    setCtxMenu({ x: e.clientX, y: e.clientY, convId });
  };

  const handleDeleteConv = (convId) => {
    setCtxMenu(null);
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== convId);
      saveConversations(updated);
      return updated;
    });
    // If deleting current chat, start fresh
    if (convId === currentConvId) {
      setMessages([]);
      setCurrentConvId(genId());
    }
  };

  const handleStartRename = (conv) => {
    setCtxMenu(null);
    setRenamingId(conv.id);
    setRenameValue(conv.title);
  };

  const handleRenameConfirm = (convId) => {
    const trimmed = renameValue.trim();
    if (trimmed) {
      setConversations(prev => {
        const updated = prev.map(c =>
          c.id === convId ? { ...c, title: trimmed } : c
        );
        saveConversations(updated);
        return updated;
      });
    }
    setRenamingId(null);
    setRenameValue('');
  };

  // ── Auto-save conversation when streaming ends ───────────────────────────
  useEffect(() => {
    if (isStreaming) return;                          // still streaming
    if (messages.length < 2) return;                  // no complete exchange yet
    const last = messages[messages.length - 1];
    if (last.role !== 'ai' || !last.content) return;  // AI hasn't responded yet
    persistConversation(messages, currentConvId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming]);

  // ── Load conversation from history ─────────────────────────────────────────
  const handleHistorySelect = (conv) => {
    setMessages(conv.messages);
    setCurrentConvId(conv.id);
    setLatestAiMessage('');
    window.speechSynthesis.cancel();
    setAvatarTalking(false);
    setHistoryOpen(false);
  };

  // ── Clear all history ──────────────────────────────────────────────────────
  const handleClearHistory = () => {
    setConversations([]);
    localStorage.removeItem(CONV_KEY);
  };

  // ── Time formatting ────────────────────────────────────────────────────────
  const formatTs = (ts) => {
    const diffMins = Math.floor((Date.now() - ts) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  // ── Avatar TTS ─────────────────────────────────────────────────────────────
  const handleAvatarClick = () => {
    if (!latestAiMessage) return;
    if (avatarTalking) {
      window.speechSynthesis.cancel();
      setAvatarTalking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      latestAiMessage.replace(/[*_#`~>]/g, '')
    );
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setAvatarTalking(true);
    utterance.onend   = () => setAvatarTalking(false);
    utterance.onerror = () => setAvatarTalking(false);
    window.speechSynthesis.speak(utterance);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div id="app" className="visible revealed">
      {/* ── Topbar ── */}
      <div className="app-topbar">
        <button className="back-btn" onClick={(e) => triggerTransition('/', e)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <span className="topbar-center">AI Learning Assistant</span>
        <div className="topbar-actions">
          {/* ── New Chat button ── */}
          <button
            className="new-chat-btn"
            id="newChatBtn"
            onClick={handleNewChat}
            title="Start a new chat"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <span>New Chat</span>
          </button>
          <div className="app-logo" style={{ fontSize: '16px', marginLeft: '4px' }}>Cogni<span>fy</span></div>
        </div>
      </div>

      <div className="app-layout">
        {/* ── Sidebar ── */}
        <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} id="sidebar" ref={historyPanelRef}>
          <div className="sidebar-header">
            <span className="sidebar-title">Menu</span>
            <button className="collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title="Toggle sidebar">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          <div className="sidebar-nav">
            {/* Home */}
            <div className="nav-item active">
              <span className="nav-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6L8 2l6 4v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg></span>
              <span className="nav-label">Home</span>
            </div>

            <div className="sidebar-section">Learn</div>

            {/* History nav button */}
            <div
              className={`nav-item${historyOpen ? ' active' : ''}`}
              id="history-nav-btn"
              onClick={() => {
                if (sidebarCollapsed) setSidebarCollapsed(false);
                setHistoryOpen(o => !o);
              }}
            >
              <span className="nav-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </span>
              <span className="nav-label">History</span>
            </div>

            {/* History dropdown — full conversations */}
            <div className={`history-dropdown${historyOpen ? ' open' : ''}`} id="history-panel">
              <div className="history-dropdown-header">
                <span>Recent Chats</span>
                <button
                  className="history-clear-btn"
                  onClick={handleClearHistory}
                  title="Clear all history"
                >Clear all</button>
              </div>

              {conversations.length === 0 ? (
                <div className="history-empty">
                  <span>✦</span>
                  <p>No chats saved yet.</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`history-entry${conv.id === currentConvId ? ' active-conv' : ''}`}
                    onClick={() => renamingId !== conv.id && handleHistorySelect(conv)}
                    onContextMenu={(e) => handleContextMenu(e, conv.id)}
                    title={renamingId === conv.id ? undefined : conv.title}
                  >
                    <div className="history-entry-icon">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M10 1H2a1 1 0 00-1 1v6a1 1 0 001 1h1l1.5 2L6 8h4a1 1 0 001-1V2a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="history-entry-body">
                      {renamingId === conv.id ? (
                        <input
                          ref={renameInputRef}
                          className="history-rename-input"
                          value={renameValue}
                          onChange={e => setRenameValue(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') { e.preventDefault(); handleRenameConfirm(conv.id); }
                            if (e.key === 'Escape') { setRenamingId(null); setRenameValue(''); }
                          }}
                          onBlur={() => handleRenameConfirm(conv.id)}
                          onClick={e => e.stopPropagation()}
                        />
                      ) : (
                        <>
                          <div className="history-entry-text">{conv.title}{conv.title.length >= 60 ? '…' : ''}</div>
                          <div className="history-entry-time">
                            {conv.messages.filter(m => m.role === 'user').length} message{conv.messages.filter(m => m.role === 'user').length !== 1 ? 's' : ''} · {formatTs(conv.updatedAt)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Avatar */}
            <div className="nav-item">
              <span className="nav-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
              <span className="nav-label">Avatar</span>
            </div>

            <div className="sidebar-section">System</div>

            {/* Settings */}
            <div className="nav-item">
              <span className="nav-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
              <span className="nav-label">Settings</span>
            </div>
          </div>

          <div className="sidebar-footer">
            {/* New Chat shortcut inside sidebar */}
            <div className="sidebar-new-chat" onClick={handleNewChat} title="New chat">
              <span className="nav-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="nav-label">New Chat</span>
            </div>
            <div className="theme-toggle" onClick={toggleTheme}>
              <span className="nav-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3"/></svg></span>
              <span className="nav-label">Theme</span>
              <div className={`toggle-pill ${isDarkTheme ? 'on' : ''}`} id="togglePill"><div className="toggle-dot"></div></div>
            </div>
          </div>
        </div>

        {/* ── Main Panel ── */}
        <div className="main-panel">
          <Chat
            messages={messages}
            setMessages={setMessages}
            isStreaming={isStreaming}
            setIsStreaming={setIsStreaming}
            setAvatarThinking={setAvatarThinking}
            setLatestAiMessage={setLatestAiMessage}
          />
        </div>

        {/* ── Avatar Panel ── */}
        <AnimeCharacter
          isTalking={avatarTalking}
          isThinking={avatarThinking}
          onClick={handleAvatarClick}
        />
      </div>

      {/* ── Right-click context menu ── */}
      {ctxMenu && ReactDOM.createPortal(
        <div
          className="ctx-menu"
          style={{ top: ctxMenu.y, left: ctxMenu.x }}
          onMouseDown={e => e.stopPropagation()}
        >
          <button
            className="ctx-menu-item"
            onClick={() => {
              const conv = conversations.find(c => c.id === ctxMenu.convId);
              if (conv) handleStartRename(conv);
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            Rename
          </button>
          <div className="ctx-menu-divider" />
          <button
            className="ctx-menu-item danger"
            onClick={() => handleDeleteConv(ctxMenu.convId)}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 3.5h9M5 3.5V2h3v1.5M10.5 3.5L10 11H3L2.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
