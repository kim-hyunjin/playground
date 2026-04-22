import {Canvas} from "./js/canvas.js";
import {Particle} from "./js/particle.js";
import {randomIntBetween, randomNumBetween} from "./js/utils.js";
import {Tail} from "./js/tail.js";
import {Spark} from "./js/spark.js";

let canvas;

const PARTICLE_COUNT = 400;
const particles = [];
const tails = [];
const sparks = [];
const stars = [];

function createParticles(x, y, colorDegree) {
    // const x = randomNumBetween(0, canvas.width);
    // const y = randomNumBetween(0, canvas.height);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const r = randomNumBetween(2, 100) * 0.2;
        const angle = Math.PI / 180 * randomNumBetween(0, 360);
        const vx = r * Math.cos(angle);
        const vy = r * Math.sin(angle);
        const opacity = randomNumBetween(0.6, 0.9);
        const _colorDegree = colorDegree + randomNumBetween(-20, 20);
        particles.push(new Particle(canvas, x, y, vx, vy, opacity, _colorDegree));
    }
}
function createTails() {
    const x = randomNumBetween(canvas.width * 0.2, canvas.width * 0.8);
    const vy = randomIntBetween(canvas.height / 30, canvas.height / 25) * -1
    const colorDegree = randomIntBetween(0, 360);
    tails.push(new Tail(canvas, x, vy, colorDegree));
}

function createStars() {
    for (let i = 0; i < canvas.width * 0.05; i++) {
        const x = randomNumBetween(0, canvas.width);
        const y = randomNumBetween(0, canvas.height);
        const r = randomNumBetween(0.2, 1.5);
        const opacity = randomNumBetween(0.6, 0.9);
        const star = new Particle(canvas, x, y, 0, 0, opacity, 0)
        star.colorBrightness = randomNumBetween(90, 100);
        star.radius = r;
        stars.push(star);
    }
}

function draw() {
    canvas.ctx.fillStyle = '#00000040'
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height)

    canvas.ctx.fillStyle = `rgba(255, 255, 255, ${particles.length / 40000})`
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height)

    stars.forEach(star => {
        star.draw();
    });

    if (Math.random() < 0.01) {
        createTails();
    }
    tails.forEach((tail, index) => {
        tail.update();
        tail.draw();

        for (let i = 0; i < Math.round(Math.abs(tail.vy * 0.3)); i++) {
            const vx = randomNumBetween(-5, 5) * 0.01
            const vy = randomNumBetween(-30, 30) * 0.01
            const opacity = Math.min(-tail.vy, 0.5);
            const spark = new Spark(canvas, tail.x, tail.y, vx, vy, opacity, tail.colorHue)
            sparks.push(spark)
        }

        if (tail.opacity <= 0.05) {
            tails.splice(index, 1);
            createParticles(tail.x, tail.y, tail.color);
        }
    });

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        if(Math.random() < 0.1) {
            const opacity = randomNumBetween(0.2, 0.5)
            const spark = new Spark(canvas, particle.x, particle.y, 0, 0, opacity)
            sparks.push(spark);
        }
        if (particle.opacity <= 0) {
            particles.splice(index, 1);
        }
    });

    sparks.forEach((spark, index) => {
        spark.update();
        spark.draw();
        if (spark.opacity <= 0) {
            sparks.splice(index, 1);
        }
    })
}

window.addEventListener('load', () => {
    const canvasEl = document.getElementById('canvas');
    canvas = new Canvas(canvasEl);
    canvas.init();
    createStars();
    createTails();
    createParticles();
    canvas.render(draw);
})

window.addEventListener('resize', () => {
    canvas.init(innerWidth, innerHeight);
})
