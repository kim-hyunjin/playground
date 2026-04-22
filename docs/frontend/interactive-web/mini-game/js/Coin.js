import CollisionDetector from "./CollisionDetector.js";

export default class Coin {
    constructor(ctx, x, y, vx) {
        this.ctx = ctx;
        this.img = document.querySelector('#coin-img')
        this.width = 50
        this.height = 50
        this.x = x - this.width / 2
        this.y = y - this.height / 2

        this.counterForFrameThrottle = 0
        this.frameX = 9

        this.boundingBox = new CollisionDetector(this.ctx, this.x, this.y, this.width, this.height)

        this.vx = vx
    }
    update() {
        if (++this.counterForFrameThrottle % 5 === 0) {
            this.frameX = ++this.frameX % 10
        }
        this.x += this.vx
        this.boundingBox.x = this.x
    }
    draw() {
        this.ctx.drawImage(
            this.img,
            this.img.width / 10 * this.frameX, 0, this.img.width / 10, this.img.height,
            this.x, this.y, this.width, this.height
        )
        // this.boundingBox.draw()
    }
}
