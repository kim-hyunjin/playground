/**
 * 유틸리티 타입
 */

/**
 * Partial<T>
 *
 * Constructs a type with all properties of Type set to optional. This utility will return a type that represents all subsets of a given type.
 * T의 모든 프로퍼티를 옵셔널로 가지는 타입
 */
interface CourseGoal {
    title: string;
    description: string;
    completeUntil: Date;
}

function createCourseGoal(title: string, description: string, date: Date): CourseGoal {
    let result: Partial<CourseGoal> = {};
    result.title = title;
    result.description = description;
    result.completeUntil = date;
    // result.wow = "wow"; // Error!
    return result as CourseGoal;
}

/**
 * Readonly
 */
const names2: Readonly<string[]> = ["Max", "Hamilton"];
//names2.push("Sainz"); //Error!
//names2.pop(); //Error!
