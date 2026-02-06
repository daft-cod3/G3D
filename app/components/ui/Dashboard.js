'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [cameraMode, setCameraMode] = useState('follow');

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '1') setCameraMode('follow');
      if (e.key === '2') setCameraMode('first-person');
      if (e.key === '3') setCameraMode('top-down');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: 20,
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '20px',
      borderRadius: '12px',
      zIndex: 100,
      minWidth: '280px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    }}>
      <div style={{ 
        marginBottom: '15px', 
        fontWeight: 'bold', 
        fontSize: '18px',
        color: '#4CAF50',
        textAlign: 'center'
      }}>
        🚗 3D Driving Simulation
      </div>
      
      <div style={{ 
        marginBottom: '12px', 
        borderBottom: '1px solid #555', 
        paddingBottom: '10px' 
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          📹 Camera: {cameraMode.toUpperCase()}
        </div>
        <div style={{ fontSize: '12px', color: '#bbb' }}>
          Press 1/2/3 to switch views
        </div>
      </div>

      <div style={{ 
        marginBottom: '12px', 
        borderBottom: '1px solid #555', 
        paddingBottom: '10px' 
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          🎮 Keyboard Controls:
        </div>
        <div style={{ fontSize: '12px', color: '#bbb', lineHeight: '1.4' }}>
          <div>W/↑ - Forward</div>
          <div>S/↓ - Backward</div>
          <div>A/← - Turn Left</div>
          <div>D/→ - Turn Right</div>
          <div>SPACE - Brake</div>
        </div>
      </div>

      <div style={{ 
        marginBottom: '12px', 
        borderBottom: '1px solid #555', 
        paddingBottom: '10px' 
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          📱 Touch Controls:
        </div>
        <div style={{ fontSize: '12px', color: '#bbb' }}>
          Use on-screen buttons (bottom-right)
        </div>
      </div>

      <div style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
        Navigate roads & parking lots
      </div>
    </div>
  );
}