const html = document.documentElement;
const body = document.querySelector("body");
const backgroundContainer = document.getElementsByClassName("background-container")[0];
const backgrounds = document.getElementsByClassName("background-img");
const imgCnt = backgrounds.length;

const imgHeight = 1000;
const initialTop = -(imgHeight * (imgCnt - 1));
body.style.height = `${imgHeight * (imgCnt + 1)}px`;
backgroundContainer.style.top = `${initialTop}px`;

function changeImageTop() {
  const scrollTop = html.scrollTop;
  const newTop = Math.min(0, initialTop + scrollTop);
  backgroundContainer.style.top = `${newTop}px`;
}

window.addEventListener("scroll", changeImageTop);
