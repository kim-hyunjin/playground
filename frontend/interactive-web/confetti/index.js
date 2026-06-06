import { Canvas } from "./js/canvas.js";
import Particle from "./js/particle.js";

let canvas;
const particles = [];

function init() {
  const canvasEl = document.querySelector("canvas");
  canvas = new Canvas(canvasEl);
  canvas.init();
}

function confetti({ x, y, count, deg, colors, spread, shapes }) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(canvas, x, y, deg, spread, colors, shapes));
  }
}

function draw() {
  canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti({
    x: 0,
    y: canvas.height / 2,
    count: 2,
    deg: -50,
  });
  confetti({
    x: canvas.width,
    y: canvas.height / 2,
    count: 2,
    deg: -130,
  });

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].opacity <= 0) {
      particles.splice(i, 1);
    }
    if (particles[i].y > canvas.height) {
      particles.splice(i, 1);
    }
  }
}

function render() {
  canvas.render(draw);
}

window.addEventListener("load", () => {
  init();
  render();
});
window.addEventListener("resize", init);
window.addEventListener("click", (e) => {
  confetti({
    x: canvas.width / 2,
    y: canvas.height,
    count: 15,
    deg: 270,
  });
});
