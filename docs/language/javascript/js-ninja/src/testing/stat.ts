// exports.max = (numbers:number[]):number => {
//     let result = numbers[0];
//     numbers.forEach(n => {
//         if (n > result) {
//             result = n;
//         }
//     });
//     return result;
// }
exports.max = (numbers:number[]):number => Math.max(...numbers);
exports.min = (numbers:number[]):number => Math.min(...numbers);
exports.avg = (numbers:number[]):number => numbers.reduce((acc, current, index, {length}) => acc + current / length, 0);
const sort = (numbers:number[]):number[] => numbers.sort((a, b) => a - b);
exports.sort = sort
exports.median = (numbers:number[]):number => {
    sort(numbers);
    const middle = Math.floor(numbers.length / 2);
    return numbers.length % 2 ? numbers[middle] : (numbers[middle - 1] + numbers[middle]) / 2;
}
exports.mode = (numbers:number[]):any => {
    // const counts = new Map<number, number>();
    // numbers.forEach(n => {
    //     const count = counts.get(n) || 0;
    //     counts.set(n, count + 1);
    // });
    const counts = numbers.reduce((map, current) => {
        let cur = map.get(current);
        cur ? cur++ : cur = 1
        return map.set(current, cur)
    }, new Map<number, number>())

    const maxCount = Math.max(...Array.from(counts.values()));
    const modes = Array.from(counts.keys()).filter(number => counts.get(number) === maxCount);
    if (modes.length === numbers.length) {
        return null;
    }
    if (modes.length > 1) {
        return modes;
    }
    return modes[0]
}