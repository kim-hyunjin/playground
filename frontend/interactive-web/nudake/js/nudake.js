import {
  getDistance,
  getAngle,
  getErasedPercentage,
  drawImageCenter,
  enableScroll,
  disableScroll,
  isMobileOrTablet,
} from "./utils/utils.js";

const canvas = document.getElementById("nudake-canvas");
const canvasParent = canvas.parentNode;
const ctx = canvas.getContext("2d", { willReadFrequently: true });

let currentIndex = 0;
let prevPosition = { x: 0, y: 0 };
let isChanging = false;
let canvasWidth, canvasHeight;
let isFirstDrawing = true;

export function resize() {
  canvasWidth = canvasParent.clientWidth;
  canvasHeight = canvasParent.clientHeight;

  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

const imageUrls = ["url(./nudake-1.jpg)", "url(./nudake-2.jpg)", "url(./nudake-3.jpg)"];
const loadedImages = document.querySelectorAll(".preload-nudake-img");

export function drawImage() {
  isChanging = true;

  gsap.to(canvas, {
    opacity: 0,
    duration: isFirstDrawing ? 0 : 1,
    onComplete: () => {
      const image = loadedImages[currentIndex];
      canvas.style.opacity = 1;
      ctx.globalCompositeOperation = "source-over";
      drawImageCenter(canvas, image);
      canvasParent.style.backgroundImage = imageUrls[(currentIndex + 1) % imageUrls.length];
      prevPosition = null;
      isChanging = false;
      isFirstDrawing = false;
    },
  });
}

function onMouseDown(e) {
  if (isChanging) return;
  if (isMobileOrTablet()) {
    disableScroll();
  }
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("touchend", onMouseUp);

  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("touchmove", onMouseMove);
  prevPosition = getPos(e);
}

function onMouseUp() {
  if (isMobileOrTablet()) {
    enableScroll();
  }
  canvas.removeEventListener("mouseup", onMouseUp);
  canvas.removeEventListener("touchend", onMouseUp);
  canvas.removeEventListener("mouseleave", onMouseUp);

  canvas.removeEventListener("mousemove", onMouseMove);
  canvas.removeEventListener("touchmove", onMouseMove);
}

function onMouseMove(e) {
  if (isChanging) return;
  console.log("onMouseMove", prevPosition);
  drawCircles(e);
  checkPercent();
}

let erasedPercentCalculating = false;

function checkPercent() {
  if (!erasedPercentCalculating) {
    erasedPercentCalculating = true;
    setTimeout(() => {
      const percent = getErasedPercentage(canvas);
      if (percent > 50) {
        currentIndex = (currentIndex + 1) % loadedImages.length;
        drawImage();
      }
      erasedPercentCalculating = false;
    }, 1000);
  }
}

function drawCircles(e) {
  const nextPos = getPos(e);
  if (!prevPosition) {
    prevPosition = nextPos;
  }
  const dist = getDistance(prevPosition, nextPos);
  const angle = getAngle(prevPosition, nextPos);
  for (let i = 0; i < dist; i++) {
    const x = prevPosition.x + Math.cos(angle) * i;
    const y = prevPosition.y + Math.sin(angle) * i;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  prevPosition = nextPos;
}

function getPos(e) {
  return { x: e.offsetX ?? e.touches[0].clientX, y: e.offsetY ?? e.touches[0].clientY };
}

canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("touchstart", onMouseDown);
window.addEventListener("resize", resize);
