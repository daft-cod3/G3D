'use client';

import { useState, useEffect, useMemo } from 'react';

export default function LandingPage({ onStart }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setFadeOut(true);
              setTimeout(() => onStart(), 500);
            }, 300);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [loading, onStart]);

  const handleStart = () => {
    setLoading(true);
  };

  const stars = useMemo(() => 
    [...Array(20)].map((_, i) => ({
      left: Math.random() * 100,
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 3,
    })), []
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.5s ease-out',
      pointerEvents: fadeOut ? 'none' : 'auto',
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        opacity: 0.1,
      }}>
        {stars.map((star, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '100px',
              background: 'white',
              left: `${star.left}%`,
              top: '-100px',
              animation: `fall ${star.duration}s linear infinite`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Logo/Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
        animation: 'fadeInDown 1s ease-out',
      }}>
        <div style={{
          fontSize: '72px',
          marginBottom: '10px',
          animation: 'bounce 2s ease-in-out infinite',
        }}>
          🚗
        </div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: 'white',
          margin: '0 0 10px 0',
          textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          letterSpacing: '2px',
        }}>
          3D DRIVING SIMULATOR
        </h1>
        <p style={{
          fontSize: '18px',
          color: 'rgba(255,255,255,0.9)',
          margin: 0,
          fontWeight: '300',
        }}>
          Experience realistic driving in a virtual town
        </p>
      </div>

      {/* Start Button or Loading */}
      {!loading ? (
        <button
          onClick={handleStart}
          style={{
            padding: '20px 60px',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            animation: 'pulse 2s ease-in-out infinite',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
          }}
        >
          START SIMULATION
        </button>
      ) : (
        <div style={{
          width: '400px',
          textAlign: 'center',
        }}>
          {/* Loading Text */}
          <div style={{
            color: 'white',
            fontSize: '20px',
            marginBottom: '20px',
            fontWeight: '500',
          }}>
            Loading Assets... {progress}%
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '10px',
              transition: 'width 0.3s ease',
              boxShadow: '0 0 20px rgba(79, 172, 254, 0.6)',
            }} />
          </div>

          {/* Loading Tips */}
          <div style={{
            marginTop: '30px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px',
            fontStyle: 'italic',
          }}>
            💡 Tip: Use WASD or Arrow keys to drive
          </div>
        </div>
      )}

      {/* Features List */}
      {!loading && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          display: 'flex',
          gap: '40px',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '14px',
          animation: 'fadeInUp 1.5s ease-out',
        }}>
          <div>✨ Realistic Physics</div>
          <div>🏙️ Detailed Town</div>
          <div>🎮 Smooth Controls</div>
          <div>📹 Multiple Cameras</div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fall {
          to {
            top: 100vh;
          }
        }
      `}</style>
    </div>
  );
}