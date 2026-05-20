// MOBILE MENU

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});

// CLOSE MENU WHEN CLICKING LINKS

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

    });

});

/* ACTIVE NAVBAR LINK */

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop;

        if (pageYOffset >= sectionTop - 200) {

            current = section.getAttribute("id");

        }

    });

    navItems.forEach(link => {

        link.classList.remove("active-link");

        if (link.getAttribute("href").includes(current)) {

            link.classList.add("active-link");

        }

    });

});

/* SCROLL REVEAL */

ScrollReveal({

    distance: '70px',
    duration: 2000,
    delay: 200,
    reset: false

});

// HERO

ScrollReveal().reveal('.hero-text', {

    origin: 'left'

});

ScrollReveal().reveal('.hero-image', {

    origin: 'right'

});

// ABOUT

ScrollReveal().reveal('.about-text', {

    origin: 'bottom'

});

// SKILLS

ScrollReveal().reveal('.skill', {

    origin: 'bottom',
    interval: 100

});

// PROJECTS

ScrollReveal().reveal('.project-card', {

    origin: 'bottom',
    interval: 150

});

// CONTACT

ScrollReveal().reveal('.contact', {

    origin: 'bottom'

});

// FLOATING ANIMATION ON SCROLL

window.addEventListener("scroll", () => {

    const scrollY = window.scrollY;

    const heroImage = document.querySelector(".hero-image");

    heroImage.style.transform = `translateY(${scrollY * 0.05}px)`;

});

/* TYPING EFFECT */

var typed = new Typed(".typing", {

    strings: [

        "BS Computer Engineering Student",
        "Full Stack Developer",
        "Backend Developer",
        "AI Enthusiast",
        "Android Developer",
        "Cybersecurity Learner"

    ],

    typeSpeed: 70,
    backSpeed: 45,
    backDelay: 1500,
    startDelay: 500,
    loop: true

});

/* SMOOTH FADE-IN ON PAGE LOAD */

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});