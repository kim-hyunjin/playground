export class Canvas {
  constructor(canvas, width = innerWidth, height = innerHeight, fps = 60) {
    if (!canvas) throw new Error("Canvas element is required");

    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.fps = fps;
    this.interval = 1000 / this.fps;
    this.width = width;
    this.height = height;
    this.dpr = devicePixelRatio > 1 ? 2 : 1;
  }

  init(width, height) {
    this.canvasWidth = width || this.width;
    this.canvasHeight = height || this.height;

    this.canvas.width = this.canvasWidth * this.dpr;
    this.canvas.height = this.canvasHeight * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.canvas.style.width = this.canvasWidth * this.dpr + "px";
    this.canvas.style.height = this.canvasHeight * this.dpr + "px";
  }

  render(draw) {
    let now,
      delta,
      then = Date.now();

    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - then;
      if (delta < this.interval) return;
      draw();
      then = now - (delta % this.interval);
    };
    requestAnimationFrame(frame);
  }
}
