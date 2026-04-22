/**
 * Nullish Coalescing
 */
const userInputData = undefined;
const storedData = userInputData ?? "DEFAULT"; // null or undefined 일 경우, DEFAULT 문자열을 사용

console.log(storedData);
