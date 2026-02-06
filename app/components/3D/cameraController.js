'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, createContext, useContext, useState } from 'react';
import * as THREE from 'three';

// Create context for vehicle position sharing
const VehicleContext = createContext();

export function VehicleProvider({ children }) {
  const vehicleRef = useRef();
  const [cameraRotation, setCameraRotation] = useState({ horizontal: 0, vertical: 0 });
  
  return (
    <VehicleContext.Provider value={{ vehicleRef, cameraRotation, setCameraRotation }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicleRef() {
  const context = useContext(VehicleContext);
  return context?.vehicleRef;
}

export function useCameraRotation() {
  const context = useContext(VehicleContext);
  return {
    rotation: context?.cameraRotation || { horizontal: 0, vertical: 0 },
    setRotation: context?.setCameraRotation || (() => {})
  };
}

export function CameraController() {
  const { camera } = useThree();
  const vehicleRef = useVehicleRef();
  const { rotation } = useCameraRotation();
  
  useFrame(() => {
    if (!vehicleRef?.current) return;
    
    const vehicle = vehicleRef.current;
    const vehiclePos = vehicle.position;
    const vehicleRot = vehicle.rotation.y;
    
    // Calculate camera position with 360-degree rotation
    const distance = 15;
    const height = 8 + Math.sin(rotation.vertical) * 5; // Vertical look
    
    // Combine vehicle rotation with user camera rotation
    const totalRotation = vehicleRot + rotation.horizontal;
    
    const cameraX = vehiclePos.x - Math.sin(totalRotation) * distance;
    const cameraY = vehiclePos.y + height;
    const cameraZ = vehiclePos.z - Math.cos(totalRotation) * distance;
    
    // Update camera position
    camera.position.set(cameraX, cameraY, cameraZ);
    
    // Look at vehicle with vertical offset
    const lookAtY = vehiclePos.y + 2 + Math.sin(rotation.vertical) * 3;
    camera.lookAt(vehiclePos.x, lookAtY, vehiclePos.z);
  });
  
  return null;
}