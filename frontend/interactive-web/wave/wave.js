import { Point } from './point.js';

export class Wave {
  constructor(index, totalPoints, color) {
    this.index = index;
    this.totalPoints = totalPoints;
    this.color = color;
    this.points = [];
  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    // 점들의(파도) 높이
    this.centerY = stageHeight / 1.5;

    // 전체 너비를 점의 개수 - 1만큼 나누어 점 간 간격을 구한다.
    this.pointGap = this.stageWidth / (this.totalPoints - 1);

    this.init();
  }

  init() {
    this.points = [];
    for (let i = 0; i < this.totalPoints; i++) {
      const point = new Point(
        this.index + i, // 점마다 고유값을 줘서 점들의 y좌표 이동이 각각 달라지게 만든다.
        this.pointGap * i, // 점의 X좌표
        this.centerY // 점의 y좌표
      );
      this.points[i] = point;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;

    let prevX = this.points[0].x;
    let prevY = this.points[0].y;

    ctx.moveTo(prevX, prevY);

    // 첫번째 점과 마지막 점은 움직이지 않음
    for (let i = 1; i < this.totalPoints; i++) {
      if (i < this.totalPoints - 1) {
        this.points[i].update();
      }

      // 이전 점과 현재 점의 중간값을 사용해야 부드러운 곡선을 그릴 수 있음
      const cx = (prevX + this.points[i].x) / 2;
      const cy = (prevY + this.points[i].y) / 2;

      ctx.quadraticCurveTo(prevX, prevY, cx, cy); // 부드러운 곡선을 그려주는 함수

      prevX = this.points[i].x;
      prevY = this.points[i].y;
    }

    // 파도 색을 채우는 부분
    ctx.lineTo(prevX, prevY);
    ctx.lineTo(this.stageWidth, this.stageHeight);
    ctx.lineTo(this.points[0].x, this.stageHeight);
    ctx.fill();
    ctx.closePath();
  }
}