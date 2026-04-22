const outerValue = "ninja";

let later;

function outerFunction() {
  const innerValue = "samurai";

  function innerFunction(paramValue) {
    console.log("[inner]outerValue == ninja", outerValue == "ninja");
    console.log("[inner]innerValue == samurai", innerValue == "samurai");
    console.log("[inner]paramValue", paramValue);
    console.log("[inner]tooLage", tooLate == "too Late");
  }
  later = innerFunction;
}

// console.log("tooLate 선언 전", tooLate == "too Late"); ==> Cannot access 'tooLate' before initialization
const tooLate = "too Late";
outerFunction();

later("papa"); // true ==> 클로저는 해당 함수가 존재하는 한, 함수의 유효범위와 관계된 모든 변수를 가비지 컬렉터로부터 보호한다.
// innerFunction()을 선언 했을 때, 같은 유효 범위에 있는 모든 변수를 포함하는 클로저도 생성되는 것이다.
// 심지어 함수를 선언한 뒤에 만든 변수일지라도 클로저에 포함된다.

// innerFunction(); => innterFunction의 유효범위는 outerFunction 내부로 제한된다.
