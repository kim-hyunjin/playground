/**
 * Union Type
 */

function combine(input1: number | string, input2: number | string) {
  let result;
  if (typeof input1 === "number" && typeof input2 === "number") {
    result = input1 + input2;
  } else {
    result = String(input1) + String(input2);
  }
  return result;
}

console.log(combine(30, 26));
console.log(combine("Max", "Anna"));

/**
 * Literal Type
 */

function combine2(
  input1: number | string,
  input2: number | string,
  resultConversion: "as-number" | "as-string" // this is Literal Type
) {
  let result;
  if (
    (typeof input1 === "number" && typeof input2 === "number") ||
    resultConversion === "as-number"
  ) {
    result = Number(input1) + Number(input2);
  } else {
    result = String(input1) + String(input2);
  }
  return result;
}

// console.log(combine2("30", "26", "as-num")); // Error!
console.log(combine2("30", "26", "as-number"));

/**
 * Type alias
 */
type Combinable = number | string;
type ConversionDescriptor = "as-number" | "as-string";

function combine3(input1: Combinable, input2: Combinable, resultConversion: ConversionDescriptor) {
  let result;
  if (
    (typeof input1 === "number" && typeof input2 === "number") ||
    resultConversion === "as-number"
  ) {
    result = Number(input1) + Number(input2);
  } else {
    result = String(input1) + String(input2);
  }
  return result;
}

function greet(user: { name: string; age: number }) {
  console.log("Hi, I am " + user.name);
}

function isOlder(user: { name: string; age: number }, checkAge: number) {
  return checkAge > user.age;
}

// using type alias, code is more readable
type User = { name: string; age: number };
function greet2(user: User) {
  console.log("Hi, I am " + user.name);
}

function isOlder2(user: User, checkAge: number) {
  return checkAge > user.age;
}
