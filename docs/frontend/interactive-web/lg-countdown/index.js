import {Canvas} from "./js/canvas.js";
import Particle from "./js/particle.js";

let canvas;

function init() {
    const canvasEl = document.querySelector('canvas');
    canvas = new Canvas(canvasEl)
    canvas.init()
}

const particles = [];
const PARTICLE_COUNT = 800;

function createRing() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle(canvas));
    }
}

function draw() {
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].opacity <= 0) {
            particles.splice(i, 1);
        }
    }


}

function render() {
    canvas.render(draw)
}

window.addEventListener('load', () => {
    init();
    render();
})

window.addEventListener('resize', init);

window.addEventListener('click', () => {
    const texts = document.querySelectorAll('span');

    const countdownOption = {opacity: 1, scale: 1, duration: 0.4, ease: 'Power4.easeOut'};

    gsap.fromTo(texts[0], {opacity: 0, scale: 5}, countdownOption);

    gsap.fromTo(texts[1], {opacity: 0, scale: 5}, {
        ...countdownOption,
        delay: 1,
        onStart: () => texts[0].style.opacity = '0',
    });

    gsap.fromTo(texts[2], {opacity: 0, scale: 5}, {
        ...countdownOption,
        delay: 2,
        onStart: () => texts[1].style.opacity = '0',
    });

    const ringImg = document.querySelector('#ring');
    gsap.fromTo(ringImg, {opacity: 1}, {
        opacity: 0, duration: 1, delay: 3, onStart: () => {
            createRing();
            texts[2].style.opacity = '0'
        }
    });

})
