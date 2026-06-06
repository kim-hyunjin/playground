import Vector from './Vector.js'

export default class Dot {
    constructor(x, y) {
        this.pos = new Vector(x, y)
        this.oldPos = new Vector(x, y)

        this.gravity = new Vector(0, 1)
        this.friction = 0.97

        this.pinned = false
        this.mass = 1

        this.lightImg = document.querySelector('#light-img')
        this.lightWidth = 15
        this.lightHeight = 15
    }

    update(mouse) {
        if (this.pinned) return

        let velocity = Vector.sub(this.pos, this.oldPos)

        this.oldPos.setXY(this.pos.x, this.pos.y)

        velocity.mul(this.friction)
        velocity.add(this.gravity)
        this.pos.add(velocity)

        this.attractToMouse(mouse)
    }

    // 마우스 위치로 빨려들어가는 효과
    attractToMouse(mouse) {
        let { x: dx, y: dy } = Vector.sub(this.pos, mouse.pos)

        this.distMouse = Math.sqrt(dx * dx + dy * dy)
        if (this.distMouse > mouse.radius + this.radius) return

        const direction = new Vector(dx / this.distMouse, dy / this.distMouse)
        let force = (mouse.radius - this.distMouse) / mouse.radius

        if (force < 0) force = 0
        if (force < 0.6) {
            this.pos.sub(direction.mul(force).mul(0.0001))
        } else {
            this.pos.setXY(mouse.pos.x, mouse.pos.y)
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(
            this.pos.x - this.radius,
            this.pos.y - this.radius,
            this.radius * 2,
            this.radius * 2
        )
    }

    drawLight(ctx) {
        ctx.drawImage(
            this.lightImg,
            this.pos.x - this.lightWidth / 2,
            this.pos.y - this.lightHeight / 2,
            this.lightWidth,
            this.lightHeight
        )
    }
}
