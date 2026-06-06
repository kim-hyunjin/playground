import { useEffect } from "react";
import "../styles/containers/Nudake.css";
import { useRef } from "react";

import image1 from "../assets/nudake-1.jpg";
import image2 from "../assets/nudake-2.jpg";
import image3 from "../assets/nudake-3.jpg";
import {
  drawImageCenter,
  getAngle,
  getDistance,
  getErasedPercentage,
} from "../utils/utils.js";
import gsap from "gsap";

const Nudake = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasParent = canvas.parentNode;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const images = [image1, image2, image3];
    let currentIndex = 0;
    let prevPosition = { x: 0, y: 0 };
    let isChanging = false;
    let canvasWidth, canvasHeight;
    let isFirstDrawing = true;

    function resize() {
      canvasWidth = canvasParent.clientWidth;
      canvasHeight = canvasParent.clientHeight;

      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      preloadImages().then(drawImage);
    }

    const loadedImages = [];

    function preloadImages() {
      return new Promise((resolve, reject) => {
        images.forEach((image) => {
          const img = new Image();
          img.src = image;
          img.onload = () => {
            loadedImages.push(img);
            if (loadedImages.length === images.length) {
              return resolve();
            }
          };
          img.onerror = () => {
            return reject();
          };
        });
      });
    }

    function drawImage() {
      isChanging = true;

      gsap.to(canvas, {
        opacity: 0,
        duration: isFirstDrawing ? 0 : 1,
        onComplete: () => {
          const image = loadedImages[currentIndex];
          canvas.style.opacity = 1;
          ctx.globalCompositeOperation = "source-over";
          drawImageCenter(canvas, image);
          canvasParent.style.backgroundImage = `url(${
            images[(currentIndex + 1) % images.length]
          })`;
          prevPosition = null;
          isChanging = false;
          isFirstDrawing = false;
        },
      });
    }

    function onMouseDown(e) {
      if (isChanging) return;
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("mousemove", onMouseMove);
      prevPosition = { x: e.offsetX, y: e.offsetY };
    }

    function onMouseUp() {
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
    }

    function onMouseMove(e) {
      if (isChanging) return;
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
            currentIndex = (currentIndex + 1) % images.length;
            drawImage();
          }
          erasedPercentCalculating = false;
        }, 1000);
      }
    }

    function drawCircles(e) {
      const nextPos = { x: e.offsetX, y: e.offsetY };
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
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
      }

      prevPosition = nextPos;
    }

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="nudake">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Nudake;
