const button = document.querySelector("button");

function clickHandler(message: string, num: number) {
  // let userName = "max";
  console.log("click! " + message);
  add(num, num);
}

function add(n1: number, n2: number) {
  if (n1 + n2 > 0) {
    return n1 + n2;
  }
  return; // noImplicitReturns: true인 경우 이 구문이 없으면 에러
}

button?.addEventListener("click", clickHandler.bind(null, "good!", 30));
