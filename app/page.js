'use client';

import { useState } from 'react';
import Scene from './components/3D/scene2';
import EnhancedDashboard from './components/ui/EnhancedDashboard';
import EnhancedControlButtons from './components/ui/EnhancedControlButtons';
import EnhancedCameraRotationControls from './components/ui/EnhancedCameraRotationControls';
import LandingPage from './components/ui/LandingPage';

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [buttonControls, setButtonControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  });

  const handleStart = () => {
    setShowLanding(false);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        margin: 0, 
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <Scene buttonControls={buttonControls} />
        {!showLanding && (
          <>
            <EnhancedDashboard />
            <EnhancedControlButtons onControlChange={setButtonControls} />
            <EnhancedCameraRotationControls />
          </>
        )}
        {showLanding && <LandingPage onStart={handleStart} />}
      </div>
    </>
  );
}