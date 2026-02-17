'use client';

import { useVehicleSpeed, useVehicleGear } from './cameraController';

export default function HUD() {
  const speed = useVehicleSpeed();
  const gear = useVehicleGear();

  const kmh = Math.round(Math.abs(speed) * 3.6 * 10) / 10;
  const isReversing = speed < -0.1;

  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: '#fff',
        fontSize: '16px',
        fontFamily: 'monospace',
        textShadow: '0 0 8px #000',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '15px 20px',
        borderRadius: '8px',
        border: '2px solid #0f0',
        lineHeight: '1.8'
      }}
    >
      <div>Speed: {kmh} km/h</div>
      <div>Gear: {gear}</div>
      <div>Status: {isReversing ? 'REVERSING' : kmh > 0 ? 'DRIVING' : 'IDLE'}</div>
      <div style={{ fontSize: '12px', marginTop: '10px', color: '#0f0' }}>H: Lights | R: Reset</div>
    </div>
  );
}
