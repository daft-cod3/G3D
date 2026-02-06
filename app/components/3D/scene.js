'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Vehicle from './vehicle';
import Environment from './environment';
import { VehicleProvider, CameraController } from './cameraController';

function Ground() {
  return (
    <>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#2d5016" roughness={0.9} />
      </mesh>
      
      {/* Sidewalks along main roads */}
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

export default function Scene({ buttonControls }) {
  return (
    <Canvas
      camera={{ position: [0, 15, 25], fov: 60 }}
      shadows
      style={{ width: '100vw', height: '100vh' }}
    >
      <VehicleProvider>
        <ambientLight intensity={0.5} />
        <directionalLight
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
        
        <Ground />
        <Environment />
        
        <Suspense fallback={<LoadingFallback />}>
          <Vehicle position={[0, 0.5, 0]} buttonControls={buttonControls} />
        </Suspense>
        
        <CameraController />
      </VehicleProvider>
    </Canvas>
  );
}