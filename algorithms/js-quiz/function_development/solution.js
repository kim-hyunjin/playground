function solution(progresses, speeds) {
  var answer = [];

  // 모든 기능이 배포될때까지 반복
  while (progresses.length) {
    let releaseCount = 0;

    // 매일 각 기능의 진행률 더해주기
    for (let i = 0; i < progresses.length; i++) {
      progresses[i] += speeds[i];
    }
    console.log(progresses);

    // 완료된 기능이 있는지 확인하고 배포하기
    while (progresses[0] >= 100) {
      console.log("기능 배포!");
      progresses.shift();
      speeds.shift();
      releaseCount += 1;
    }

    if (releaseCount != 0) {
      answer.push(releaseCount);
    }
  }

  return answer;
}

function main() {
  const progresses = [93, 30, 55];
  const speeds = [1, 30, 5];
  console.log(solution(progresses, speeds));
}

main();
