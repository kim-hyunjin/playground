export function getDistance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt(dx * dx + dy * dy);
}

export function getAngle(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.atan2(dy, dx);
}

export function getErasedPercentage(canvas) {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const gap = 32;
  const total = data.length / gap;
  let erased = 0;

  for (let i = 0; i < data.length - 3; i += gap) {
    if (data[i + 3] === 0) {
      erased++;
    }
  }

  return Math.round((erased / total) * 100);
}

export function drawImageCenter(canvas, image) {
  const ctx = canvas.getContext("2d");

  const cw = canvas.width;
  const ch = canvas.height;
  const iw = image.width;
  const ih = image.height;

  const imgRatio = ih / iw;
  const canvasRatio = ch / cw;

  let sx, sy, sw, sh;

  if (imgRatio >= canvasRatio) {
    sw = iw;
    sh = sw * canvasRatio;
  } else {
    sh = ih;
    sw = sh * (cw / ch);
  }
  sx = iw / 2 - sw / 2;
  sy = ih / 2 - sh / 2;

  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, cw, ch);
}
