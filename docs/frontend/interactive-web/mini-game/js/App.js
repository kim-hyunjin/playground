import Background from "./Background.js";
import Wall from "./Wall.js";
import Player from "./Player.js";
import Coin from "./Coin.js";
import Score from "./Score.js";
import GameHandler from "./GameHandler.js";

export default class App {
  static canvas = document.querySelector("canvas");
  static ctx = App.canvas.getContext("2d");
  static dpr = window.devicePixelRatio || 1;
  static fps = 60;
  static interval = 1000 / App.fps;
  static width = 1024;
  static height = 768;

  constructor() {
    this.backgrounds = [
      new Background({
        ctx: App.ctx,
        height: App.height,
        img: document.querySelector("#bg3-img"),
        speed: -1,
      }),
      new Background({
        ctx: App.ctx,
        height: App.height,
        img: document.querySelector("#bg2-img"),
        speed: -2,
      }),
      new Background({
        ctx: App.ctx,
        height: App.height,
        img: document.querySelector("#bg1-img"),
        speed: -4,
      }),
    ];
    this.gameHandler = new GameHandler(this);

    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener("click", () => {
      this.player.jump();
    });
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.player.jump();
      }
    });

    this.reset();
  }

  reset() {
    this.walls = [
      new Wall({
        ctx: App.ctx,
        type: "SMALL",
        appWidth: App.width,
        appHeight: App.height,
      }),
    ];
    this.player = new Player({
      ctx: App.ctx,
      appWidth: App.width,
      appHeight: App.height,
    });
    this.coins = [];
    this.score = new Score(App.ctx, App.width);
  }

  resize() {
    App.canvas.width = App.width * App.dpr;
    App.canvas.height = App.height * App.dpr;
    App.ctx.scale(App.dpr, App.dpr);

    const isPortrait = window.innerHeight > window.innerWidth;
    const width = isPortrait
      ? window.innerWidth * 0.9
      : window.innerHeight * 0.9;
    App.canvas.style.width = `${width}px`;
    App.canvas.style.height = `${width * (3 / 4)}px`;
  }

  render() {
    let now, delta;
    let then = Date.now();
    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - then;

      if (delta < App.interval) return;
      if (this.gameHandler.status !== "PLAYING") return;

      then = now - (delta % App.interval);
      App.ctx.clearRect(0, 0, App.width, App.height);

      this.manageBackground();
      this.manageWall();
      this.managePlayer();
      this.manageCoin();
      this.manageScore();
    };
    frame();
  }

  manageBackground() {
    this.backgrounds.forEach((background) => {
      background.update();
      background.draw();
    });
  }

  manageWall() {
    for (let i = this.walls.length - 1; i >= 0; i--) {
      this.walls[i].update();
      this.walls[i].draw();

      if (this.walls[i].isOutside) {
        this.walls.splice(i, 1);
        continue;
      }

      if (this.walls[i].canGenerateNext) {
        this.walls[i].generatedNext = true;
        const newWall = new Wall({
          ctx: App.ctx,
          type: Math.random() > 0.3 ? "SMALL" : "BIG",
          appWidth: App.width,
          appHeight: App.height,
        });
        this.walls.push(newWall);

        // 새로운 벽에 코인 랜덤 생성
        if (Math.random() < 1) {
          const x = newWall.x + newWall.width / 2;
          const y = newWall.lowerWallY - newWall.gapY / 2;
          this.coins.push(new Coin(App.ctx, x, y, newWall.vx));
        }
      }

      // 벽과 플레이어 충돌관련
      if (this.walls[i].isColliding(this.player.boundingBox)) {
        this.gameHandler.status = "FINISHED";
      }
    }
  }

  managePlayer() {
    this.player.update();
    this.player.draw();

    if (this.player.y > App.height || this.player.y + this.player.height < 0) {
      this.gameHandler.status = "FINISHED";
    }
  }

  manageCoin() {
    for (let i = this.coins.length - 1; i >= 0; i--) {
      this.coins[i].update();
      this.coins[i].draw();

      if (this.coins[i].x + this.coins[i].width < 0) {
        this.coins.splice(i, 1);
        continue;
      }

      if (this.coins[i].boundingBox.isColliding(this.player.boundingBox)) {
        this.coins.splice(i, 1);
        this.score.coinCount += 1;
      }
    }
  }

  manageScore() {
    this.score.update();
    this.score.draw();
  }
}
