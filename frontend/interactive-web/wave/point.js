export class Point {
  constructor(index, x, y) {
    this.x = x;
    this.y = y;
    this.fixedY = y;
    this.speed = 0.04;
    this.cur = index;
    this.max = Math.random() * 100 + 100;
  }

  // update()를 수행할때마다 점의 y 좌표 위치가 달라짐
  update() {
    this.cur += this.speed;
    this.y = this.fixedY + (Math.sin(this.cur) * this.max);
  }
}