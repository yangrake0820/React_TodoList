import React, { useEffect } from 'react';
import $ from 'jquery';
import './Main.css';
import { withRouter } from 'react-router-dom';

// 메인 애니메이션 효과 -S
function normalPool(o) {
    var r = 0;
    do {
        var a = Math.round({ mean: o.mean, dev: o.dev });
        if (a < o.pool.length && a >= 0) return o.pool[a];
        r++;
    } while (r < 100);
}
function randomNormal(o) {
    if (((o = Object.assign({ mean: 0, dev: 1, pool: [] }, o)), Array.isArray(o.pool) && o.pool.length > 0))
        return normalPool(o);
    var r,
        a,
        n,
        e,
        l = o.mean,
        t = o.dev;
    do {
        r = (a = 2 * Math.random() - 1) * a + (n = 2 * Math.random() - 1) * n;
    } while (r >= 1);
    return (e = a * Math.sqrt((-2 * Math.log(r)) / r)), t * e + l;
}

const NUM_PARTICLES = 600;
const PARTICLE_SIZE = 0.3; // View heights
const SPEED = 20000; // Milliseconds

let particles = [];

function rand(low, high) {
    return Math.random() * (high - low) + low;
}

function createParticle(canvas) {
    const colour = {
        r: 70,
        g: randomNormal({ mean: 84, dev: 100 }),
        b: 250,
        a: rand(0, 0.8),
    };
    return {
        x: -2,
        y: -2,
        diameter: Math.max(0, randomNormal({ mean: PARTICLE_SIZE, dev: PARTICLE_SIZE / 2 })),
        duration: randomNormal({ mean: SPEED, dev: SPEED * 0.1 }),
        amplitude: randomNormal({ mean: 16, dev: 2 }),
        offsetY: randomNormal({ mean: 0, dev: 10 }),
        arc: Math.PI * 2,
        startTime: performance.now() - rand(0, SPEED),
        colour: `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`,
    };
}

function moveParticle(particle, canvas, time) {
    const progress = ((time - particle.startTime) % particle.duration) / particle.duration;
    return {
        ...particle,
        x: progress,
        y: Math.sin(progress * particle.arc) * particle.amplitude + particle.offsetY,
    };
}

function drawParticle(particle, canvas, ctx) {
    canvas = document.getElementById('particle-canvas');
    const vh = canvas.height / 100;

    ctx.fillStyle = particle.colour;
    ctx.beginPath();
    ctx.ellipse(
        particle.x * canvas.width,
        particle.y * vh + canvas.height / 2,
        particle.diameter * vh,
        particle.diameter * vh,
        0,
        0,
        2 * Math.PI,
    );
    ctx.fill();
}

function draw(time, canvas, ctx) {
    // Move particles
    particles.forEach((particle, index) => {
        particles[index] = moveParticle(particle, canvas, time);
    });

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the particles
    particles.forEach((particle) => {
        drawParticle(particle, canvas, ctx);
    });

    // Schedule next frame
    requestAnimationFrame((time) => draw(time, canvas, ctx));
}

function initializeCanvas() {
    let canvas = document.getElementById('particle-canvas');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    let ctx = canvas.getContext('2d');

    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx = canvas.getContext('2d');
    });

    return [canvas, ctx];
}

function startAnimation() {
    const [canvas, ctx] = initializeCanvas();

    // Create a bunch of particles
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(createParticle(canvas));
    }

    requestAnimationFrame((time) => draw(time, canvas, ctx));
}

// Start animation when document is loaded
const Animation = function () {
    if (document.readystate !== 'loading') {
        startAnimation();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            startAnimation();
        });
    }
};
// 메인 애니메이션 효과 -E

const onClick = ({ location, match, history }) => {
    history.push('/test');
};

const Main = () => {
    useEffect(() => {
        Animation();
        return Animation();
    });
    return (
        <>
            <div class="solar_bg">
                <canvas id="particle-canvas" />
                <section class="solar_box">
                    <div class="solar_logo">
                        <img src={process.env.PUBLIC_URL + '/img/character.png'} />
                    </div>

                    <div class="solar_login_button">
                        <button style={{ cursor: 'pointer' }} onClick={onClick}>
                            보러가기
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
};

export default withRouter(Main);
