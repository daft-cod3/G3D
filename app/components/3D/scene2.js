'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import Vehicle from './vehicle';
import Environment from './environment';
import HUD from './hud';
import { VehicleProvider, CameraController } from './cameraController';
import * as THREE from 'three';

function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#2d5016" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 25]} receiveShadow>
        <planeGeometry args={[100, 12]} />
        <meshStandardMaterial color="#9e9e9e" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[100, 12]} />
        <meshStandardMaterial color="#9e9e9e" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -25]} receiveShadow>
        <planeGeometry args={[100, 12]} />
        <meshStandardMaterial color="#9e9e9e" roughness={0.8} />
      </mesh>
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={[2, 1, 4]} />
      <meshLambertMaterial color="#ff0000" />
    </mesh>
  );
}

function DayNight() {
  const ambientRef = useRef();
  const dirRef = useRef();
  const t = useRef(0);
  useFrame((state, delta) => {
    t.current += delta * 0.1;
    if (ambientRef.current) ambientRef.current.intensity = 0.3 + 0.2 * Math.sin(t.current);
    if (dirRef.current) {
      const c = new THREE.Color();
      c.setHSL(0.1, 0.7, 0.5 + 0.3 * Math.sin(t.current));
      dirRef.current.color.copy(c);
    }
  });
  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} />
      <directionalLight
        ref={dirRef}
        position={[20, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
    </>
  );
}

export default function Scene({ buttonControls }) {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 15, 25], fov: 60 }}
        shadows
        style={{ width: '100vw', height: '100vh' }}
        onCreated={({ gl }) => gl.setClearColor('#87ceeb')}
      >
        <VehicleProvider>
          <DayNight />
          <Ground />
          <Environment />
          <Suspense fallback={<LoadingFallback />}>
            <Vehicle position={[0, 0.5, 0]} buttonControls={buttonControls} />
          </Suspense>
          <CameraController />
        </VehicleProvider>
      </Canvas>
      <HUD />
    </div>
  );
}
