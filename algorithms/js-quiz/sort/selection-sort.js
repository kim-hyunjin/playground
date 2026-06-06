function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let min = Number.MAX_VALUE;
    let minIndex = -1;
    // 앞쪽은 최소값으로 배열되어있으므로 앞쪽은 제외하고 최소값 찾기
    for (let j = i; j < arr.length; j++) {
      // 최소값 찾기
      if (arr[j] < min) {
        min = arr[j];
        minIndex = j;
      }
    }
    // 이제 i번째의 값은 위에서 찾은 최소값이다.
    let temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }
  return arr;
}

function test() {
  // given
  let arr = [3, 4, 7, 5, 9, 1, 2, 6];
  let expect = [1, 2, 3, 4, 5, 6, 7, 9];

  // when
  let actual = selectionSort(arr);

  // then
  console.log(JSON.stringify(expect) == JSON.stringify(actual));
}

test();
