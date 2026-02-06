'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function AIVehicle({ 
  position = [0, 0.5, 0], 
  color = '#3498db',
  route = [] 
}) {
  const groupRef = useRef();
  const speed = useRef(2.5);
  const currentWaypoint = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current || route.length === 0) return;

    const pos = groupRef.current.position;
    const target = route[currentWaypoint.current];
    
    const dx = target[0] - pos.x;
    const dz = target[1] - pos.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance < 1) {
      currentWaypoint.current = (currentWaypoint.current + 1) % route.length;
      return;
    }
    
    const dirX = dx / distance;
    const dirZ = dz / distance;
    
    pos.x += dirX * speed.current * delta;
    pos.z += dirZ * speed.current * delta;
    
    groupRef.current.rotation.y = Math.atan2(dirX, dirZ);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.8, 0.8, 3.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.8, -0.3]} castShadow>
        <boxGeometry args={[1.6, 0.7, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {[[-0.8, -0.3, 1.2], [0.8, -0.3, 1.2], [-0.8, -0.3, -1.2], [0.8, -0.3, -1.2]].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.3]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
    </group>
  );
}
