export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const normalizeAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));

export function createVehicle(spec, pose) {
  return { ...pose, speed: 0, steer: 0, spec };
}

export function stepVehicle(vehicle, input, dt) {
  const v = { ...vehicle };
  const steerTarget = (input.right - input.left) * v.spec.maxSteer;
  v.steer += (steerTarget - v.steer) * Math.min(1, dt * (steerTarget ? 5 : 7));
  if (input.accelerate) v.speed += v.spec.acceleration * dt;
  if (input.brake) {
    if (v.speed > 0.08) v.speed -= v.spec.brake * dt;
    else v.speed -= v.spec.acceleration * 0.72 * dt;
  }
  if (!input.accelerate && !input.brake) v.speed *= Math.max(0, 1 - dt * 1.8);
  v.speed = clamp(v.speed, -v.spec.maxReverse, v.spec.maxForward);
  if (Math.abs(v.speed) < 0.015) v.speed = 0;
  v.angle = normalizeAngle(v.angle + (v.speed / v.spec.wheelbase) * Math.tan(v.steer) * dt);
  v.x += Math.cos(v.angle) * v.speed * dt;
  v.y += Math.sin(v.angle) * v.speed * dt;
  return v;
}

export function corners(rect) {
  const halfL = rect.length / 2, halfW = rect.width / 2;
  return [[halfL, halfW], [halfL, -halfW], [-halfL, -halfW], [-halfL, halfW]].map(([x, y]) => ({
    x: rect.x + x * Math.cos(rect.angle) - y * Math.sin(rect.angle),
    y: rect.y + x * Math.sin(rect.angle) + y * Math.cos(rect.angle),
  }));
}

function axes(poly) {
  return poly.map((p, i) => { const q = poly[(i + 1) % poly.length], x = -(q.y - p.y), y = q.x - p.x, l = Math.hypot(x, y); return { x: x / l, y: y / l }; });
}
function projection(poly, axis) { const values = poly.map(p => p.x * axis.x + p.y * axis.y); return [Math.min(...values), Math.max(...values)]; }
export function overlaps(a, b) {
  const pa = corners(a), pb = corners(b);
  return [...axes(pa), ...axes(pb)].every(axis => { const [a0, a1] = projection(pa, axis), [b0, b1] = projection(pb, axis); return a1 >= b0 && b1 >= a0; });
}
