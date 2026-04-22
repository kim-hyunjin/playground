import Coin from "./Coin.js";

export default class Score {
    constructor(ctx, appWidth) {
        this.ctx = ctx;
        this.appWidth = appWidth
        this.coin = new Coin(this.ctx, this.appWidth - 50, 50, 0)

        this.distCount = 0
        this.coinCount = 0
    }
    update() {
        this.distCount += 0.015
    }
    draw() {
        this.coin.draw()

        this.ctx.fillStyle = '#f1f1f1'
        this.ctx.font = '55px Jua'
        this.ctx.textAlign = 'right'
        this.ctx.fillText(this.coinCount, this.appWidth - 90, 69)

        this.ctx.textAlign = 'left'
        this.ctx.fillText(Math.floor(this.distCount) + 'm', 25, 69)
    }
}
