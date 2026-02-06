import * as CANNON from 'cannon-es';

export function createPhysicsWorld() {
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;
  return world;
}

export function createVehicleBody() {
  const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2));
  const chassisBody = new CANNON.Body({ mass: 150 });
  chassisBody.addShape(chassisShape);
  chassisBody.position.set(0, 2, 0);
  return chassisBody;
}

export function createGroundBody() {
  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  return groundBody;
}
