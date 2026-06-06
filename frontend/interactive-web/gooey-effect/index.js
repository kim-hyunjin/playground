const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio; // 레티나 디스플레이에서도 선명하게 보이도록 하기 위해 필요

let canvasWidth;
let canvasHeight;

let particles;

// 화면 주사율과 상관없이 동일한 애니메이션 속도를 유지하기 위해 필요한 변수들
let interval = 1000 / 60; // 애니메이션 프레임 (60fps)
let now, delta;
let then = Date.now();

// svg filters
const feGaussianBlur = document.querySelector('feGaussianBlur');
const feColorMatrix = document.querySelector('feColorMatrix');

class Controls {
  constructor() {
    this.blurValue = 40;
    this.alphaChannel = 100;
    this.alphaOffset = -23;
    this.acc = 1.03;
  }

  configGUI(gui) {
    this.configGooeyEffectFolder(gui);

    this.configParticlePropertyFolder(gui);
  }

  configGooeyEffectFolder(gui) {
    const gooeyEffectFolder = gui.addFolder('Gooey Effect');
    gooeyEffectFolder.open();
    gooeyEffectFolder.add(this, 'blurValue', 0, 100).onChange((v) => {
      feGaussianBlur.setAttribute('stdDeviation', v);
    });
    gooeyEffectFolder.add(this, 'alphaChannel', 1, 200).onChange((v) => {
      feColorMatrix.setAttribute(
        'values',
        `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${v} ${this.alphaOffset}`
      );
    });
    gooeyEffectFolder.add(this, 'alphaOffset', -40, 40).onChange((v) => {
      feColorMatrix.setAttribute(
        'values',
        `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${this.alphaChannel} ${v}`
      );
    });
  }
  configParticlePropertyFolder(gui) {
    const particlePropertyFolder = gui.addFolder('Particle Property');
    particlePropertyFolder.open();
    particlePropertyFolder.add(this, 'acc', 1, 1.5, 0.01).onChange((v) => {
      particles.forEach((particle) => (particle.acc = v));
    });
  }
}

const controls = new Controls();
const gui = new dat.GUI();
controls.configGUI(gui);

class Particle {
  constructor(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.acc = 1.03;
  }

  // 아래로 떨어짐
  update() {
    this.speed *= this.acc; // 중력 흉내내기
    this.y += this.speed;
  }

  // 원 그리기
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, (Math.PI / 180) * 360);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.closePath();
  }
}

function init() {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;

  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  ctx.scale(dpr, dpr);

  canvas.style.width = canvasWidth + 'px';
  canvas.style.height = canvasHeight + 'px';

  particles = [];
  const TOTAL = canvasWidth / 10;

  for (let i = 0; i < TOTAL; i++) {
    const x = randomNumBetween(0, canvasWidth);
    const y = randomNumBetween(0, canvasHeight);
    const radius = randomNumBetween(50, 100);
    const speed = randomNumBetween(1, 5);
    const particle = new Particle(x, y, radius, speed);
    particles.push(particle);
  }
}

function animate() {
  window.requestAnimationFrame(animate);
  now = Date.now();
  delta = now - then;

  if (delta < interval) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();

    // 화면 밖으로 나가면 다시 위로 올림
    if (particle.y - particle.radius > canvasHeight) {
      particle.y = -particle.radius;
      particle.x = randomNumBetween(0, canvasWidth);
      particle.radius = randomNumBetween(50, 100);
      particle.speed = randomNumBetween(1, 5);
    }
  });

  then = now - (delta % interval);
}

function randomNumBetween(min, max) {
  return Math.random() * (max - min + 1) + min;
}

window.addEventListener('load', () => {
  init();
  animate();
});

window.addEventListener('resize', () => {
  init();
});
