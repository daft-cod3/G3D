'use client';

import { useState, useEffect } from 'react';

export default function TrafficLight({ position, rotation = [0, 0, 0] }) {
  const [lightState, setLightState] = useState('green');
  
  useEffect(() => {
    const cycle = () => {
      setLightState('green');
      setTimeout(() => setLightState('yellow'), 8000);
      setTimeout(() => setLightState('red'), 11000);
    };
    
    cycle();
    const interval = setInterval(cycle, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[0.4, 1.2, 0.3]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, 4.9, 0.16]}>
        <circleGeometry args={[0.12]} />
        <meshStandardMaterial 
          color={lightState === 'red' ? '#ff0000' : '#440000'}
          emissive={lightState === 'red' ? '#ff0000' : '#000000'}
          emissiveIntensity={lightState === 'red' ? 1 : 0}
        />
      </mesh>
      <mesh position={[0, 4.5, 0.16]}>
        <circleGeometry args={[0.12]} />
        <meshStandardMaterial 
          color={lightState === 'yellow' ? '#ffff00' : '#444400'}
          emissive={lightState === 'yellow' ? '#ffff00' : '#000000'}
          emissiveIntensity={lightState === 'yellow' ? 1 : 0}
        />
      </mesh>
      <mesh position={[0, 4.1, 0.16]}>
        <circleGeometry args={[0.12]} />
        <meshStandardMaterial 
          color={lightState === 'green' ? '#00ff00' : '#004400'}
          emissive={lightState === 'green' ? '#00ff00' : '#000000'}
          emissiveIntensity={lightState === 'green' ? 1 : 0}
        />
      </mesh>
    </group>
  );
}
