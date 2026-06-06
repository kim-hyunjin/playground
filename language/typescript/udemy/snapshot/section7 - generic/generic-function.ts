/**
 * 일반 함수
 */
function merge(target: object, source: object) {
    return Object.assign(target, source); // return object type
}

// not good...
const mergedObj = merge({ name: "Max" }, { age: 20 }) as { name: string; age: number };
console.log(mergedObj.name, mergedObj.age);

// 제네릭을 사용한다면?
function merge2<T, U>(target: T, source: U) {
    return Object.assign(target, source); // return T & U 인터섹션 타입
}

// Goooood!
const mergedObj2 = merge2({ name: "Max" }, { age: 20 });
console.log(mergedObj2.name, mergedObj2.age);

const mergedObj3 = merge2({ name: "Max" }, 30); // bad...
