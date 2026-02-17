export const roadLayout = {
  roads: [
    { start: [-60, 0, 5], end: [60, 0, 5], width: 8, type: 'oneway', direction: 'east' },
    { start: [-60, 0, -5], end: [60, 0, -5], width: 8, type: 'oneway', direction: 'west' },
    
    { start: [30, 0, -60], end: [30, 0, 60], width: 12, type: 'twoway' },
  ],

  highway: null,

  roundabouts: [
    { center: [30, 0, 0], radius: 12, width: 16 }
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
    { position: [-40, 2, 15], size: [8, 4, 8], color: '#8B4513', type: 'residential' },
    { position: [-40, 3, -15], size: [8, 6, 8], color: '#CD853F', type: 'residential' },
    { position: [40, 2.5, 15], size: [8, 5, 8], color: '#A0522D', type: 'residential' },
    { position: [40, 2, -15], size: [8, 4, 8], color: '#8B4513', type: 'residential' },
    
    { position: [-7, 4, 30], size: [12, 8, 6], color: '#4682B4', type: 'commercial' },
    { position: [7, 4, 30], size: [12, 8, 6], color: '#5F9EA0', type: 'commercial' },
    { position: [-7, 4, -30], size: [12, 8, 6], color: '#4682B4', type: 'commercial' },
    { position: [7, 4, -30], size: [12, 8, 6], color: '#5F9EA0', type: 'commercial' },
    
    { position: [-30, 6, 7], size: [6, 12, 10], color: '#708090', type: 'office' },
    { position: [30, 6, 7], size: [6, 12, 10], color: '#778899', type: 'office' },
    { position: [-30, 6, -7], size: [6, 12, 10], color: '#708090', type: 'office' },
    { position: [30, 6, -7], size: [6, 12, 10], color: '#778899', type: 'office' },
    
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

export function isOnRoad(position) {
  return roadLayout.roads.some(road => {
    const { start, end, width } = road;
    
    const minX = Math.min(start[0], end[0]) - width / 2;
    const maxX = Math.max(start[0], end[0]) + width / 2;
    const minZ = Math.min(start[2], end[2]) - width / 2;
    const maxZ = Math.max(start[2], end[2]) + width / 2;
    
    return position[0] >= minX && position[0] <= maxX && 
           position[2] >= minZ && position[2] <= maxZ;
  }) || isOnHighway(position);
}

export function isOnHighway(position) {
  const hw = roadLayout.highway;
  if (!hw) return false;
  const halfLen = hw.length / 2;
  const halfW = hw.width / 2;

  const localX = position[0] - hw.position[0];
  const localZ = position[2] - hw.position[2];

  if (hw.direction === 'east' || hw.direction === 'west') {
    return localX >= -halfLen && localX <= halfLen && Math.abs(localZ) <= halfW;
  } else {
    return localZ >= -halfLen && localZ <= halfLen && Math.abs(localX) <= halfW;
  }
}

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


export function isOnRoundabout(position) {
  return (roadLayout.roundabouts || []).some(rb => {
    const dx = position[0] - rb.center[0];
    const dz = position[2] - rb.center[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    const inner = rb.radius - rb.width / 2;
    const outer = rb.radius + rb.width / 2;
    return dist >= inner && dist <= outer;
  });
}

export function isValidPosition(position) {
  return isOnRoad(position) || isInParkingLot(position) || isOnHighway(position) || isOnRoundabout(position);
}

export function getNearestValidPosition(position) {
  if (isValidPosition(position)) {
    return position;
  }

  let nearestPos = position;
  let minDistance = Infinity;

  const projectOntoRoad = (start, end, width) => {
    const vx = end[0] - start[0];
    const vz = end[2] - start[2];
    const lenSq = vx * vx + vz * vz;
    if (lenSq === 0) return null;

    const px = position[0] - start[0];
    const pz = position[2] - start[2];

    let t = (px * vx + pz * vz) / lenSq;
    if (t < 0) t = 0;
    if (t > 1) t = 1;

    const cx = start[0] + vx * t;
    const cz = start[2] + vz * t;

    let dx = position[0] - cx;
    let dz = position[2] - cz;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const halfW = width / 2;
    if (dist > halfW && dist > 0) {
      const scale = halfW / dist;
      dx *= scale;
      dz *= scale;
    }

    const candidate = [cx + dx, position[1], cz + dz];
    const cd = Math.sqrt((candidate[0] - position[0]) ** 2 + (candidate[2] - position[2]) ** 2);
    if (cd < minDistance) {
      minDistance = cd;
      nearestPos = candidate;
    }
  };

  roadLayout.roads.forEach(road => {
    projectOntoRoad(road.start, road.end, road.width);
  });

  if (roadLayout.highway) {
    const hw = roadLayout.highway;
    const start = [hw.position[0] - hw.length/2, hw.position[1], hw.position[2]];
    const end = [hw.position[0] + hw.length/2, hw.position[1], hw.position[2]];
    projectOntoRoad(start, end, hw.width);
  }

  (roadLayout.roundabouts || []).forEach(rb => {
    const dx = position[0] - rb.center[0];
    const dz = position[2] - rb.center[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    const inner = rb.radius - rb.width / 2;
    const outer = rb.radius + rb.width / 2;
    if (dist < minDistance) {
      minDistance = dist;
      const angle = Math.atan2(dz, dx);
      const targetDist = Math.max(inner, Math.min(outer, dist));
      nearestPos = [
        rb.center[0] + Math.cos(angle) * targetDist,
        position[1],
        rb.center[2] + Math.sin(angle) * targetDist
      ];
    }
  });

  return nearestPos;
}

export const roadBlockades = [
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
];

export function isInRoadBlockade(position) {
  return roadBlockades.some(b => {
    const halfX = b.size[0] / 2;
    const halfZ = b.size[2] / 2;
    return (
      position[0] >= b.position[0] - halfX &&
      position[0] <= b.position[0] + halfX &&
      position[2] >= b.position[2] - halfZ &&
      position[2] <= b.position[2] + halfZ
    );
  });
}