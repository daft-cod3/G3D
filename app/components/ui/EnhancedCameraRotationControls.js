'use client';

import { useState } from 'react';
import { useCameraRotation } from '../3D/cameraController';

export default function EnhancedCameraRotationControls() {
  const { rotation, setRotation } = useCameraRotation();
  const [activeControl, setActiveControl] = useState('');

  const rotateCamera = (direction, axis) => {
    const speed = 0.05;
    const newRotation = { ...rotation };
    
    if (axis === 'horizontal') {
      newRotation.horizontal += direction * speed;
    } else if (axis === 'vertical') {
      newRotation.vertical = Math.max(-Math.PI/3, Math.min(Math.PI/3, newRotation.vertical + direction * speed));
    }
    
    setRotation(newRotation);
  };

  const handleMouseDown = (direction, axis) => {
    setActiveControl(`${axis}-${direction}`);
    const interval = setInterval(() => rotateCamera(direction, axis), 16);
    
    const handleMouseUp = () => {
      setActiveControl('');
      clearInterval(interval);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e, direction, axis) => {
    e.preventDefault();
    setActiveControl(`${axis}-${direction}`);
    const interval = setInterval(() => rotateCamera(direction, axis), 16);
    
    const handleTouchEnd = () => {
      setActiveControl('');
      clearInterval(interval);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  };

  const buttonStyle = (active) => ({
    width: '55px',
    height: '55px',
    background: active 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: active 
      ? '2px solid rgba(255, 255, 255, 0.3)'
      : '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '14px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: active ? 'white' : 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: active 
      ? '0 6px 20px rgba(0, 0, 0, 0.4)' 
      : '0 4px 12px rgba(0, 0, 0, 0.2)',
    transform: active ? 'scale(0.95)' : 'scale(1)',
  });

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 100,
      padding: '18px',
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      alignItems: 'center',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    }}>
      <div style={{ 
        color: 'white', 
        fontSize: '11px', 
        fontWeight: '600',
        marginBottom: '8px',
        textAlign: 'center',
        opacity: 0.8,
        letterSpacing: '1px',
        textTransform: 'uppercase',
      }}>
        📹 Camera View
      </div>
      
      {/* Vertical rotation - Up */}
      <button
        style={buttonStyle(activeControl === 'vertical-1')}
        onMouseDown={() => handleMouseDown(1, 'vertical')}
        onTouchStart={(e) => handleTouchStart(e, 1, 'vertical')}
      >
        ↑
      </button>
      
      {/* Horizontal rotation controls */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          style={buttonStyle(activeControl === 'horizontal-1')}
          onMouseDown={() => handleMouseDown(1, 'horizontal')}
          onTouchStart={(e) => handleTouchStart(e, 1, 'horizontal')}
        >
          ←
        </button>
        
        <div style={{
          width: '35px',
          height: '35px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          boxShadow: '0 4px 12px rgba(240, 147, 251, 0.4)',
        }}>
          🚗
        </div>
        
        <button
          style={buttonStyle(activeControl === 'horizontal--1')}
          onMouseDown={() => handleMouseDown(-1, 'horizontal')}
          onTouchStart={(e) => handleTouchStart(e, -1, 'horizontal')}
        >
          →
        </button>
      </div>
      
      {/* Vertical rotation - Down */}
      <button
        style={buttonStyle(activeControl === 'vertical--1')}
        onMouseDown={() => handleMouseDown(-1, 'vertical')}
        onTouchStart={(e) => handleTouchStart(e, -1, 'vertical')}
      >
        ↓
      </button>
      
      {/* Reset button */}
      <button
        style={{
          ...buttonStyle(false),
          width: '100px',
          fontSize: '11px',
          marginTop: '8px',
          fontWeight: '600',
          letterSpacing: '0.5px',
        }}
        onClick={() => setRotation({ horizontal: 0, vertical: 0 })}
      >
        RESET
      </button>
    </div>
  );
}