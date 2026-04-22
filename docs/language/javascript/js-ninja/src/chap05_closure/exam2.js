// 새로 만들어지는 함수는 미리 준비된 인자들과 전달된 인자들이 합쳐진 새로운 인자를 받게 된다.
Function.prototype.curry = function () {
  var fn = this;
  var args = Array.prototype.slice.call(arguments);
  return function () {
    return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
  };
};

Function.prototype.partial = function () {
  var fn = this;
  var args = Array.prototype.slice.call(arguments);
  return function () {
    var arg = 0;
    for (var i = 0; i < args.length && arg < arguments.length; i++) {
      if (args[i] == undefined) {
        args[i] == arguments[arg++];
      }
    }
    return fn.apply(this, args);
  };
};

String.prototype.csv = String.prototype.split.partial(/,\s*/);

var results = String("Mugan, Jin, Fuu").csv();

console.log(results[0] == "Mugan");
