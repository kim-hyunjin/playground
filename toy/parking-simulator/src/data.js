export const VEHICLES = [
  { id: "kei", name: "도심형 경차", label: "입문 추천", color: "#9fe870", width: 1.59, length: 3.59, wheelbase: 2.4, maxSteer: 0.63, maxForward: 4.6, maxReverse: 2.9, acceleration: 3.4, brake: 5.3 },
  { id: "compact", name: "소형 해치백", label: "쉬운 회전", color: "#f4c95d", width: 1.72, length: 3.75, wheelbase: 2.42, maxSteer: 0.61, maxForward: 4.5, maxReverse: 2.8, acceleration: 3.2, brake: 5.2 },
  { id: "sedan", name: "밸런스 세단", label: "표준", color: "#72a5ff", width: 1.84, length: 4.72, wheelbase: 2.82, maxSteer: 0.56, maxForward: 4.2, maxReverse: 2.6, acceleration: 2.8, brake: 5.0 },
  { id: "suv", name: "어반 SUV", label: "넓은 차체", color: "#df786f", width: 1.96, length: 4.88, wheelbase: 2.9, maxSteer: 0.52, maxForward: 4.0, maxReverse: 2.5, acceleration: 2.6, brake: 4.8 },
];

const parked = (x, y, angle = 0, color = "#59615d") => ({ x, y, width: 1.85, length: 4.7, angle, color, kind: "car" });
export const SCENARIOS = [
  { id: "reverse", name: "후면 주차", description: "확장형 주차면에 후진으로 진입하세요.", difficulty: "보통", world: { width: 26, height: 18 }, spawn: { x: 7, y: 13.5, angle: 0 }, target: { x: 18, y: 3.7, width: 2.6, length: 5.2, angle: Math.PI / 2 }, obstacles: [parked(15.4, 3.7, Math.PI / 2), parked(20.6, 3.7, Math.PI / 2)] },
  { id: "front", name: "전면 주차", description: "일반형 주차면에 정면으로 진입하세요.", difficulty: "쉬움", world: { width: 26, height: 18 }, spawn: { x: 6, y: 12.5, angle: 0 }, target: { x: 18, y: 3.6, width: 2.5, length: 5, angle: -Math.PI / 2 }, obstacles: [parked(15.5, 3.6, Math.PI / 2), parked(20.5, 3.6, Math.PI / 2)] },
  { id: "parallel", name: "평행 주차", description: "일반형 평행 주차면에 주차하세요.", difficulty: "어려움", world: { width: 28, height: 16 }, spawn: { x: 7, y: 10.5, angle: 0 }, target: { x: 18, y: 5.1, width: 2, length: 6, angle: 0 }, obstacles: [parked(12, 5.1, 0), parked(24, 5.1, 0)] },
];
