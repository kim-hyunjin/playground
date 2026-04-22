function add(num1: number, num2: number, showResult: boolean, phrase: string) {
  const result = num1 + num2;
  if (showResult) console.log(phrase + result);
  return result;
}

const num1 = "5";
const num2 = 2.7;
let num3: number;
num3 = 5;
// num3 = '5'; // Error
const printResult = true;
const phrase = "Result is : ";
// const result = add(num1, num2); // Error! typescript can help us!
const result = add(num2, num3, printResult, phrase);
