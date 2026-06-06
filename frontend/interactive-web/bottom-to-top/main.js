const html = document.documentElement;
const body = document.querySelector("body");
const imgBox = document.getElementById("imgBox");
const img = document.getElementById("long-img");

let initialTop;
img.onload = () => {
  body.style.height = `${img.clientHeight}px`;
  initialTop = getInitialTop();
  imgBox.style.top = `${initialTop}px`;
};

function getInitialTop() {
  return -img.clientHeight + windowHeight();
}

function changeImageTop() {
  const scrollTop = html.scrollTop;
  imgBox.style.top = `${Math.min(0, initialTop + scrollTop)}px`;
}

function windowHeight() {
  return Math.max(window.innerHeight, document.documentElement.clientHeight);
}

window.addEventListener("scroll", changeImageTop);

window.addEventListener("optimizedResize", function () {
  initialTop = getInitialTop();
  changeImageTop();
});

(function () {
  const throttle = function (type, eventName) {
    let running = false;
    window.addEventListener(type, function () {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function () {
        window.dispatchEvent(new CustomEvent(eventName));
        running = false;
      });
    });
  };

  throttle("resize", "optimizedResize");
})();
