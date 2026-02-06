'use client';

import { roadLayout, createRoadGeometry } from '../../utils/geometry';
import TrafficLight from './trafficLight';
import AIVehicle from './aiVehicle';

// Enhanced road layout with 4-lane highway
const modelTownLayout = {
  roads: [
    { start: [-45, 0, 25], end: [45, 0, 25], width: 8, type: 'main' },
    { start: [-45, 0, 0], end: [45, 0, 0], width: 8, type: 'main' },
    { start: [-45, 0, -25], end: [45, 0, -25], width: 8, type: 'main' },
    { start: [-25, 0, -40], end: [-25, 0, 40], width: 8, type: 'main' },
    { start: [0, 0, -40], end: [0, 0, 40], width: 8, type: 'main' },
    { start: [25, 0, -40], end: [25, 0, 40], width: 8, type: 'main' },
    { start: [-35, 0, 12.5], end: [-35, 0, -12.5], width: 6, type: 'secondary' },
    { start: [35, 0, 12.5], end: [35, 0, -12.5], width: 6, type: 'secondary' },
    { start: [-12.5, 0, 35], end: [12.5, 0, 35], width: 6, type: 'secondary' },
    { start: [-12.5, 0, -35], end: [12.5, 0, -35], width: 6, type: 'secondary' },
  ],
  
  // 4-Lane Highway (One-way)
  highway: {
    position: [0, 0, -50],
    length: 100,
    width: 16, // 4 lanes x 4 units each
    direction: 'east', // One-way direction
  },
  
  roadBarriers: [
    { position: [-45, 1, 29], size: [90, 2, 0.5], rotation: 0 },
    { position: [-45, 1, 4], size: [90, 2, 0.5], rotation: 0 },
    { position: [-45, 1, -21], size: [90, 2, 0.5], rotation: 0 },
    { position: [-45, 1, 21], size: [90, 2, 0.5], rotation: 0 },
    { position: [-45, 1, -4], size: [90, 2, 0.5], rotation: 0 },
    { position: [-45, 1, -29], size: [90, 2, 0.5], rotation: 0 },
    { position: [-21, 1, -40], size: [0.5, 2, 80], rotation: 0 },
    { position: [4, 1, -40], size: [0.5, 2, 80], rotation: 0 },
    { position: [29, 1, -40], size: [0.5, 2, 80], rotation: 0 },
    { position: [-29, 1, -40], size: [0.5, 2, 80], rotation: 0 },
    { position: [-4, 1, -40], size: [0.5, 2, 80], rotation: 0 },
    { position: [21, 1, -40], size: [0.5, 2, 80], rotation: 0 },
    { position: [-32, 1, 12.5], size: [0.5, 2, 25], rotation: 0 },
    { position: [-38, 1, 12.5], size: [0.5, 2, 25], rotation: 0 },
    { position: [32, 1, 12.5], size: [0.5, 2, 25], rotation: 0 },
    { position: [38, 1, 12.5], size: [0.5, 2, 25], rotation: 0 },
    { position: [-12.5, 1, 32], size: [25, 2, 0.5], rotation: 0 },
    { position: [-12.5, 1, 38], size: [25, 2, 0.5], rotation: 0 },
    { position: [-12.5, 1, -32], size: [25, 2, 0.5], rotation: 0 },
    { position: [-12.5, 1, -38], size: [25, 2, 0.5], rotation: 0 },
    
    // Highway barriers
    { position: [0, 1, -42], size: [100, 2, 0.5], rotation: 0 },
    { position: [0, 1, -58], size: [100, 2, 0.5], rotation: 0 },
  ],
  
  parkingLots: [
    { position: [-35, 0, 35], size: [15, 12], rotation: 0, spaces: 24 },
    { position: [35, 0, 35], size: [15, 12], rotation: 0, spaces: 24 },
    { position: [-35, 0, -35], size: [15, 12], rotation: 0, spaces: 24 },
    { position: [35, 0, -35], size: [15, 12], rotation: 0, spaces: 24 },
    { position: [-12.5, 0, 12.5], size: [10, 10], rotation: 0, spaces: 16 },
    { position: [12.5, 0, 12.5], size: [10, 10], rotation: 0, spaces: 16 },
    { position: [-12.5, 0, -12.5], size: [10, 10], rotation: 0, spaces: 16 },
    { position: [12.5, 0, -12.5], size: [10, 10], rotation: 0, spaces: 16 },
  ],
  
  buildings: [
    // Modern office towers (downtown)
    { position: [-30, 10, 15], size: [10, 20, 10], color: '#2c3e50', type: 'office', windows: true },
    { position: [-30, 10, -15], size: [10, 20, 10], color: '#34495e', type: 'office', windows: true },
    { position: [30, 12, 15], size: [8, 24, 8], color: '#1a252f', type: 'office', windows: true },
    { position: [30, 12, -15], size: [8, 24, 8], color: '#2c3e50', type: 'office', windows: true },
    
    // Commercial buildings
    { position: [-40, 3, 30], size: [10, 6, 8], color: '#e74c3c', type: 'commercial', windows: true },
    { position: [-15, 4, 30], size: [12, 8, 8], color: '#3498db', type: 'commercial', windows: true },
    { position: [15, 4, 30], size: [12, 8, 8], color: '#9b59b6', type: 'commercial', windows: true },
    { position: [40, 3, 30], size: [10, 6, 8], color: '#e67e22', type: 'commercial', windows: true },
    
    // Residential apartments
    { position: [-40, 4, -30], size: [10, 8, 10], color: '#95a5a6', type: 'residential', windows: true },
    { position: [-15, 5, -30], size: [12, 10, 10], color: '#7f8c8d', type: 'residential', windows: true },
    { position: [15, 5, -30], size: [12, 10, 10], color: '#95a5a6', type: 'residential', windows: true },
    { position: [40, 4, -30], size: [10, 8, 10], color: '#7f8c8d', type: 'residential', windows: true },
    
    // Small shops
    { position: [-38, 2, 8], size: [5, 4, 5], color: '#f39c12', type: 'shop' },
    { position: [38, 2, 8], size: [5, 4, 5], color: '#16a085', type: 'shop' },
    { position: [-38, 2, -8], size: [5, 4, 5], color: '#d35400', type: 'shop' },
    { position: [38, 2, -8], size: [5, 4, 5], color: '#27ae60', type: 'shop' },
    
    // Corner buildings
    { position: [-12, 3, 12], size: [8, 6, 8], color: '#c0392b', type: 'mixed' },
    { position: [12, 3, 12], size: [8, 6, 8], color: '#8e44ad', type: 'mixed' },
    { position: [-12, 3, -12], size: [8, 6, 8], color: '#2980b9', type: 'mixed' },
    { position: [12, 3, -12], size: [8, 6, 8], color: '#16a085', type: 'mixed' },
  ],
  
  streetLights: [
    { position: [-42, 0, 29] }, { position: [-17, 0, 29] }, { position: [17, 0, 29] }, { position: [42, 0, 29] },
    { position: [-42, 0, 4] }, { position: [-17, 0, 4] }, { position: [17, 0, 4] }, { position: [42, 0, 4] },
    { position: [-42, 0, -21] }, { position: [-17, 0, -21] }, { position: [17, 0, -21] }, { position: [42, 0, -21] },
    { position: [29, 0, 37] }, { position: [29, 0, 17] }, { position: [29, 0, -17] }, { position: [29, 0, -37] },
    { position: [4, 0, 37] }, { position: [4, 0, 17] }, { position: [4, 0, -17] }, { position: [4, 0, -37] },
    { position: [-21, 0, 37] }, { position: [-21, 0, 17] }, { position: [-21, 0, -17] }, { position: [-21, 0, -37] },
    
    // Highway lights
    { position: [-40, 0, -50] }, { position: [-20, 0, -50] }, { position: [0, 0, -50] }, 
    { position: [20, 0, -50] }, { position: [40, 0, -50] },
  ],
  
  roadBlockades: [
    { position: [-47, 1, 25], size: [2, 2, 8], rotation: 0 },
    { position: [47, 1, 25], size: [2, 2, 8], rotation: 0 },
    { position: [-47, 1, 0], size: [2, 2, 8], rotation: 0 },
    { position: [47, 1, 0], size: [2, 2, 8], rotation: 0 },
    { position: [-47, 1, -25], size: [2, 2, 8], rotation: 0 },
    { position: [47, 1, -25], size: [2, 2, 8], rotation: 0 },
    { position: [-25, 1, 42], size: [8, 2, 2], rotation: 0 },
    { position: [-25, 1, -42], size: [8, 2, 2], rotation: 0 },
    { position: [0, 1, 42], size: [8, 2, 2], rotation: 0 },
    { position: [0, 1, -42], size: [8, 2, 2], rotation: 0 },
    { position: [25, 1, 42], size: [8, 2, 2], rotation: 0 },
    { position: [25, 1, -42], size: [8, 2, 2], rotation: 0 },
    
    // Highway end blockades
    { position: [-52, 1, -50], size: [2, 2, 16], rotation: 0 },
    { position: [52, 1, -50], size: [2, 2, 16], rotation: 0 },
  ],
  
  trees: [
    { position: [-18, 0, 18] }, { position: [18, 0, 18] },
    { position: [-18, 0, -18] }, { position: [18, 0, -18] },
    { position: [-8, 0, 38] }, { position: [8, 0, 38] },
    { position: [-8, 0, -38] }, { position: [8, 0, -38] },
  ],
};

