// Starry background canvas animation
const canvas = document.getElementById("starry-canvas");
const ctx = canvas.getContext("2d");
let width, height;
const stars = [];

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

function createStars() {
  const numStars = (width * height) / 2000;
  stars.length = 0;
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.1 + 0.05,
      opacity: Math.random() * 0.5 + 0.5,
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.fill();
  });
}

function animateStars() {
  stars.forEach((star) => {
    star.y += star.speed;
    if (star.y > height) {
      star.y = 0;
      star.x = Math.random() * width;
    }
  });
  drawStars();
  requestAnimationFrame(animateStars);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  createStars();
});

window.onload = function () {
  resizeCanvas();
  createStars();
  animateStars();

  // GSAP and ScrollTrigger setup
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(Draggable);

  // Animate on load
  gsap.from("#main-nav", {
    opacity: 0,
    y: -50,
    duration: 1,
    ease: "power2.out",
  });
  gsap.from(".hero-content > *", {
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 1,
    ease: "power2.out",
    delay: 0.5,
  });

  // Intersection Observer for section animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        const icon = entry.target.querySelector(".animated-icon");
        const orb = entry.target.querySelector(".animated-orb");
        if (icon) {
          gsap.fromTo(
            icon,
            {
              scale: 0,
              opacity: 0,
              rotation: 180,
            },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 1.5,
              ease: "back.out(1.7)",
            }
          );
        }
        if (orb) {
          gsap.fromTo(
            orb,
            {
              scale: 0,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 2,
              ease: "elastic.out(1, 0.5)",
            }
          );
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".section-container").forEach((section) => {
    observer.observe(section);
  });

  // Parallax effect on Hero section
  gsap.to(".hero-bg", {
    backgroundPositionY: "50%",
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-bg",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Navbar on scroll
  const mainNav = document.getElementById("main-nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      mainNav.classList.add("scrolled");
    } else {
      mainNav.classList.remove("scrolled");
    }
  });

  // Mobile menu functionality
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeMobileMenuBtn = document.getElementById("close-mobile-menu-btn");

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.add("active");
  });

  closeMobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });

  document.querySelectorAll("#mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
    });
  });

  // Toggle expert text functionality
  window.toggleExpertText = function (id) {
    const element = document.getElementById(id);
    const isExpanded = element.classList.toggle("expanded");
    element.setAttribute("aria-hidden", !isExpanded);
  };
};
