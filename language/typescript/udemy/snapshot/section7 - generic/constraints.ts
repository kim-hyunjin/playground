/**
 * 제약 조건 추가하기
 */
function merge3<T extends object, U extends object>(target: T, source: U) {
    return Object.assign(target, source);
}

// const mergedObj4 = merge3({ name: "Max" }, 30); // Error!
const mergedObj4 = merge3({ name: "Max" }, { age: 20 });

/**
 * 다른 일반 함수
 */
interface Lengthy {
    length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
    let descriptionText = "Got no value.";
    if (element.length === 1) {
        descriptionText = "Got 1 element.";
    }
    if (element.length > 1) {
        descriptionText = `Got ${element.length} elements.`;
    }
    return [element, descriptionText];
}

console.log(countAndDescribe("Hi there!"));

/**
 * keyof 제약조건
 */

function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
    return obj[key];
}

console.log(extractAndConvert({ name: "Max", age: 20 }, "name"));
