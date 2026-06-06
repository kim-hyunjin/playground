(function () {})();
/*
    이 코드의 결과는 다음과 같은 특성을 따르는 한 줄의 코드 표현이다.
    - 함수 인스턴스를 생성한다.
    - 함수를 실행한다.
    - 함수를 폐기한다.(실행을 마치고나면 더 이상 이 함수를 참조하는 곳이 없으므로)
*/

(function () {
  var numClicks = 0;
  document.addEventListener(
    "click",
    function () {
      alert(++numClicks);
    },
    false
  );
})();

// 변수의 유효범위는 변수가 속한 클로저를 기준으로 결정된다.
// 즉시실행함수를 이용해서 변수의 유효범위를 블록이나 하위 블록 수준으로 지정할 수 있다.
// 다음은 코드의 유효범위를 함수의 인자 수준으로 작게 지정한 예.
document.addEventListener(
  "click",
  ((function () {
    var numClicks = 0;
    return function () {
      alert(++numClicks);
    };
  })(),
  false)
);

$ = function () {
  alert("not jQuery");
};
// 매개변수를 이용해 유효범위 내에서 사용할 이름을 지정할 수 있다.
// 매개변수가 전역변수보다 높은 우선순위를 갖는다.
(function ($) {
  $("img").on("click", function () {
    $(event.target).addClass(".clickedOn");
  });
})(jQuery);

// 짧은 이름을 이용해 코드 가독성을 유지할 수 있다.
(function (v) {
  Object.extend(v, {
    href: v._getAttr,
    src: v._getAttr,
    type: v._getAttr,
    // ...
  });
})(Element.attributeTranslations.read.values);

var div = document.getElementsByTagName("div");
// 즉시실행 함수를 for 문의 본문으로 사용하면(블록을 즉시실행함수로 교체), for문 내에서 각 단께가 지닌 유효범위 내에 변수 i가 새로 정의된다.
for (var i = 0; i < div.length; i++)
  (function (n) {
    div[n].addEventListener(
      "click",
      function () {
        alert("div #" + n + " was clicked");
      },
      false
    );
  })(i);
