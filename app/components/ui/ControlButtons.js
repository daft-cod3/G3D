'use client';

import { useState } from 'react';

export default function ControlButtons({ onControlChange }) {
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
    backgroundColor: active 
      ? (isBrake ? '#f44336' : '#4CAF50') 
      : 'rgba(255, 255, 255, 0.9)',
    border: '3px solid #333',
    borderRadius: '12px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: active ? 'white' : '#333',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    boxShadow: active 
      ? '0 4px 8px rgba(0, 0, 0, 0.3)' 
      : '0 2px 4px rgba(0, 0, 0, 0.2)',
    transform: active ? 'scale(0.95)' : 'scale(1)',
  });

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      zIndex: 100,
      padding: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '20px',
    }}>
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
      <div style={{ display: 'flex', gap: '15px' }}>
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