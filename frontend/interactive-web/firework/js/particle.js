export class Particle {
    constructor(canvas, x, y, vx, vy, opacity, colorHue) {
        this.canvas = canvas;
        this.ctx = this.canvas.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.opacity = opacity;
        this.gravity = 0.12;
        this.friction = 0.93;
        this.colorHue = colorHue;
        this.radius = 2;
        this.colorBrightness = 65;
    }

    update() {
        this.vy += this.gravity;

        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= 0.01;
    }

    draw() {
        this.ctx.fillStyle = `hsla(${this.colorHue}, 100%, ${this.colorBrightness}%, ${this.opacity})`
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        this.ctx.fill()
        this.ctx.closePath()
    }

}
