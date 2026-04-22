function bind(context, name) {
  return function () {
    return context[name].apply(context, arguments);
  };
}

var button = {
  clicked: false,
  click: function () {
    this.clicked = true;
    console.log("The button has been clicked: ", button.clicked);
    console.log(this);
  },
};

// var elem = document.getElementById("test");
// elem.addEventListener("click", bind(button, "click"), false);
// 익명함수, apply(), 클로저의 조합을 이용해 항상 원하는 콘텍스트를 가지고
// 특정 함수 호출을 강제할 수 있다.

Function.prototype.bind = function () {
  var fn = this;
  var args = Array.prototype.slice.call(arguments);
  var object = args.shift();

  return function () {
    return fn.apply(object, args.concat(Array.prototype.slice.call(arguments)));
  };
};

var myObj = {};
function myFn() {
  return this == myObj;
}

console.log("콘텍스트 설정 전 : ", !myFn());
var aFn = myFn.bind(myObj);
console.log("콘텍스트 설정 후 : ", aFn());

// 자바스크립트 1.8.5부터 Function 프로토타입에 내장된 bind()메서드를 사용할 수 있다.
