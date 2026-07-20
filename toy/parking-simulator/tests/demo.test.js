import test from "node:test";
import assert from "node:assert/strict";
import { demoDuration, sampleDemo } from "../src/demo.js";
import { GUIDES, SCENARIOS, VEHICLES } from "../src/data.js";
import { corners, overlaps } from "../src/physics.js";
import { evaluateParking } from "../src/evaluator.js";

const frames = [
  { x: 0, y: 0, angle: 0, duration: 0, label: "start" },
  { x: 10, y: 4, angle: Math.PI / 2, duration: 2, label: "turn" },
  { x: 12, y: 4, angle: Math.PI, duration: 1, label: "finish" },
];

test("demoDuration sums segment durations", () => {
  assert.equal(demoDuration(frames), 3);
});

test("sampleDemo interpolates a segment and exposes its coaching label", () => {
  const sample = sampleDemo(frames, 1);
  assert.equal(sample.x, 5);
  assert.equal(sample.y, 2);
  assert.equal(sample.angle, Math.PI / 4);
  assert.equal(sample.label, "turn");
  assert.equal(sample.index, 1);
  assert.equal(sample.done, false);
});

test("sampleDemo returns the final pose after the timeline", () => {
  const sample = sampleDemo(frames, 4);
  assert.equal(sample.x, 12);
  assert.equal(sample.y, 4);
  assert.equal(Math.abs(sample.angle), Math.PI);
  assert.equal(sample.done, true);
});

test("every demonstration is collision-free for every vehicle and ends valid", () => {
  for (const scenario of SCENARIOS) {
    const frames = GUIDES[scenario.id].demo;
    const total = demoDuration(frames);
    for (const spec of VEHICLES) {
      for (let elapsed = 0; elapsed <= total; elapsed += 0.02) {
        const pose = sampleDemo(frames, elapsed);
        const rect = { ...pose, width: spec.width, length: spec.length };
        const outside = corners(rect).some(point => point.x < 0 || point.y < 0 || point.x > scenario.world.width || point.y > scenario.world.height);
        const collision = scenario.obstacles.some(obstacle => overlaps(rect, obstacle));
        assert.equal(outside || collision, false, `${scenario.id}/${spec.id} demo collides at ${elapsed.toFixed(2)}s`);
      }
      const finalPose = { ...sampleDemo(frames, total + 1), speed: 0, steer: 0, spec };
      assert.equal(evaluateParking(finalPose, scenario.target).valid, true, `${scenario.id}/${spec.id} demo must end in the target`);
    }
  }
});
