windows.onload = function () {
  function find(selector, root) {
    root = root || document;

    var parts = selector.split(" "); // 스페이스를 구분자로 하여 셀렉터 문자열 분리
    var query = parts[0];
    var rest = parts.slice(1).join(" ");
    var elems = root.getElementsByTagName(query);
    var results = [];

    for (var i = 0; i < elems.length; i++) {
      if (rest) {
        // 모든 셀렉터를 처리할 때까지 재귀적으로 호출
        results = results.concat(find(rest, elems[i]));
      } else {
        results.push(elems[i]);
      }
    }

    return results;
  }
};
