import { corners, normalizeAngle } from "./physics.js";

function localPoint(point, zone) {
  const dx = point.x - zone.x, dy = point.y - zone.y;
  return { x: dx * Math.cos(zone.angle) + dy * Math.sin(zone.angle), y: -dx * Math.sin(zone.angle) + dy * Math.cos(zone.angle) };
}

export function evaluateParking(vehicle, target) {
  const rect = { ...vehicle, width: vehicle.spec.width, length: vehicle.spec.length };
  const inside = corners(rect).every(point => { const p = localPoint(point, target); return Math.abs(p.x) <= target.length / 2 && Math.abs(p.y) <= target.width / 2; });
  const direct = Math.abs(normalizeAngle(vehicle.angle - target.angle));
  const reverse = Math.abs(normalizeAngle(vehicle.angle - target.angle - Math.PI));
  const angleError = Math.min(direct, reverse);
  const stopped = Math.abs(vehicle.speed) < 0.1;
  const centered = Math.hypot(vehicle.x - target.x, vehicle.y - target.y);
  return { inside, stopped, angleError, centered, valid: inside && stopped && angleError <= Math.PI / 24 };
}

export function scoreParking(elapsed, collisions, result) {
  return Math.max(0, Math.round(1000 - elapsed * 4 - collisions * 120 - result.centered * 45 - result.angleError * 180));
}
