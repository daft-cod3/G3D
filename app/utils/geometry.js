// Enhanced road layout coordinates for the comprehensive model town
export const roadLayout = {
  roads: [
    // Main horizontal roads
    { start: [-45, 0, 25], end: [45, 0, 25], width: 8, type: 'main' },
    { start: [-45, 0, 0], end: [45, 0, 0], width: 8, type: 'main' },
    { start: [-45, 0, -25], end: [45, 0, -25], width: 8, type: 'main' },
    
    // Main vertical roads
    { start: [-25, 0, -40], end: [-25, 0, 40], width: 8, type: 'main' },
    { start: [0, 0, -40], end: [0, 0, 40], width: 8, type: 'main' },
    { start: [25, 0, -40], end: [25, 0, 40], width: 8, type: 'main' },
    
    // Secondary roads
    { start: [-35, 0, 12.5], end: [-35, 0, -12.5], width: 6, type: 'secondary' },
    { start: [35, 0, 12.5], end: [35, 0, -12.5], width: 6, type: 'secondary' },
    { start: [-12.5, 0, 35], end: [12.5, 0, 35], width: 6, type: 'secondary' },
    { start: [-12.5, 0, -35], end: [12.5, 0, -35], width: 6, type: 'secondary' },
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
    // Residential buildings
    { position: [-40, 2, 15], size: [8, 4, 8], color: '#8B4513', type: 'residential' },
    { position: [-40, 3, -15], size: [8, 6, 8], color: '#CD853F', type: 'residential' },
    { position: [40, 2.5, 15], size: [8, 5, 8], color: '#A0522D', type: 'residential' },
    { position: [40, 2, -15], size: [8, 4, 8], color: '#8B4513', type: 'residential' },
    
    // Commercial buildings
    { position: [-7, 4, 30], size: [12, 8, 6], color: '#4682B4', type: 'commercial' },
    { position: [7, 4, 30], size: [12, 8, 6], color: '#5F9EA0', type: 'commercial' },
    { position: [-7, 4, -30], size: [12, 8, 6], color: '#4682B4', type: 'commercial' },
    { position: [7, 4, -30], size: [12, 8, 6], color: '#5F9EA0', type: 'commercial' },
    
    // Office buildings
    { position: [-30, 6, 7], size: [6, 12, 10], color: '#708090', type: 'office' },
    { position: [30, 6, 7], size: [6, 12, 10], color: '#778899', type: 'office' },
    { position: [-30, 6, -7], size: [6, 12, 10], color: '#708090', type: 'office' },
    { position: [30, 6, -7], size: [6, 12, 10], color: '#778899', type: 'office' },
    
    // Small shops
    { position: [-20, 1.5, 20], size: [4, 3, 4], color: '#FF6347', type: 'shop' },
    { position: [20, 1.5, 20], size: [4, 3, 4], color: '#FF7F50', type: 'shop' },
    { position: [-20, 1.5, -20], size: [4, 3, 4], color: '#FF6347', type: 'shop' },
    { position: [20, 1.5, -20], size: [4, 3, 4], color: '#FF7F50', type: 'shop' },
  ],
};

export function createRoadGeometry(road) {
  const dx = road.end[0] - road.start[0];
  const dz = road.end[2] - road.start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  
  return {
    length,
    width: road.width,
    position: [
      (road.start[0] + road.end[0]) / 2,
      0,
      (road.start[2] + road.end[2]) / 2,
    ],
    rotation: angle,
  };
}

// Check if position is on a road
export function isOnRoad(position) {
  return roadLayout.roads.some(road => {
    const { start, end, width } = road;
    
    // Check if point is within road bounds
    const minX = Math.min(start[0], end[0]) - width / 2;
    const maxX = Math.max(start[0], end[0]) + width / 2;
    const minZ = Math.min(start[2], end[2]) - width / 2;
    const maxZ = Math.max(start[2], end[2]) + width / 2;
    
    return position[0] >= minX && position[0] <= maxX && 
           position[2] >= minZ && position[2] <= maxZ;
  });
}

// Check if position is in a parking lot
export function isInParkingLot(position) {
  return roadLayout.parkingLots.some(lot => {
    const halfWidth = lot.size[0] / 2;
    const halfDepth = lot.size[1] / 2;
    
    return position[0] >= lot.position[0] - halfWidth &&
           position[0] <= lot.position[0] + halfWidth &&
           position[2] >= lot.position[2] - halfDepth &&
           position[2] <= lot.position[2] + halfDepth;
  });
}

// Check if position is valid for vehicle movement
export function isValidPosition(position) {
  return isOnRoad(position) || isInParkingLot(position);
}

// Get the nearest valid position if current position is invalid
export function getNearestValidPosition(position) {
  if (isValidPosition(position)) {
    return position;
  }
  
  let nearestPos = position;
  let minDistance = Infinity;
  
  // Check all roads
  roadLayout.roads.forEach(road => {
    const roadGeom = createRoadGeometry(road);
    const dx = position[0] - roadGeom.position[0];
    const dz = position[2] - roadGeom.position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance < minDistance) {
      minDistance = distance;
      // Clamp to road bounds
      const halfWidth = road.width / 2;
      nearestPos = [
        Math.max(Math.min(roadGeom.position[0], roadGeom.position[0] + halfWidth), roadGeom.position[0] - halfWidth),
        position[1],
        Math.max(Math.min(roadGeom.position[2], roadGeom.position[2] + halfWidth), roadGeom.position[2] - halfWidth)
      ];
    }
  });
  
  return nearestPos;
}