import React, { createContext, useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TransitionContext = createContext();

export const useTransition = () => useContext(TransitionContext);

export const TransitionProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [rippleState, setRippleState] = useState(''); // '' | 'expanding' | 'collapsing'
  const [logoState, setLogoState] = useState(''); // '' | 'show'
  const circleRef = useRef(null);

  const triggerTransition = (toPath, e) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (e && e.clientX && circleRef.current) {
      circleRef.current.style.left = e.clientX + 'px';
      circleRef.current.style.top = e.clientY + 'px';
    } else if (circleRef.current) {
      circleRef.current.style.left = '50%';
      circleRef.current.style.top = '50%';
    }

    if (circleRef.current) {
      const diag = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) * 2;
      circleRef.current.style.setProperty('--ripple-scale', diag);
    }

    setRippleState('');

    requestAnimationFrame(() => {
      setRippleState('expanding');
    });

    setTimeout(() => setLogoState('show'), 380);

    setTimeout(() => {
      navigate(toPath);
      window.scrollTo(0, 0);
    }, 620);

    setTimeout(() => {
      setLogoState('');
      setRippleState('collapsing');
    }, 820);

    setTimeout(() => {
      setRippleState('');
      setIsTransitioning(false);
    }, 1200);
  };

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {children}
      {/* Transition overlay */}
      <div 
        id="transition-overlay" 
        style={{ pointerEvents: isTransitioning ? 'all' : 'none' }}
      >
        <div 
          id="ripple-circle" 
          ref={circleRef}
          className={rippleState}
        ></div>
        <div className={`transition-logo ${logoState}`} id="transLogo">
          Cogni<span>fy</span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
};
