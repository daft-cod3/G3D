'use client';

import { useState } from 'react';
import { useCameraRotation } from '../3D/cameraController';

export default function CameraRotationControls() {
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

  const buttonStyle = (active) => ({
    width: '50px',
    height: '50px',
    backgroundColor: active ? '#4CAF50' : 'rgba(255, 255, 255, 0.9)',
    border: '2px solid #333',
    borderRadius: '50%',
    fontSize: '16px',
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

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 100,
      padding: '15px',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '15px',
      alignItems: 'center',
    }}>
      <div style={{ 
        color: 'white', 
        fontSize: '12px', 
        fontWeight: 'bold',
        marginBottom: '5px',
        textAlign: 'center'
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
          width: '30px',
          height: '30px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px'
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
          width: '80px',
          fontSize: '10px',
          marginTop: '5px'
        }}
        onClick={() => setRotation({ horizontal: 0, vertical: 0 })}
      >
        Reset
      </button>
    </div>
  );
}