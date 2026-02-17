'use client';

import { roadLayout, createRoadGeometry, roadBlockades } from '../../utils/geometry';
import TrafficLight from './trafficLight';
import AIVehicle from './aiVehicle';
import * as THREE from 'three';




function generateRoadBarriers(roads, highway, roundabouts = []) {
  const bars = [];
  const makeFor = (geom, width) => {
    const halfW = width / 2 + 0.5;
    const angle = geom.rotation;
    const dx = Math.sin(angle) * halfW;
    const dz = -Math.cos(angle) * halfW;
    bars.push({ position: [geom.position[0] + dx, 1, geom.position[2] + dz], size: [geom.length, 2, 0.5], rotation: angle });
    bars.push({ position: [geom.position[0] - dx, 1, geom.position[2] - dz], size: [geom.length, 2, 0.5], rotation: angle });
  };
  roads.forEach(r => makeFor(createRoadGeometry(r), r.width));
  if (highway) {
    const hwGeom = {
      position: highway.position,
      rotation: (highway.direction === 'east' || highway.direction === 'west' ? 0 : Math.PI / 2),
      length: highway.length
    };
    makeFor(hwGeom, highway.width);
  }
  roundabouts.forEach(rb => {
    const segments = 32;
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = rb.center[0] + Math.cos(theta) * (rb.radius + rb.width/2 + 0.5);
      const z = rb.center[2] + Math.sin(theta) * (rb.radius + rb.width/2 + 0.5);
      bars.push({ position: [x, 1, z], size: [1, 2, 1], rotation: 0 });
    }
  });
  return bars;
}


function generateStreetLights(roads, highway, roundabouts = []) {
  const lights = [];
  const interval = 20;
  const addFor = (start, end, width) => {
    const dx = end[0] - start[0];
    const dz = end[2] - start[2];
    const len = Math.sqrt(dx * dx + dz * dz);
    const steps = Math.floor(len / interval);
    const angle = Math.atan2(dx, dz);
    const offsetX = Math.sin(angle) * (width / 2 + 1);
    const offsetZ = -Math.cos(angle) * (width / 2 + 1);
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        lights.push({
          position: [
            start[0] + dx * t + side * offsetX,
            0,
            start[2] + dz * t + side * offsetZ
          ]
        });
      }
    }
  };
  roads.forEach(r => addFor(r.start, r.end, r.width));
  if (highway) {
    const hw = highway;
    const half = hw.length / 2;
    const start = [hw.position[0] - half, hw.position[1], hw.position[2]];
    const end = [hw.position[0] + half, hw.position[1], hw.position[2]];
    addFor(start, end, hw.width);
  }
  roundabouts.forEach(rb => {
    const segments = 24;
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = rb.center[0] + Math.cos(theta) * (rb.radius + rb.width/2 + 1);
      const z = rb.center[2] + Math.sin(theta) * (rb.radius + rb.width/2 + 1);
      lights.push({ position: [x, 0, z] });
    }
  });
  return lights;
}

const modelTownLayout = {
  roads: roadLayout.roads,
  highway: roadLayout.highway,
  roundabouts: roadLayout.roundabouts || [],
  roadBarriers: generateRoadBarriers(roadLayout.roads, roadLayout.highway, roadLayout.roundabouts),
  parkingLots: roadLayout.parkingLots,
  buildings: roadLayout.buildings,
  streetLights: generateStreetLights(roadLayout.roads, roadLayout.highway, roadLayout.roundabouts),
  roadBlockades: roadBlockades,
  trees: [
    { position: [-18, 0, 18] }, { position: [18, 0, 18] },
    { position: [-18, 0, -18] }, { position: [18, 0, -18] },
    { position: [-8, 0, 38] }, { position: [8, 0, 38] },
    { position: [-8, 0, -38] }, { position: [8, 0, -38] },
  ],
};
    

