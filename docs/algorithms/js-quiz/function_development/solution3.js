function solution(progresses, speeds) {
  let answer = [0];
  let leftDays = progresses.map((progress, index) =>
    Math.ceil((100 - progress) / speeds[index])
  );
  console.log(leftDays);
  let releaseDay = leftDays[0];

  for (let i = 0, j = 0; i < leftDays.length; i++) {
    // 배포일보다 기능개발 완료일이 짧은 경우 함께 배포할 수 있다.
    if (leftDays[i] <= releaseDay) {
      answer[j] += 1;
    } else {
      // 배포일보다 기능개발 완료일이 더 길다면 다음 배포일을 해당 기능의 완료일로 업데이트하기
      releaseDay = leftDays[i];
      answer[++j] = 1;
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
