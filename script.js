// Navbar shrink on scroll
window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    navbar.classList.toggle("shrink", window.scrollY > 50);
  });
  
// ================== EMAILJS CONTACT FORM ================== //
(function() {
  emailjs.init("OPqzNEnYbYR_ub7Q3"); // Replace with your EmailJS Public Key
})();

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    document.getElementById("loader").style.display = "block";

    emailjs.sendForm("service_07dawdw", "template_psjji8g", this)
    .then(() => {
      document.getElementById("loader").style.display = "none";
    const popup = document.createElement("div");
    popup.textContent = "✅ Message sent successfully!";
    Object.assign(popup.style, {
      position: "fixed",
      bottom: "80px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "linear-gradient(90deg, #00c853, #64dd17)",
      color: "white",
      padding: "12px 20px",
      borderRadius: "30px",
      fontSize: "15px",
      fontWeight: "600",
      boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
      zIndex: "9999",
      opacity: "0",
      transition: "opacity 0.6s ease",
    });

    document.body.appendChild(popup);

    // Fade in
    setTimeout(() => { popup.style.opacity = "1"; }, 100);

    // Fade out and remove
    setTimeout(() => {
      popup.style.opacity = "0";
      setTimeout(() => popup.remove(), 600);
    }, 5000);

    e.target.reset();
  })

    .catch(() => {
      const popup = document.createElement("div");
      popup.textContent = "❌ Failed to send message. Try again!";
      Object.assign(popup.style, {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "linear-gradient(90deg, #c62828, #ff5252)",
        color: "white",
        padding: "12px 20px",
        borderRadius: "30px",
        fontSize: "15px",
        fontWeight: "600",
        boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
        zIndex: "9999",
      });
      document.body.appendChild(popup);
      setTimeout(() => popup.remove(), 5000);
    });
  });
}

// Typewriter Effect with Blinking Cursor
const typewriterElement = document.getElementById("typewriter");
const cursor = document.createElement("span");
cursor.classList.add("cursor");
cursor.textContent = "|";
typewriterElement.after(cursor);

const words = ["Frontend Development", "UI/UX Design", "Responsive Websites", "Creative Coding"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  let currentWord = words[wordIndex];

  if (!isDeleting) {
    // Typing letters
    typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentWord.length) {
      // Word fully typed → pause before deleting
      isDeleting = true;
      setTimeout(typeEffect, 2500); // keep full word visible
      return;
    }
  } else {
    // Deleting letters
    typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      // Finished deleting → move to next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length; // loop forever
    }
  }

  // Adjust typing speed
  const speed = isDeleting ? 60 : 120;
  setTimeout(typeEffect, speed);
}

// Start the effect
typeEffect();

// Animate Progress Bars on Scroll
const progressBars = document.querySelectorAll(".progress");

function animateProgress(bar) {
  const value = bar.getAttribute("data-skill");
  let count = 0;
  const span = bar.querySelector("span");

  // Fill bar
  bar.style.width = value + "%";

  // Animate percentage count
  const interval = setInterval(() => {
    if (count >= value) {
      clearInterval(interval);
    } else {
      count++;
      span.textContent = count + "%";
      span.style.opacity = 1;
    }
  }, 20); // speed of counting
}

function resetProgress(bar) {
  bar.style.width = "0";
  const span = bar.querySelector("span");
  span.textContent = "0%";
  span.style.opacity = 0;
}

// Intersection Observer to trigger animation
const options = { threshold: 0.5 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      progressBars.forEach((bar, i) => {
        setTimeout(() => animateProgress(bar), i * 400); // stagger effect
      });
    } else {
      progressBars.forEach(bar => resetProgress(bar));
    }
  });
}, options);
progressBars.forEach(bar => observer.observe(bar));

// ================== NAVBAR TOGGLE ================== //
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
  });
}

//--------------------- HERO CANVAS ANIMATION (Upgraded) --------------------//
const canvas = document.getElementById("heroCanvas");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createParticles() {
  const numParticles = 40; // same particle count, adjust if you want more
  particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1.5, // slightly larger
      speedX: (Math.random() - 0.5) * 0.45, // a bit faster
      speedY: (Math.random() - 0.5) * 0.45
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw and animate particles
  particles.forEach(p => {
    p.x += p.speedX * 1.5;
    p.y += p.speedY * 1.5;

    // Wrap around edges
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    // Glow effect
    ctx.shadowBlur = 6;
    ctx.shadowColor = "rgba(0, 188, 212, 0.6)";
    ctx.fillStyle = "rgba(0, 188, 212, 0.4)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // reset blur
  });

  // Connection lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
      if (dist < 120) {
        ctx.strokeStyle = "rgba(0, 188, 212, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

createParticles();
animateParticles();