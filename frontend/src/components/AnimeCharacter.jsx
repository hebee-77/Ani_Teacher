import React, { useEffect } from 'react';

export default function AnimeCharacter({ isTalking, isThinking, onClick }) {

  // Initial wave on mount
  useEffect(() => {
    const arm = document.getElementById('armRight');
    if (arm) arm.style.animation = 'wave 3s ease-in-out 1';
  }, []);

  return (
    <div className="avatar-panel">
      <div className="avatar-stage" onClick={onClick} style={{ cursor: 'pointer' }} title={isTalking ? "Click to stop speaking" : "Click to hear explanation"}>
        <svg className="avatar-svg" id="avatarSvg" viewBox="0 0 130 220" xmlns="http://www.w3.org/2000/svg" overflow="visible">
          {/* Shadow */}
          <ellipse cx="65" cy="215" rx="38" ry="8" fill="rgba(0,0,0,0.08)" id="avatarShadow"/>
 
          {/* Body group */}
          <g className="avatar-body" id="avatarBody">
            {/* Legs */}
            <rect x="43" y="158" width="18" height="40" rx="7" fill="#2a2a28" id="legL"/>
            <rect x="69" y="158" width="18" height="40" rx="7" fill="#2a2a28" id="legR"/>
            {/* Shoes */}
            <ellipse cx="52" cy="196" rx="12" ry="6" fill="#1a1a18"/>
            <ellipse cx="78" cy="196" rx="12" ry="6" fill="#1a1a18"/>
 
            {/* Body / Blazer */}
            <rect x="33" y="95" width="64" height="70" rx="14" fill="#c9a84c"/>
            {/* Shirt */}
            <rect x="53" y="95" width="24" height="40" rx="0" fill="#f5f2ec"/>
            {/* Blazer lapels */}
            <polygon points="53,95 45,115 53,115" fill="#b8922e"/>
            <polygon points="77,95 85,115 77,115" fill="#b8922e"/>
            {/* Tie */}
            <polygon points="65,98 62,118 65,124 68,118" fill="#8a3020"/>
            {/* Pocket square */}
            <polygon points="74,104 80,104 80,110 76,108" fill="#f0d9a8"/>
            {/* Buttons */}
            <circle cx="65" cy="130" r="2" fill="#b8922e"/>
            <circle cx="65" cy="140" r="2" fill="#b8922e"/>
            <circle cx="65" cy="150" r="2" fill="#b8922e"/>
 
            {/* Left arm (closer) */}
            <g id="armLeft">
              <rect x="15" y="97" width="20" height="12" rx="6" fill="#c9a84c"/>
              {/* hand */}
              <ellipse cx="15" cy="103" rx="7" ry="7" fill="#f0d9a8"/>
            </g>
 
            {/* Right arm */}
            <g className={`avatar-arm-right ${isTalking ? 'talking' : ''}`} id="armRight" style={{ transformOrigin: isTalking ? '98px 97px' : '18px 20px' }}>
              <rect x="95" y="97" width="20" height="12" rx="6" fill="#c9a84c"/>
              {/* hand */}
              <ellipse cx="115" cy="103" rx="7" ry="7" fill="#f0d9a8"/>
              {/* pointing finger */}
              <ellipse cx="119" cy="97" rx="4" ry="7" fill="#f0d9a8" transform="rotate(-30 119 97)"/>
            </g>
          </g>
 
          {/* Head (separate for floating animation) */}
          <g className={`avatar-head ${isTalking ? 'talking' : ''}`} id="avatarHead">
            {/* Neck */}
            <rect x="57" y="88" width="16" height="14" rx="4" fill="#f0d9a8"/>
            {/* Head */}
            <ellipse cx="65" cy="65" rx="30" ry="34" fill="#f0d9a8"/>
            {/* Hair */}
            <ellipse cx="65" cy="38" rx="28" ry="14" fill="#2a1a08"/>
            <rect x="37" y="40" width="56" height="14" fill="#2a1a08"/>
            {/* Side hair */}
            <ellipse cx="38" cy="56" rx="8" ry="18" fill="#2a1a08"/>
            <ellipse cx="92" cy="56" rx="8" ry="18" fill="#2a1a08"/>
            {/* Ear */}
            <ellipse cx="36" cy="65" rx="5" ry="8" fill="#e8c890"/>
            <ellipse cx="94" cy="65" rx="5" ry="8" fill="#e8c890"/>
            {/* Glasses frame */}
            <rect x="44" y="58" width="16" height="12" rx="5" fill="none" stroke="#2a1a08" strokeWidth="2"/>
            <rect x="70" y="58" width="16" height="12" rx="5" fill="none" stroke="#2a1a08" strokeWidth="2"/>
            <line x1="60" y1="63" x2="70" y2="63" stroke="#2a1a08" strokeWidth="2"/>
            {/* Eyes (behind glasses) */}
            <circle cx="52" cy="64" r="4" fill="#fff"/>
            <circle cx="78" cy="64" r="4" fill="#fff"/>
            <circle cx="53" cy="64.5" r="2.5" fill="#2a1a08" id="eyeL"/>
            <circle cx="79" cy="64.5" r="2.5" fill="#2a1a08" id="eyeR"/>
            {/* Eye shine */}
            <circle cx="54" cy="63.5" r="0.8" fill="#fff"/>
            <circle cx="80" cy="63.5" r="0.8" fill="#fff"/>
            {/* Eyebrows */}
            <path d="M45 56 Q52 53 59 56" stroke="#2a1a08" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M71 56 Q78 53 85 56" stroke="#2a1a08" strokeWidth="2" fill="none" strokeLinecap="round"/>
            {/* Nose */}
            <ellipse cx="65" cy="72" rx="3" ry="2" fill="#e0b878"/>
            {/* Mouth */}
            <g id="mouthGroup">
              <path d="M56 81 Q65 88 74 81" stroke="#c97040" strokeWidth="2" fill="none" strokeLinecap="round" id="smile" style={{ display: isTalking ? 'none' : 'block' }}/>
              {/* Mouth open (for talking) */}
              <ellipse cx="65" cy="83" rx="7" ry="4" fill="#c97040" id="mouthOpen" className="avatar-mouth talking" style={{ display: isTalking ? 'block' : 'none' }}/>
              <ellipse cx="65" cy="82" rx="5" ry="2.5" fill="#fff" id="teeth" style={{ display: isTalking ? 'block' : 'none' }}/>
            </g>
          </g>
        </svg>
      </div>
 
      <div className="avatar-info">
        <div className="avatar-name">Prof. Ada</div>
        <div className="avatar-role">AI Learning Assistant</div>
        <div className="avatar-chips">
          <div className="avatar-chip active" title="Prof. Ada">👩‍🏫</div>
          <div className="avatar-chip" title="Prof. Max">🧑‍💻</div>
          <div className="avatar-chip" title="Prof. Zen">🧑‍🔬</div>
        </div>
        <div className="avatar-status" id="avatarStatus">
          <div className={`status-dot ${isThinking || isTalking ? 'thinking' : ''}`} id="statusDot"></div>
          <span id="statusText">{isThinking ? 'Thinking...' : isTalking ? 'Speaking...' : 'Ready to help'}</span>
        </div>
      </div>
    </div>
  );
}