export default class CollisionDetector {
    constructor(ctx, x, y, width, height) {
        this.ctx = ctx
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = `rgba(255, 0, 0, 0.3)`
    }

    isColliding(target) {
        return (
            target.x + target.width >= this.x &&
            target.x <= this.x + this.width &&
            target.y + target.height >= this.y &&
            target.y <= this.y + this.height
        )
    }

    draw() {
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}
