import {randomNumBetween} from "./utils.js";

export class Tail {
    constructor(canvas, x, vy, colorHue) {
        this.canvas = canvas;
        this.ctx = this.canvas.ctx;
        this.x = x;
        this.y = this.canvas.height;
        this.vy = vy;
        this.colorHue = colorHue;
        this.friction = 0.95
        this.opacity = 1;
        this.angle = randomNumBetween(0, 2)
    }

    update() {
        this.vy *= this.friction;
        this.opacity = -this.vy
        this.angle += 1;
        this.x += Math.cos(this.angle) * this.vy * 0.2;
        this.y += this.vy;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = `hsla(${this.colorHue}, 100%, 65%, ${this.opacity})`
        this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();
    }
}
