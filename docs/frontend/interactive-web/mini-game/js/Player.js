import CollisionDetector from "./CollisionDetector.js";

export default class Player {
    constructor({ctx, appWidth, appHeight}) {
        this.ctx = ctx;
        this.img = document.querySelector('#bird-img')
        this.x = appWidth * 0.1
        this.y = appHeight / 2
        this.width = 130
        this.height = this.width * (this.img.height / (this.img.width / 15))

        this.counterForFrameThrottle = 0
        this.frameX = 0

        this.vy = -10;
        this.gravity = 0.3;

        this.boundingBox = new CollisionDetector(this.ctx, this.x + 60, this.y + 30, this.width - 80, this.height - 50)
    }

    jump() {
        this.vy -= 5;
    }

    update() {
        if (++this.counterForFrameThrottle % 2 === 0) {
            this.frameX = ++this.frameX % 15
        }

        this.vy += this.gravity;
        this.y += this.vy;
        this.boundingBox.y = this.y + 30
    }

    draw() {
        this.ctx.drawImage(
            this.img,
            this.img.width * (this.frameX / 15), 0, this.img.width / 15, this.img.height,
            this.x, this.y, this.width, this.height
        )
        // this.boundingBox.draw()
    }
}