function Highway() {
  const hw = modelTownLayout.highway;
  if (!hw) return null;
  
  return (
    <group position={hw.position}>

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[hw.length, hw.width]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      
      
      {[1, 2, 3].map((lane) => {
        const offset = -hw.width / 2 + (lane * hw.width / 4);
        return (
          <group key={lane}>
            {[...Array(10)].map((_, i) => (
              <mesh
                key={i}
                position={[-hw.length / 2 + (i * 10) + 5, 0.01, offset]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry args={[8, 0.3]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            ))}
          </group>
        );
      })}
      
      
      {[...Array(5)].map((_, i) => (
        <mesh
          key={`arrow-${i}`}
          position={[-hw.length / 2 + (i * 20) + 10, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      
      
      <mesh position={[0, 0.01, -hw.width / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[hw.length, 0.4]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      <mesh position={[0, 0.01, hw.width / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[hw.length, 0.4]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      
      
      <mesh position={[0, 0.5, -hw.width / 2 - 0.5]} castShadow>
        <boxGeometry args={[hw.length, 1, 0.5]} />
        <meshStandardMaterial color="#cccccc" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.5, hw.width / 2 + 0.5]} castShadow>
        <boxGeometry args={[hw.length, 1, 0.5]} />
        <meshStandardMaterial color="#cccccc" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Road({ road }) {
  const { length, width, position, rotation } = createRoadGeometry(road);
  const isMain = road.type === 'main' || road.type === 'oneway' || road.type === 'twoway';
  
  return (
    <group>
      <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={isMain ? "#1a1a1a" : "#2a2a2a"} roughness={0.9} />
      </mesh>
      
      <mesh position={[position[0], position[1] + 0.01, position[2]]} rotation={[-Math.PI / 2, 0, rotation]}>
        <planeGeometry args={[0.3, length]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
    </group>
  );
}

function Roundabout({ rb }) {
  return (
    <group position={rb.center}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[rb.radius - rb.width / 2, rb.radius + rb.width / 2, 64]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* optional lane markings could be added here */}
    </group>
  );
}

function InvisibleBarrier({ barrier }) {
  return (
    <mesh position={barrier.position} visible={false}>
      <boxGeometry args={barrier.size} />
    </mesh>
  );
}

function ParkingLot({ lot }) {
  const spacesPerRow = Math.floor(lot.spaces / 4);
  
  return (
    <group position={lot.position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={lot.size} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
      </mesh>
      
      {[...Array(spacesPerRow + 1)].map((_, i) => (
        <mesh
          key={`line-v-${i}`}
          position={[-lot.size[0] / 2 + (i * lot.size[0] / spacesPerRow), 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.15, lot.size[1] * 0.9]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      
      {[...Array(5)].map((_, i) => (
        <mesh
          key={`line-h-${i}`}
          position={[0, 0.01, -lot.size[1] / 2 + (i * lot.size[1] / 4)]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[lot.size[0] * 0.9, 0.15]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

function Building({ building }) {
  const hasWindows = building.windows;
  
  return (
    <group position={building.position}>
      
      <mesh castShadow receiveShadow>
        <boxGeometry args={building.size} />
        <meshStandardMaterial color={building.color} roughness={0.6} metalness={0.3} />
      </mesh>
      

      <mesh position={[0, building.size[1] / 2 + 0.3, 0]} castShadow>
        <boxGeometry args={[building.size[0] + 0.2, 0.6, building.size[2] + 0.2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      

      {hasWindows && (
        <>
          {[...Array(Math.floor(building.size[1] / 2))].map((_, floor) => (
            <group key={floor}>
              
              {[...Array(Math.floor(building.size[0] / 2))].map((_, i) => (
                <mesh
                  key={`f-${i}`}
                  position={[
                    -building.size[0] / 2 + 1 + i * 2,
                    -building.size[1] / 2 + 1 + floor * 2,
                    building.size[2] / 2 + 0.01
                  ]}
                >
                  <planeGeometry args={[0.8, 1.2]} />
                  <meshStandardMaterial 
                    color="#87ceeb" 
                    emissive="#4a90a4"
                    emissiveIntensity={0.2}
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>
              ))}

              {[...Array(Math.floor(building.size[2] / 2))].map((_, i) => (
                <mesh
                  key={`s-${i}`}
                  position={[
                    building.size[0] / 2 + 0.01,
                    -building.size[1] / 2 + 1 + floor * 2,
                    -building.size[2] / 2 + 1 + i * 2
                  ]}
                  rotation={[0, Math.PI / 2, 0]}
                >
                  <planeGeometry args={[0.8, 1.2]} />
                  <meshStandardMaterial 
                    color="#87ceeb" 
                    emissive="#4a90a4"
                    emissiveIntensity={0.2}
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>
              ))}
            </group>
          ))}
        </>
      )}
    </group>
  );
}

function StreetLight({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 6, 8]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      <mesh position={[0, 5.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.3, 0.8, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      
      <mesh position={[0, 5.2, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffff88" 
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

function RoadBlockade({ blockade }) {
  return (
    <group position={blockade.position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={blockade.size} />
        <meshStandardMaterial color="#ff4444" roughness={0.8} />
      </mesh>
      
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[blockade.size[0] + 0.1, blockade.size[1] + 0.1, blockade.size[2] + 0.1]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
      
      <mesh position={[0, blockade.size[1] / 2 + 0.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
    </group>
  );
}

function Tree({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  );
}

export default function Environment() {
  // sample AI paths updated to follow the new four‑lane one‑way and
  // three‑lane two‑way roads and to drive through the roundabout at x=30.
  const aiRoutes = [
    // east‑bound carriageway with a loop through the roundabout onto
    // the north‑south road and back
    [[-50, 5], [30, 5], [30, 0], [30, -40], [30, 0], [50, 5]],
    // west‑bound carriageway
    [[50, -5], [30, -5], [30, 0], [30, 40], [30, 0], [-50, -5]],
    // simple north–south shuttle along the three‑lane road
    [[30, 60], [30, 0], [30, -60]],
  ];
  
  return (
    <group>
      <Highway />
      
      {modelTownLayout.roads.map((road, i) => (
        <Road key={`road-${i}`} road={road} />
      ))}
      
      {modelTownLayout.roundabouts && modelTownLayout.roundabouts.map((rb, i) => (
        <Roundabout key={`round-${i}`} rb={rb} />
      ))}
      
      {modelTownLayout.roadBarriers.map((barrier, i) => (
        <InvisibleBarrier key={`barrier-${i}`} barrier={barrier} />
      ))}
      
      {modelTownLayout.parkingLots.map((lot, i) => (
        <ParkingLot key={`lot-${i}`} lot={lot} />
      ))}
      
      {modelTownLayout.buildings.map((building, i) => (
        <Building key={`building-${i}`} building={building} />
      ))}
      
      {modelTownLayout.streetLights.map((light, i) => (
        <StreetLight key={`light-${i}`} position={light.position} />
      ))}
      
      {modelTownLayout.roadBlockades.map((blockade, i) => (
        <RoadBlockade key={`blockade-${i}`} blockade={blockade} />
      ))}
      
      {modelTownLayout.trees.map((tree, i) => (
        <Tree key={`tree-${i}`} position={tree.position} />
      ))}
      
      <TrafficLight position={[-25, 0, 27]} />
      <TrafficLight position={[0, 0, 27]} />
      <TrafficLight position={[25, 0, 27]} />
      
      {aiRoutes.map((route, i) => (
        <AIVehicle 
          key={`ai-${i}`}
          position={[route[0][0], 0.5, route[0][1]]}
          color={['#3498db', '#e74c3c', '#2ecc71'][i]}
          route={route}
        />
      ))}
    </group>
  );
}