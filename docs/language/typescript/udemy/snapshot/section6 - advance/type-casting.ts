/**
 * Type Casting
 */
const paragraph = document.getElementById("message-output");
// const userInput = <HTMLInputElement>document.getElementById("user-input")!; // it work too
const userInput = document.getElementById("user-input")! as HTMLInputElement;
userInput.value = "Hi there!";
