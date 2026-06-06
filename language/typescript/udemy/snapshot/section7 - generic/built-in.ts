/**
 * Built in
 */

const names: Array<string> = ["hello world", "hi"]; // string[]
names[0].split(" ");

// this promise will yield string
const promise: Promise<string> = new Promise((resolve, _) => {
    setTimeout(() => {
        resolve("This is done!");
    }, 1000);
});

promise.then((data) => {
    console.log(data.split(" ")); // we know data type is string!!
});

const promise2: Promise<number> = new Promise((resolve, _) => {
    setTimeout(() => {
        resolve(10);
    }, 1000);
});

promise2.then((data) => {
    console.log(typeof data);
});
