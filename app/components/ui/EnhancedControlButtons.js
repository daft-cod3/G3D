'use client';

import { useState } from 'react';

export default function EnhancedControlButtons({ onControlChange }) {
  const [activeControls, setActiveControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  });

  const handleControlStart = (control) => {
    const newControls = { ...activeControls, [control]: true };
    setActiveControls(newControls);
    if (onControlChange) onControlChange(newControls);
  };

  const handleControlEnd = (control) => {
    const newControls = { ...activeControls, [control]: false };
    setActiveControls(newControls);
    if (onControlChange) onControlChange(newControls);
  };

  const buttonStyle = (active, isBrake = false) => ({
    width: '70px',
    height: '70px',
    background: active 
      ? (isBrake 
        ? 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)'
        : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)')
      : 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: active 
      ? '2px solid rgba(255, 255, 255, 0.3)'
      : '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: active ? 'white' : 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: active 
      ? '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(79, 172, 254, 0.4)' 
      : '0 4px 12px rgba(0, 0, 0, 0.2)',
    transform: active ? 'scale(0.95)' : 'scale(1)',
  });

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 100,
      padding: '20px',
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    }}>
      {/* Title */}
      <div style={{
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: '8px',
        opacity: 0.8,
        letterSpacing: '1px',
        textTransform: 'uppercase',
      }}>
        Vehicle Controls
      </div>

      {/* Forward */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          style={buttonStyle(activeControls.forward)}
          onMouseDown={() => handleControlStart('forward')}
          onMouseUp={() => handleControlEnd('forward')}
          onMouseLeave={() => handleControlEnd('forward')}
          onTouchStart={(e) => {
            e.preventDefault();
            handleControlStart('forward');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleControlEnd('forward');
          }}
        >
          ↑
        </button>
      </div>
      
      {/* Left, Brake, Right */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          style={buttonStyle(activeControls.left)}
          onMouseDown={() => handleControlStart('left')}
          onMouseUp={() => handleControlEnd('left')}
          onMouseLeave={() => handleControlEnd('left')}
          onTouchStart={(e) => {
            e.preventDefault();
            handleControlStart('left');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleControlEnd('left');
          }}
        >
          ←
        </button>
        
        <button
          style={buttonStyle(activeControls.brake, true)}
          onMouseDown={() => handleControlStart('brake')}
          onMouseUp={() => handleControlEnd('brake')}
          onMouseLeave={() => handleControlEnd('brake')}
          onTouchStart={(e) => {
            e.preventDefault();
            handleControlStart('brake');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleControlEnd('brake');
          }}
        >
          ■
        </button>
        
        <button
          style={buttonStyle(activeControls.right)}
          onMouseDown={() => handleControlStart('right')}
          onMouseUp={() => handleControlEnd('right')}
          onMouseLeave={() => handleControlEnd('right')}
          onTouchStart={(e) => {
            e.preventDefault();
            handleControlStart('right');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleControlEnd('right');
          }}
        >
          →
        </button>
      </div>
      
      {/* Backward */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          style={buttonStyle(activeControls.backward)}
          onMouseDown={() => handleControlStart('backward')}
          onMouseUp={() => handleControlEnd('backward')}
          onMouseLeave={() => handleControlEnd('backward')}
          onTouchStart={(e) => {
            e.preventDefault();
            handleControlStart('backward');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleControlEnd('backward');
          }}
        >
          ↓
        </button>
      </div>
    </div>
  );
}