function Highway() {
  const hw = modelTownLayout.highway;
  
  return (
    <group position={hw.position}>
      {/* Highway surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[hw.length, hw.width]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      
      {/* Lane dividers (3 white dashed lines for 4 lanes) */}
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
      
      {/* Directional arrows (one-way indicators) */}
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
      
      {/* Highway edge lines (solid yellow) */}
      <mesh position={[0, 0.01, -hw.width / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[hw.length, 0.4]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      <mesh position={[0, 0.01, hw.width / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[hw.length, 0.4]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      
      {/* Concrete barriers */}
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
  const isMain = road.type === 'main';
  
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
      {/* Main building */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={building.size} />
        <meshStandardMaterial color={building.color} roughness={0.6} metalness={0.3} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, building.size[1] / 2 + 0.3, 0]} castShadow>
        <boxGeometry args={[building.size[0] + 0.2, 0.6, building.size[2] + 0.2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      
      {/* Windows for tall buildings */}
      {hasWindows && (
        <>
          {[...Array(Math.floor(building.size[1] / 2))].map((_, floor) => (
            <group key={floor}>
              {/* Front windows */}
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
              {/* Side windows */}
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
  const aiRoutes = [
    [[45, 25], [25, 25], [25, 40], [-25, 40], [-25, 25], [-45, 25]],
    [[-45, 0], [-25, 0], [-25, -25], [25, -25], [25, 0], [45, 0]],
    [[0, 40], [0, 0], [0, -40]],
  ];
  
  return (
    <group>
      <Highway />
      
      {modelTownLayout.roads.map((road, i) => (
        <Road key={`road-${i}`} road={road} />
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