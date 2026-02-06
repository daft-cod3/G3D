'use client';

import { useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function useCameraMode() {
  const [mode, setMode] = useState('follow');

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '1') setMode('follow');
      if (e.key === '2') setMode('first-person');
      if (e.key === '3') setMode('top-down');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return mode;
}

export function MultiCamera() {
  const { camera, scene } = useThree();
  const mode = useCameraMode();
  const cameraPosition = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    const vehicle = scene.children.find(child => child.children?.length > 0 && child.position);
    if (!vehicle) return;

    const vehiclePos = vehicle.position;
    const vehicleRot = vehicle.rotation.y;
    
    // Calculate vehicle's forward direction
    const vehicleForward = new THREE.Vector3(
      Math.sin(vehicleRot),
      0,
      Math.cos(vehicleRot)
    );

    if (mode === 'follow') {
      // Third-person camera that follows vehicle direction
      const distance = 12;
      const height = 6;
      
      // Position camera behind vehicle in its local space
      const cameraOffset = vehicleForward.clone().multiplyScalar(-distance);
      cameraOffset.y = height;
      
      const targetCameraPos = new THREE.Vector3(
        vehiclePos.x + cameraOffset.x,
        vehiclePos.y + cameraOffset.y,
        vehiclePos.z + cameraOffset.z
      );
      
      // Look ahead of the vehicle
      const lookAheadDistance = 5;
      const lookAheadPos = vehicleForward.clone().multiplyScalar(lookAheadDistance);
      const targetLookAt = new THREE.Vector3(
        vehiclePos.x + lookAheadPos.x,
        vehiclePos.y + 1,
        vehiclePos.z + lookAheadPos.z
      );
      
      // Smooth camera movement
      cameraPosition.current.lerp(targetCameraPos, 0.05);
      lookAtTarget.current.lerp(targetLookAt, 0.05);
      
      camera.position.copy(cameraPosition.current);
      camera.lookAt(lookAtTarget.current);
      
    } else if (mode === 'first-person') {
      // First-person from driver seat
      const fpOffset = vehicleForward.clone().multiplyScalar(-1.5);
      fpOffset.y = 0.8;
      
      camera.position.set(
        vehiclePos.x + fpOffset.x,
        vehiclePos.y + fpOffset.y,
        vehiclePos.z + fpOffset.z
      );
      
      const lookAhead = vehicleForward.clone().multiplyScalar(10);
      camera.lookAt(
        vehiclePos.x + lookAhead.x,
        vehiclePos.y + 0.8,
        vehiclePos.z + lookAhead.z
      );
      
    } else if (mode === 'top-down') {
      // Top-down view that rotates with vehicle
      camera.position.set(vehiclePos.x, vehiclePos.y + 35, vehiclePos.z);
      camera.lookAt(vehiclePos.x, vehiclePos.y, vehiclePos.z);
      
      // Rotate camera to match vehicle orientation
      camera.rotation.z = -vehicleRot;
    }
  });

  return null;
}