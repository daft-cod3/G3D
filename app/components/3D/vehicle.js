'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from './controls';
import { isValidPosition, getNearestValidPosition } from '../../utils/geometry';
import { useVehicleRef } from './cameraController';
import * as THREE from 'three';

export default function Vehicle({ position = [0, 0, 0], buttonControls = {} }) {
  const vehicleRef = useVehicleRef();
  const velocity = useRef(new THREE.Vector3());
  const rotation = useRef(0);
  const currentSpeed = useRef(0);
  const targetSpeed = useRef(0);
  const angularVelocity = useRef(0);
  const keys = useKeyboardControls(buttonControls);
  
  useFrame((state, delta) => {
    if (!vehicleRef?.current) return;
    
    // Enhanced physics parameters with increased speed
    const maxSpeed = 5.0;
    const acceleration = 3.5;
    const deceleration = 4.0;
    const brakeForce = 6.0;
    const maxTurnSpeed = 2.2;
    const turnAcceleration = 4.0;
    const turnDeceleration = 6.0;
    const naturalFriction = 0.96;
    const speedBasedTurning = 0.3;
    
    // Store current position
    const currentPos = vehicleRef.current.position.clone();
    
    // Determine target speed based on input
    // W/↑ = forward (positive speed), S/↓ = backward (negative speed)
    if (keys.forward) {
      targetSpeed.current = maxSpeed;
    } else if (keys.backward) {
      targetSpeed.current = -maxSpeed * 0.5;
    } else if (keys.brake) {
      targetSpeed.current = 0;
    } else {
      targetSpeed.current = 0;
    }
    
    // Smooth speed transitions
    const speedDiff = targetSpeed.current - currentSpeed.current;
    if (Math.abs(speedDiff) > 0.01) {
      if (keys.brake) {
        currentSpeed.current += speedDiff * brakeForce * delta;
      } else if (speedDiff > 0) {
        const accelRate = acceleration * (1 - Math.abs(currentSpeed.current) / maxSpeed * 0.3);
        currentSpeed.current += Math.min(speedDiff, accelRate * delta);
      } else {
        currentSpeed.current += Math.max(speedDiff, -deceleration * delta);
      }
    }
    
    // Apply natural friction when no input
    if (!keys.forward && !keys.backward && !keys.brake) {
      currentSpeed.current *= naturalFriction;
      if (Math.abs(currentSpeed.current) < 0.01) {
        currentSpeed.current = 0;
      }
    }
    
    // Speed-dependent turning
    const speedFactor = Math.max(speedBasedTurning, 1 - Math.abs(currentSpeed.current) / maxSpeed * 0.7);
    const effectiveTurnSpeed = maxTurnSpeed * speedFactor;
    
    // Smooth angular velocity for turning
    let targetAngularVel = 0;
    if (keys.left && Math.abs(currentSpeed.current) > 0.1) {
      targetAngularVel = effectiveTurnSpeed;
    } else if (keys.right && Math.abs(currentSpeed.current) > 0.1) {
      targetAngularVel = -effectiveTurnSpeed;
    }
    
    // Smooth angular acceleration/deceleration
    const angularDiff = targetAngularVel - angularVelocity.current;
    if (Math.abs(angularDiff) > 0.01) {
      if (targetAngularVel === 0) {
        angularVelocity.current += angularDiff * turnDeceleration * delta;
      } else {
        angularVelocity.current += angularDiff * turnAcceleration * delta;
      }
    } else {
      angularVelocity.current = targetAngularVel;
    }
    
    // Apply rotation
    rotation.current += angularVelocity.current * delta;
    
    // Calculate movement direction
    const direction = new THREE.Vector3();
    direction.z = -currentSpeed.current * delta;
    
    // Apply rotation to direction
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);
    
    // Update velocity with momentum
    velocity.current.lerp(direction, 0.8);
    
    // Calculate new position
    const newPos = currentPos.clone().add(velocity.current);
    
    // Check if new position is valid
    if (isValidPosition([newPos.x, newPos.y, newPos.z])) {
      vehicleRef.current.position.copy(newPos);
    } else {
      const validPos = getNearestValidPosition([newPos.x, newPos.y, newPos.z]);
      vehicleRef.current.position.set(validPos[0], validPos[1], validPos[2]);
      currentSpeed.current *= 0.7;
      velocity.current.multiplyScalar(0.5);
    }
    
    // Update rotation with smooth interpolation
    vehicleRef.current.rotation.y = rotation.current;
    
    // Subtle vehicle tilt
    const tiltAmount = angularVelocity.current * 0.1;
    const speedTilt = Math.abs(currentSpeed.current) * 0.02;
    vehicleRef.current.rotation.z = THREE.MathUtils.lerp(
      vehicleRef.current.rotation.z, 
      tiltAmount, 
      0.1
    );
    vehicleRef.current.rotation.x = THREE.MathUtils.lerp(
      vehicleRef.current.rotation.x,
      -speedTilt,
      0.1
    );
  });
  
  return (
    <group ref={vehicleRef} position={position}>
      {/* Car body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color="#c41e3a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Car roof */}
      <mesh position={[0, 1.2, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.8, 2]} />
        <meshStandardMaterial color="#c41e3a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[-0.9, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.9, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.9, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.9, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Windows */}
      <mesh position={[0, 1.2, 0.5]} castShadow>
        <boxGeometry args={[1.7, 0.7, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[-0.6, 0.7, 2.1]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.6, 0.7, 2.1]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}