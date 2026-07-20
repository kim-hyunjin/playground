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

export const GUIDES = {
  reverse: {
    eyebrow: "REVERSE PARKING",
    headline: "빈칸을 지나친 뒤,\n후미부터 천천히 넣으세요.",
    principle: "내 차의 뒷바퀴가 주차선 모서리를 지날 때 조향을 시작하면 회전 공간을 확보하기 쉽습니다.",
    steps: [
      { number: "01", title: "한 칸 반 앞으로", instruction: "목표 칸에서 약 1.5칸 앞까지 직진하고, 옆 차량과 1m 정도 간격을 둡니다.", cue: "차체를 주차선과 나란히" },
      { number: "02", title: "후진하며 끝까지 조향", instruction: "목표 방향으로 핸들을 끝까지 돌린 채 아주 천천히 후진합니다.", cue: "안쪽 뒷바퀴를 모서리에 가깝게" },
      { number: "03", title: "차체가 평행하면 복원", instruction: "차체가 주차선과 나란해지는 순간 핸들을 중앙으로 풀고 곧게 후진합니다.", cue: "양쪽 선 간격을 번갈아 확인" },
    ],
    tips: ["속도보다 조향 타이밍이 중요해요.", "늦게 꺾었다면 무리하지 말고 앞으로 빼서 다시 맞추세요."],
    demo: [
      { x: 7, y: 13.5, angle: 0, duration: 0, label: "출발 위치 확인", control: "D · 직진" },
      { x: 14.4, y: 13.5, angle: 0, duration: 2.8, label: "목표 칸을 지나 여유 공간 확보", control: "D · 직진" },
      { x: 17.7, y: 12.1, angle: 0.72, duration: 1.7, label: "후진 진입 각도 만들기", control: "R · 우측 조향" },
      { x: 18.1, y: 7.2, angle: 1.42, duration: 2.6, label: "후미를 칸 중앙으로 유도", control: "R · 조향 유지" },
      { x: 18, y: 3.7, angle: Math.PI / 2, duration: 1.8, label: "차체가 평행하면 핸들 복원", control: "R · 중앙" },
    ],
  },
  front: {
    eyebrow: "FORWARD PARKING",
    headline: "바깥쪽으로 크게 돌아,\n정면을 먼저 맞추세요.",
    principle: "진입 전에 회전 반경을 넓게 쓰고 차의 앞머리를 주차면 중앙에 먼저 맞추면 뒷바퀴도 자연스럽게 따라옵니다.",
    steps: [
      { number: "01", title: "바깥쪽으로 붙기", instruction: "목표 칸 반대편으로 여유 있게 붙어 회전 반경을 확보합니다.", cue: "목표 칸과 2m 이상 간격" },
      { number: "02", title: "앞머리부터 진입", instruction: "내 어깨가 목표 칸 가까운 선을 지날 때 목표 방향으로 크게 조향합니다.", cue: "앞 범퍼가 중앙을 향하도록" },
      { number: "03", title: "조향을 일찍 풀기", instruction: "차체가 선과 나란해지기 직전에 핸들을 풀고 천천히 전진합니다.", cue: "후미가 선을 넘지 않는지 확인" },
    ],
    tips: ["안쪽 선만 보지 말고 바깥쪽 앞 범퍼의 궤적도 확인하세요.", "각도가 틀어졌다면 후진으로 한 번 보정하는 편이 안전해요."],
    demo: [
      { x: 6, y: 12.5, angle: 0, duration: 0, label: "통로 바깥쪽에서 출발", control: "D · 직진" },
      { x: 14.3, y: 12.5, angle: 0, duration: 3, label: "넓은 회전 반경 확보", control: "D · 직진" },
      { x: 17.1, y: 10.4, angle: -0.82, duration: 2, label: "앞머리를 주차면 중앙으로", control: "D · 좌측 조향" },
      { x: 18, y: 6.8, angle: -1.48, duration: 2, label: "차체 각도를 선과 맞추기", control: "D · 조향 복원" },
      { x: 18, y: 3.6, angle: -Math.PI / 2, duration: 1.6, label: "중앙에서 부드럽게 정지", control: "D · 중앙" },
    ],
  },
  parallel: {
    eyebrow: "PARALLEL PARKING",
    headline: "뒤차의 앞모서리를 축으로,\n두 번 나눠 꺾으세요.",
    principle: "앞차와 나란히 선 뒤 45°로 후진하고, 내 차 앞머리가 앞차를 통과하면 반대 조향으로 차체를 곧게 만듭니다.",
    steps: [
      { number: "01", title: "앞차와 나란히", instruction: "목표 칸 앞차 옆에 0.8~1m 간격으로 나란히 섭니다.", cue: "두 차량의 뒤 범퍼를 맞추기" },
      { number: "02", title: "45°로 후진", instruction: "주차면 쪽으로 끝까지 조향하며 후진해 차체를 약 45°로 만듭니다.", cue: "내 차 중심이 빈칸 입구에 도달" },
      { number: "03", title: "반대 조향으로 정렬", instruction: "핸들을 반대로 끝까지 돌려 앞머리를 넣고, 평행해지면 중앙으로 풉니다.", cue: "앞뒤 간격을 비슷하게 마무리" },
    ],
    tips: ["앞차에 너무 가까우면 앞 범퍼가 걸리고, 멀면 뒤바퀴가 선을 넘어요.", "한 번에 완벽히 넣기보다 앞뒤 간격을 짧게 보정하세요."],
    demo: [
      { x: 7, y: 10.5, angle: 0, duration: 0, label: "앞차 옆으로 이동", control: "D · 직진" },
      { x: 21.1, y: 9.2, angle: 0, duration: 4.1, label: "앞차와 나란히 정렬", control: "D · 중앙" },
      { x: 19.4, y: 6.8, angle: 0.58, duration: 2.2, label: "45°를 만들며 후진", control: "R · 좌측 조향" },
      { x: 17.5, y: 5.2, angle: 0.12, duration: 2.2, label: "반대 조향으로 앞머리 넣기", control: "R · 우측 조향" },
      { x: 18, y: 5.1, angle: 0, duration: 1.4, label: "앞뒤 간격을 맞춰 정지", control: "D · 중앙" },
    ],
  },
};
