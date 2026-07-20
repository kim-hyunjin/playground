import { normalizeAngle } from "./physics.js";

export function demoDuration(keyframes) {
  return keyframes.slice(1).reduce((total, frame) => total + frame.duration, 0);
}

export function sampleDemo(keyframes, elapsed) {
  if (!keyframes.length) return null;
  if (keyframes.length === 1 || elapsed <= 0) return { ...keyframes[0], progress: 0, index: 0, done: false };

  let cursor = 0;
  for (let index = 1; index < keyframes.length; index += 1) {
    const from = keyframes[index - 1], to = keyframes[index];
    const end = cursor + to.duration;
    if (elapsed < end) {
      const linear = Math.max(0, Math.min(1, (elapsed - cursor) / to.duration));
      const progress = linear * linear * (3 - 2 * linear);
      const angleDelta = normalizeAngle(to.angle - from.angle);
      return {
        ...to,
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress,
        angle: normalizeAngle(from.angle + angleDelta * progress),
        progress: linear,
        index,
        done: false,
      };
    }
    cursor = end;
  }

  return { ...keyframes.at(-1), progress: 1, index: keyframes.length - 1, done: true };
}
