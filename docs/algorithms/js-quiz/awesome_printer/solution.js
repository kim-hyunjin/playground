function solution(priorities, location) {
  var answer = 0;
  priorities = priorities.map((doc, index) => {
    return {
      priority: doc,
      location: index,
    };
  });

  while (priorities.length) {
    const doc = priorities.shift();
    if (priorities.some((item) => item.priority > doc.priority)) {
      priorities.push(doc);
    } else {
      answer++;
      if (doc.location === location) {
        break;
      }
    }
  }
  return answer;
}

function main() {
  const priorities = [2, 1, 3, 2];
  const location = 2;
  console.log(solution(priorities, location));
}

main();
