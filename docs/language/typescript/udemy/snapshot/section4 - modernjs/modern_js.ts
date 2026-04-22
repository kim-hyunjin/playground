const button = document.querySelector("button");

if (button) {
    button.addEventListener("click", (event) => console.log(event));
}

/**
 * default parameter
 *
 */
const add = (a: number, b: number = 1) => a + b;

const printOutput: (a: number | string) => void = (output) => console.log(output);

printOutput(add(5));

const add2 = (a: number = 1, b: number) => a + b;

// printOutput(add2(5)) // error! 두번재 파라미터는 기본값이 없다.

/**
 * 스프레드 연산자
 */
const hobbies = ["cooking", "game", "biking"];
const activeHobbies = ["Hiking"];
activeHobbies.push(...hobbies);

const person = {
    firstName: "max",
    age: 30,
};

const person2 = {
    ...person,
};

/**
 * 나머지 매개변수
 */
const add3 = (...numbers: number[]) => {
    return numbers.reduce((curResult, curValue) => {
        return curResult + curValue;
    }, 0);
};

const addedNumbers = add3(1, 2, 3, 4, 5, 6);
console.log(addedNumbers);

// tuple
const add4 = (...numbers: [number, number, number]) => {
    return numbers.reduce((curResult, curValue) => {
        return curResult + curValue;
    }, 0);
};

add4(1, 2, 3);
// add4(1, 2, 3, 4); // error!

/**
 * 비구조화 할당
 *
 */
const [hobby1, hobby2, ...remainingHobbies] = hobbies;
console.log(hobby1, hobby2, ...remainingHobbies);
console.log(hobbies);

const { firstName: userName, age } = person;
console.log(userName, age);
console.log(person);
