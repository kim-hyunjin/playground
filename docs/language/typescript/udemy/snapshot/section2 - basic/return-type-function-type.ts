/**
 * Return Type
 */

// 딱히 type을 지정해야할 이유가 없다면 typescript 추론을 이용하자
function add(n1: number, n2: number): number {
  return n1 + n2;
}

// :void
function printResult(num: number) {
  console.log("Result: " + num);
}

// in case of return type is void, it return undefined
let whatPrintResultReturn = printResult(add(5, 3));
console.log(whatPrintResultReturn); // undefined

/**
 * function type
 */

let combineValues;
combineValues = add;
combineValues = 5; // no problem...
// console.log(combineValues(8, 8)); // Uncaught TypeError: combineValues is not a function

let combineValues2: Function;
combineValues2 = add;
// combineValues2 = 5 // Error!
combineValues2 = printResult; // no problem...

// more precise type
let combineValues3: (n1: number, n2: number) => number; // take two number and return one number
combineValues3 = add;
// combineValues3 = printResult // Error!

/**
 * function type and callback
 */
function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
  const result = n1 + n2;
  const value = cb(result);
  console.log("value: " + value); // cb의 리턴 타입이 void이지만 리턴 값이 있다면 받을 수 있다..
}

addAndHandle(10, 20, (result) => {
  console.log(result);
  return result; // no probelm
});
