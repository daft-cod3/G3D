'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, createContext, useContext, useState, useEffect } from 'react';
import * as THREE from 'three';

export const VehicleContext = createContext();

export function VehicleProvider({ children }) {
  const vehicleRef = useRef();
  const [cameraRotation, setCameraRotation] = useState({ horizontal: 0, vertical: 0 });
  const [speed, setSpeed] = useState(0);
  const [gear, setGear] = useState(1);

  return (
    <VehicleContext.Provider value={{ vehicleRef, cameraRotation, setCameraRotation, speed, setSpeed, gear, setGear }}>
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

export function useVehicleSpeed() {
  const context = useContext(VehicleContext);
  return context?.speed || 0;
}

export function useVehicleGear() {
  const context = useContext(VehicleContext);
  return context?.gear || 1;
}

export function CameraController() {
  const { camera } = useThree();
  const vehicleRef = useVehicleRef();
  const { rotation, setRotation } = useCameraRotation();
  
  useEffect(() => {
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onDown = (e) => {
      dragging = true;
      lastX = e.clientX || (e.touches && e.touches[0].clientX);
      lastY = e.clientY || (e.touches && e.touches[0].clientY);
    };
    const onUp = () => { dragging = false; };
    const onMove = (e) => {
      if (!dragging) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      const dx = x - lastX;
      const dy = y - lastY;
      lastX = x;
      lastY = y;
      setRotation({
        horizontal: rotation.horizontal - dx * 0.005,
        vertical: Math.max(-Math.PI/4, Math.min(Math.PI/4, rotation.vertical - dy * 0.005))
      });
    };

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchstart', onDown);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [rotation, setRotation]);

  useFrame(() => {
    if (!vehicleRef?.current) return;
    
    const vehicle = vehicleRef.current;
    const vehiclePos = vehicle.position;
    const vehicleRot = vehicle.rotation.y;
    
    const distance = 18;
    const height = 10 + Math.sin(rotation.vertical) * 6;
    
    const totalRotation = vehicleRot + rotation.horizontal;
    
    const cameraX = vehiclePos.x - Math.sin(totalRotation) * distance;
    const cameraY = vehiclePos.y + height;
    const cameraZ = vehiclePos.z - Math.cos(totalRotation) * distance;
    
    camera.position.set(cameraX, cameraY, cameraZ);
    
    const lookAtY = vehiclePos.y + 2 + Math.sin(rotation.vertical) * 3;
    camera.lookAt(vehiclePos.x, lookAtY, vehiclePos.z);
  });
  
  return null;
}