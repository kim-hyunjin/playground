function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const val = arr[i];
    // 현재 i번째 값과 앞쪽의 값들을 비교해서 알맞은 자리에 집어넣는다.
    let j = i - 1;
    while (j >= 0 && arr[j] > val) {
      arr[j + 1] = arr[j]; // 앞쪽에 정렬된 값이 현재 집어넣을 값보다 크면 뒤로 한칸씩 밀어야 한다.
      j--;
    }
    arr[j + 1] = val;
  }
  return arr;
}

function test() {
  // given
  let arr = [3, 4, 7, 5, 9, 1, 2, 6];
  let expect = [1, 2, 3, 4, 5, 6, 7, 9];

  // when
  let actual = insertionSort(arr);

  // then
  console.log(JSON.stringify(expect) == JSON.stringify(actual));
}

test();
