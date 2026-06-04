/* ---------- PARTICLES ---------- */
(function () {
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");
    let W,
        H,
        particles = [];
    const N = 40;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    function rand(a, b) {
        return a + Math.random() * (b - a);
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = rand(0, W);
            this.y = rand(0, H);
            this.r = rand(0.5, 2.2);
            this.vx = rand(-0.3, 0.3);
            this.vy = rand(-0.3, 0.3);
            this.alpha = rand(0.2, 0.7);
            this.color = Math.random() < 0.6 ? "#2563ff" : "#5b3df5";
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H)
                this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
        }
    }

    for (let i = 0; i < N; i++) particles.push(new Particle());

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distSqr = dx * dx + dy * dy;
                if (distSqr < 14400) {
                    const dist = Math.sqrt(distSqr);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = "#2563ff";
                    ctx.globalAlpha = (1 - dist / 120) * 0.15;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        drawConnections();
        ctx.globalAlpha = 1;
        requestAnimationFrame(loop);
    }
    loop();
})();

/* ---------- NAVBAR SCROLL ---------- */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
});

/* ---------- MOBILE MENU ---------- */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileClose = document.getElementById("mobileClose");
hamburger.addEventListener("click", () => mobileMenu.classList.add("open"));
mobileClose.addEventListener("click", () =>
    mobileMenu.classList.remove("open"),
);
document.querySelectorAll(".mobile-link").forEach((l) => {
    l.addEventListener("click", () => mobileMenu.classList.remove("open"));
});

/* ---------- SCROLL REVEAL ---------- */
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                observer.unobserve(e.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);
reveals.forEach((el) => observer.observe(el));

/* ---------- COUNTER ANIMATION ---------- */
function animateCounter(el, target, duration = 2000) {
    const start = performance.now();
    const isFloat = target < 10 && String(target).includes(".");
    function update(now) {
        const elapsed = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - elapsed, 3);
        const current = isFloat
            ? (ease * target).toFixed(1)
            : Math.round(ease * target);
        el.textContent = Number(current).toLocaleString("pt-BR");
        if (elapsed < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                const el = e.target;
                const target = parseFloat(el.dataset.target);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    },
    { threshold: 0.5 },
);
document
    .querySelectorAll(".counting")
    .forEach((el) => counterObserver.observe(el));

/* ---------- MOUSE PARALLAX ---------- */
const hero = document.querySelector(".hero");
if (hero) {
    const orbs = hero.querySelectorAll(".orb");
    const visual = hero.querySelector(".hero-visual");
    document.addEventListener("mousemove", (e) => {
        const mx = (e.clientX / window.innerWidth - 0.5) * 20;
        const my = (e.clientY / window.innerHeight - 0.5) * 20;
        orbs.forEach((orb) => {
            orb.style.transform = `translate(${mx * 0.5}px, ${my * 0.5}px)`;
        });
        if (visual)
            visual.style.transform = `perspective(1000px) rotateY(${mx * 0.03}deg) rotateX(${-my * 0.02}deg)`;
    });
}

/* ---------- SMOOTH ANCHORS ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
        const target = document.querySelector(a.getAttribute("href"));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});
