/**
 * unknown type
 */

let userInput: unknown;
let userInput2: any;

// unknown type에는 어떤 값도 넣을 수 있다.
userInput = 5;
userInput = "max";
userInput2 = "max";

let userName: string;
// userName = userInput // Error!
userName = userInput2; // No Error...

// unknown type은 any타입보다 더 제약이 크다. 아래와 같이 추가로 타입확인이 필요하다. 그래서 오히려 좋아..
if (typeof userInput === "string") {
    userName = userInput; // OK
}
// so unknown type is more restrict than any type

/**
 * never type
 */

// we can explicit our intention. this method never return
function generateError(message: string, code: number): never {
    throw { message, errorCode: code };
}

const whatGenerateErrorReturn = generateError("An error occurred!", 500);
console.log(whatGenerateErrorReturn); // nothing happen
