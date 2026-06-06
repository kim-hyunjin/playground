import { randomNumBetween } from "./utils.js";

export default class Particle {
  constructor(canvas) {
    this.ctx = canvas.ctx;
    this.r = innerHeight / 4;
    this.angle = randomNumBetween(0, 360);

    this.rAlpha = randomNumBetween(0, 5);
    this.angleAlpha = randomNumBetween(1, 2);

    this.rFriction = randomNumBetween(0.95, 0.99);
    this.angleFriction = randomNumBetween(0.97, 0.99);

    this.opacity = randomNumBetween(0.2, 1);
  }

  update() {
    this.rAlpha *= this.rFriction;
    this.r += this.rAlpha;

    this.angleAlpha *= this.angleFriction;
    this.angle += this.angleAlpha;

    this.x = innerWidth / 2 + this.r * Math.cos((Math.PI / 180) * this.angle);
    this.y = innerHeight / 2 + this.r * Math.sin((Math.PI / 180) * this.angle);

    this.opacity -= 0.003;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    this.ctx.fill();
    this.ctx.closePath();
  }
}
