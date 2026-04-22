function bubbleSort(arr) {
  // 인접한 두 값을 비교해서 대소에 따라 위치를 바꾼다.
  // 큰 수를 뒤쪽에 먼저 정렬
  for (let i = arr.length - 1; i > 0; i--) {
    // 정렬된 뒷부분을 제외해야하므로 그 앞까지만 비교
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

function test() {
  // given
  let given = [13, 5, 11, 7, 23, 15];
  let expect = [5, 7, 11, 13, 15, 23];

  // when
  let actual = bubbleSort(given);
  console.log(actual);

  // then
  console.log(JSON.stringify(expect) == JSON.stringify(actual));
}

test();
