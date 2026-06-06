import { drawImage, resize } from "./js/nudake.js";
import { init } from "./js/rotation.js";

window.addEventListener("load", () => {
  resize();
  drawImage();
  init();
});
