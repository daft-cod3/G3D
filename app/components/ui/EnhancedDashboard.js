'use client';

import { useEffect, useState } from 'react';
import { useVehicleSpeed, useVehicleGear } from '../3D/cameraController';

export default function EnhancedDashboard({ vehicleStats = {} }) {
  const [cameraMode, setCameraMode] = useState('follow');
  const contextSpeed = useVehicleSpeed();
  const contextGear = useVehicleGear();
  const [speed, setSpeed] = useState(contextSpeed);
  const [gear, setGear] = useState(contextGear);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '1') setCameraMode('Third Person');
      if (e.key === '2') setCameraMode('First Person');
      if (e.key === '3') setCameraMode('Top Down');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // sync with context values
  useEffect(() => {
    setSpeed(Math.round(Math.abs(contextSpeed) * 3.6 * 10) / 10);
  }, [contextSpeed]);

  useEffect(() => {
    setGear(contextGear.toString());
  }, [contextGear]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      zIndex: 100,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Main Dashboard Card */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '20px',
        minWidth: '320px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>
              🚗
            </div>
            <div>
              <div style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '700',
                letterSpacing: '0.5px',
              }}>
                DRIVE SIM
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '11px',
                fontWeight: '500',
              }}>
                v1.0.0
              </div>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(76, 175, 80, 0.2)',
            color: '#4CAF50',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: '600',
            border: '1px solid rgba(76, 175, 80, 0.3)',
          }}>
            ● ACTIVE
          </div>
        </div>

        {/* Speedometer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}>
          <div style={{
            position: 'relative',
            width: '140px',
            height: '140px',
          }}>
            {/* Speedometer Circle */}
            <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="12"
              />
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                strokeDasharray={`${(speed / 100) * 377} 377`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.3s ease' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4facfe" />
                  <stop offset="100%" stopColor="#00f2fe" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Speed Display */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}>
              <div style={{
                color: 'white',
                fontSize: '36px',
                fontWeight: '700',
                lineHeight: '1',
              }}>
                {speed}
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                fontWeight: '600',
                marginTop: '4px',
              }}>
                KM/H
              </div>
            </div>
          </div>
        </div>

        {/* Gear Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '20px',
        }}>
          {['P', 'R', 'N', 'D'].map((g) => (
            <div
              key={g}
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '700',
                background: gear === g 
                  ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: gear === g ? 'white' : 'rgba(255, 255, 255, 0.3)',
                border: `2px solid ${gear === g ? 'rgba(255, 255, 255, 0.3)' : 'transparent'}`,
                transition: 'all 0.3s ease',
              }}
            >
              {g}
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '15px',
        }}>
          <StatCard icon="📹" label="Camera" value={cameraMode} />
          <StatCard icon="⏱️" label="Time" value={formatTime(time)} />
          <StatCard icon="📏" label="Distance" value={`${distance.toFixed(1)} km`} />
          <StatCard icon="⚡" label="Status" value="Ready" />
        </div>

        {/* Controls Hint */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '12px',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.6)',
          lineHeight: '1.6',
        }}>
          <div style={{ fontWeight: '600', marginBottom: '6px', color: 'rgba(255, 255, 255, 0.8)' }}>
            🎮 Quick Controls
          </div>
          <div>WASD/Arrows - Drive • Space - Brake • 1/2/3 - Camera</div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '12px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '6px',
      }}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <span style={{
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {label}
        </span>
      </div>
      <div style={{
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
      }}>
        {value}
      </div>
    </div>
  );
}