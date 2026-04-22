window.onload = function () {
  function find(selector, root) {
    root = root || document;

    var parts = selector.split(" ");
    var query = parts[parts.length - 1];
    var rest = parts.slice(0, -1).join("");
    var elems = root.getElementsByTagName(query);
    var results = [];

    for (var i = 0; i < elems.length; i++) {
      if (rest) {
        var parent = elems[i].parentNode;
        while (parent && parent.nodeName != rest) {
          parent = parent.parentNode;
        }
        if (parent) {
          results.push(elems[i]);
        }
      } else {
        results.push(elems[i]);
      }
    }
    return results;
  }
};
