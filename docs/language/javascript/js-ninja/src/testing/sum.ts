function sum(a:number, b:number) :number {
    return a + b
}

function sumOf(numbers:number[]) {
    // let result = 0;
    // numbers.forEach(n => {
    //     result += n;
    // });
    // return result;
    return numbers.reduce((acc, current) => acc + current, 0);
}

export {sum, sumOf};