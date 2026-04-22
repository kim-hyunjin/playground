let slide_data = [
  {
    src: './asset/0.png',
    title: 'Slide 1',
    copy: 'DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.',
  },
  {
    src: './asset/1.png',
    title: 'Slide 2',
    copy: 'DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.',
  },
  {
    src: './asset/2.png',
    title: 'Slide 3',
    copy: 'DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.',
  },
  {
    src: './asset/3.png',
    title: 'Slide 4',
    copy: 'DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.',
  },
  {
    src: './asset/4.png',
    title: 'Slide 5',
    copy: 'DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.',
  },
];
let slides = [],
  captions = [];

// let autoplay = setInterval(function () {
//   nextSlide();
// }, 5000);
let scrolling = false;
window.addEventListener('wheel', (e) => {
  if (scrolling) return;
  scrolling = true;
  if (e.deltaY > 0) {
    nextSlide();
  } else {
    prevSlide();
  }
});

const threshold = 30,
  allowedTime = 1000;
let startX, startY, startTime;
window.addEventListener('touchstart', (e) => {
  const touchObj = e.changedTouches[0];
  startX = touchObj.pageX;
  startY = touchObj.pageY;
  startTime = new Date().getTime();
  e.preventDefault();
});
window.addEventListener('touchmove', (e) => {
  e.preventDefault();
});
window.addEventListener('touchend', (e) => {
  const touchObj = e.changedTouches[0];
  const dist = touchObj.pageY - startY;
  const elapsedTime = new Date().getTime() - startTime;
  if (elapsedTime > allowedTime) return;

  if (scrolling) return;
  scrolling = true;
  if (dist > threshold) {
    nextSlide();
  }
  if (dist < 0 && -dist > threshold) {
    prevSlide();
  }
  e.preventDefault();
});

let container = document.getElementById('container');
let leftSlider = document.getElementById('left-col');
// console.log(leftSlider);
// let down_button = document.getElementById('down_button');
let caption = document.getElementById('slider-caption');
let caption_heading = caption.querySelector('caption-heading');

// down_button.addEventListener('click', function (e) {
//   e.preventDefault();
//   clearInterval(autoplay);
//   nextSlide();
//   autoplay;
// });

for (let i = 0; i < slide_data.length; i++) {
  let slide = document.createElement('div'),
    caption = document.createElement('div'),
    slide_title = document.createElement('div');

  slide.classList.add('slide');
  slide.setAttribute('style', 'background:url(' + slide_data[i].src + ')');
  if (i === 0) {
    slide.classList.add('first-image');
  }
  if (i === slide_data.length - 1) {
    slide.classList.add('last-image');
  }

  caption.classList.add('caption');
  slide_title.classList.add('caption-heading');
  slide_title.innerHTML = '<h1>' + slide_data[i].title + '</h1>';

  switch (i) {
    case 0:
      slide.classList.add('current');
      caption.classList.add('current-caption');
      break;
    case 1:
      slide.classList.add('next');
      caption.classList.add('next-caption');
      break;
    case slide_data.length - 1:
      slide.classList.add('previous');
      caption.classList.add('previous-caption');
      break;
    default:
      break;
  }
  caption.appendChild(slide_title);
  caption.insertAdjacentHTML(
    'beforeend',
    '<div class="caption-subhead"><span>dolor sit amet, consectetur adipiscing elit. </span></div>'
  );
  slides.push(slide);
  captions.push(caption);
  leftSlider.appendChild(slide);
  container.appendChild(caption);
}
// console.log(slides);

function nextSlide() {
  // caption.classList.add('offscreen');
  if (slides[0].classList.contains('last-image')) {
    scrolling = false;
    return;
  }

  slides[0].classList.remove('current');
  slides[0].classList.add('previous', 'change');
  slides[1].classList.remove('next');
  slides[1].classList.add('current');
  slides[2].classList.add('next');
  let last = slides.length - 1;
  slides[last].classList.remove('previous');

  captions[0].classList.remove('current-caption');
  captions[0].classList.add('previous-caption', 'change');
  captions[1].classList.remove('next-caption');
  captions[1].classList.add('current-caption');
  captions[2].classList.add('next-caption');
  let last_caption = captions.length - 1;

  // console.log(last);
  captions[last].classList.remove('previous-caption');

  let placeholder = slides.shift();
  let captions_placeholder = captions.shift();
  slides.push(placeholder);
  captions.push(captions_placeholder);

  setTimeout(() => (scrolling = false), 1500);
}

function prevSlide() {
  if (slides[0].classList.contains('first-image')) {
    scrolling = false;
    return;
  }

  let last = slides.length - 1;
  slides[last - 1].classList.add('previous', 'change');

  slides[last].classList.remove('previous');
  slides[last].classList.add('current');

  slides[0].classList.remove('current');
  slides[0].classList.add('next');
  slides[1].classList.remove('next');
  slides.unshift(slides.pop());

  captions[last - 1].classList.add('previous-caption', 'change');

  captions[last].classList.remove('previous-caption');
  captions[last].classList.add('current-caption');

  captions[0].classList.remove('current-caption');
  captions[0].classList.add('next-caption');
  captions[1].classList.remove('next-caption');
  captions.unshift(captions.pop());

  setTimeout(() => (scrolling = false), 1500);
}

let heading = document.querySelector('.caption-heading');

// https://jonsuh.com/blog/detect-the-end-of-css-animations-and-transitions-with-javascript/
function whichTransitionEvent() {
  var t,
    el = document.createElement('fakeelement');

  var transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}

var transitionEvent = whichTransitionEvent();
caption.addEventListener(transitionEvent, customFunction);

function customFunction(event) {
  caption.removeEventListener(transitionEvent, customFunction);
  console.log('animation ended');

  // Do something when the transition ends
}
