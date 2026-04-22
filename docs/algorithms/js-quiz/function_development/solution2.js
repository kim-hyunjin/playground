function solution(progresses, speeds) {
  const length = progresses.length;
  let answer = [],
    i = 0,
    releaseDay = 0,
    numberOfReleases = 0;

  while (i < length) {
    // 맨 앞 기능의 배포일 구하기
    releaseDay = Math.ceil((100 - progresses[i]) / speeds[i]);

    // 맨 앞 기능의 배포일에 함깨 배포할 기능이 있는지 찾기
    i++;
    numberOfReleases = 1;
    while (progresses[i] + speeds[i] * releaseDay >= 100) {
      numberOfReleases++;
      i++;
    }

    answer.push(numberOfReleases);
  }

  return answer;
}

function main() {
  const progresses = [93, 30, 55];
  const speeds = [1, 30, 5];
  console.log(solution(progresses, speeds));
}

main();
