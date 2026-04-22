module.exports = function myloader(content) {
  console.log("myloader work!");
  // 로더에서 여러가지 변환작업이 가능하다.
  return content.replace("console.log(", "alert(");
};
