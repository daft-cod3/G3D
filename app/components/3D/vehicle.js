'use client';

import { useRef, useContext, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from './controls';
import { isValidPosition, getNearestValidPosition, isInRoadBlockade } from '../../utils/geometry';
import { useVehicleRef, useVehicleSpeed, useVehicleGear, VehicleContext } from './cameraController';
import * as THREE from 'three';

export default function Vehicle({ position = [0, 0, 0], buttonControls = {} }) {
  const vehicleRef = useVehicleRef();
  const ctx = useContext(VehicleContext);
  const velocity = useRef(new THREE.Vector3());
  const rotation = useRef(0);
  const currentSpeed = useRef(0);
  const targetSpeed = useRef(0);
  const angularVelocity = useRef(0);
  const _forward = useRef(new THREE.Vector3(0,0,-1));
  const _side = useRef(new THREE.Vector3());
  const _move = useRef(new THREE.Vector3());
  const keys = useKeyboardControls(buttonControls);
  const wheelRefs = {
    frontLeft: useRef(),
    frontRight: useRef(),
    rearLeft: useRef(),
    rearRight: useRef(),
  };
  const brakeLightRef1 = useRef();
  const brakeLightRef2 = useRef();
  const headlightRef1 = useRef();
  const headlightRef2 = useRef();

  const accelHoldTime = useRef(0);

  const startPos = useRef(position.slice());

  useFrame((state, delta) => {
    try {
      if (!vehicleRef?.current) return;

    const maxSpeed = 6.5;
    const baseAccel = 4.5 + (keys.boost ? 2.5 : 0);
    const acceleration = baseAccel + Math.min(accelHoldTime.current * 0.6, 6);
    const deceleration = 5.0;
    const brakeForce = 8.0;
    const maxTurnSpeed = 3.0;
    const turnAcceleration = 5.5;
    const turnDeceleration = 7.0;
    let naturalFriction = keys.handbrake ? 0.98 : 0.96;
    if (!keys.forward && !keys.backward && !keys.brake) {
      const extra = Math.min(accelHoldTime.current * 0.02, 0.1);
      naturalFriction += extra;
    }
    const speedBasedTurning = 0.3;

    if (keys.reset) {
      vehicleRef.current.position.set(startPos.current[0], startPos.current[1], startPos.current[2]);
      currentSpeed.current = 0;
      velocity.current.set(0,0,0);
      rotation.current = 0;
      angularVelocity.current = 0;
    }

    if (keys.forward) {
      targetSpeed.current = -maxSpeed;
    } else if (keys.backward) {
      targetSpeed.current = maxSpeed;
    } else if (keys.brake) {
      targetSpeed.current = 0;
    } else {
      targetSpeed.current = 0;
    }

    if (keys.forward || keys.backward) {
      accelHoldTime.current += delta;
    }

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

    if (!keys.forward && !keys.backward && !keys.brake) {
      currentSpeed.current *= naturalFriction;
      if (Math.abs(currentSpeed.current) < 0.01) {
        currentSpeed.current = 0;
        accelHoldTime.current = 0;
      }
    }

    const speedFactor = Math.max(speedBasedTurning, 1 - Math.abs(currentSpeed.current) / maxSpeed * 0.7);
    const effectiveTurnSpeed = maxTurnSpeed * speedFactor;

    let targetAngularVel = 0;
    if (keys.left && Math.abs(currentSpeed.current) > 0.1) targetAngularVel = effectiveTurnSpeed;
    else if (keys.right && Math.abs(currentSpeed.current) > 0.1) targetAngularVel = -effectiveTurnSpeed;

    const angularDiff = targetAngularVel - angularVelocity.current;
    if (Math.abs(angularDiff) > 0.01) {
      angularVelocity.current += angularDiff * (targetAngularVel === 0 ? turnDeceleration : turnAcceleration) * delta;
    } else {
      angularVelocity.current = targetAngularVel;
    }

    rotation.current += angularVelocity.current * delta;

    _forward.current.set(0,0,-1).applyAxisAngle(new THREE.Vector3(0,1,0), rotation.current);
    _side.current.copy(_forward.current).applyAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);

    _move.current.copy(_forward.current).multiplyScalar(currentSpeed.current * delta);
    if (keys.handbrake && Math.abs(currentSpeed.current) > maxSpeed * 0.25) {
      _move.current.add(_side.current.clone().multiplyScalar(angularVelocity.current * delta * 0.7));
    }

    const newPos = vehicleRef.current.position.clone().add(_move.current);

    if (isValidPosition([newPos.x, newPos.y, newPos.z])) {
      vehicleRef.current.position.copy(newPos);
      vehicleRef.current.position.y = startPos.current[1];
    } else {
      const validPos = getNearestValidPosition([newPos.x, newPos.y, newPos.z]);
      vehicleRef.current.position.set(validPos[0], validPos[1], validPos[2]);
      currentSpeed.current *= 0.7;
      velocity.current.multiplyScalar(0.5);
    }

    if (isInRoadBlockade([vehicleRef.current.position.x, vehicleRef.current.position.y, vehicleRef.current.position.z])) {
      currentSpeed.current *= 0.2;
      angularVelocity.current *= 0.5;
    }

    const pos = vehicleRef.current.position;
    if (Math.abs(pos.x) > 100 || Math.abs(pos.z) > 100) {
      pos.x = startPos.current[0];
      pos.z = startPos.current[2];
      currentSpeed.current = 0;
      angularVelocity.current = 0;
    }

const minAllowedY = startPos.current[1] - 0.25;
      if (vehicleRef.current.position.y < minAllowedY) {
        vehicleRef.current.position.y = startPos.current[1];
      }

    vehicleRef.current.rotation.y = rotation.current;

    const tiltAmount = angularVelocity.current * 0.1;
    const speedTilt = Math.abs(currentSpeed.current) * 0.02;
    vehicleRef.current.rotation.z = THREE.MathUtils.lerp(vehicleRef.current.rotation.z, tiltAmount, 0.1);
    vehicleRef.current.rotation.x = THREE.MathUtils.lerp(vehicleRef.current.rotation.x, -speedTilt, 0.1);

    // update wheel rotation
    const wheelRadius = 0.4;
    const rollAngle = (currentSpeed.current * delta) / wheelRadius;
    Object.values(wheelRefs).forEach(ref => {
      if (ref.current) {
        ref.current.rotation.x += rollAngle;
      }
    });
    // steer front wheels
    const steerAngle = angularVelocity.current * 0.5;
    if (wheelRefs.frontLeft.current) wheelRefs.frontLeft.current.rotation.y = steerAngle;
    if (wheelRefs.frontRight.current) wheelRefs.frontRight.current.rotation.y = steerAngle;

    // brake light intensity
    const brakeIntensity = keys.brake || currentSpeed.current < -0.5 ? 1 : 0;
    if (brakeLightRef1.current && brakeLightRef1.current.material) {
      brakeLightRef1.current.material.emissiveIntensity = brakeIntensity;
    }
    if (brakeLightRef2.current && brakeLightRef2.current.material) {
      brakeLightRef2.current.material.emissiveIntensity = brakeIntensity;
    }
    // headlights toggle
    const headlightIntensity = keys.headlight ? 1 : 0.3;
    if (headlightRef1.current && headlightRef1.current.material) {
      headlightRef1.current.material.emissiveIntensity = headlightIntensity;
    }
    if (headlightRef2.current && headlightRef2.current.material) {
      headlightRef2.current.material.emissiveIntensity = headlightIntensity;
    }

    // update context telemetry
    if (ctx) {
      ctx.setSpeed(currentSpeed.current);
      // simple gear logic
      const absSp = Math.abs(currentSpeed.current);
      const newGear = absSp < maxSpeed * 0.3 ? 1 : absSp < maxSpeed * 0.6 ? 2 : 3;
      ctx.setGear(newGear);
    }
  } catch (e) {
      console.error('Vehicle update error', e);
    }
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
      <mesh ref={wheelRefs.frontLeft} position={[-0.9, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh ref={wheelRefs.frontRight} position={[0.9, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh ref={wheelRefs.rearLeft} position={[-0.9, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh ref={wheelRefs.rearRight} position={[0.9, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Windows */}
      <mesh position={[0, 1.2, 0.5]} castShadow>
        <boxGeometry args={[1.7, 0.7, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>
      
      {/* Headlights */}
      <mesh ref={headlightRef1} position={[-0.6, 0.7, 2.1]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={headlightRef2} position={[0.6, 0.7, 2.1]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
      {/* Brake lights */}
      <mesh ref={brakeLightRef1} position={[-0.6, 0.7, -2.1]}>  
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#440000" emissive="#440000" />
      </mesh>
      <mesh ref={brakeLightRef2} position={[0.6, 0.7, -2.1]}>  
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#440000" emissive="#440000" />
      </mesh>
    </group>
  );
}