function Ninja() {
  var feints = 0; // 유효 범위는 함수 내부

  this.getFeints = function () {
    // getter
    return feints;
  };
  this.feint = function () {
    feints++;
  };
}

var ninja = new Ninja();

ninja.feint();

console.log("생성자 함수 내부에 있는 변수의 값 얻기", ninja.getFeints() == 1);
console.log(
  "하지만 함수 내 변수에 직접 접근할 수 없다.",
  ninja.feints == undefined
);
