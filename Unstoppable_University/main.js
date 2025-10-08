// ================== SHOOTING STARS CANVAS ================== //
const canvas = document.getElementById("heroCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const stars = [];
  const numStars = 120;

  class Star {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
        this.reset();
        this.y = 0;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  }

  for (let i = 0; i < numStars; i++) stars.push(new Star());

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 100, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => { star.update(); star.draw(); });
    requestAnimationFrame(animateStars);
  }
  animateStars();
}

// ================== HAMBURGER MENU ================== //
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("toggle");
  });
}

// ================== DRAGGABLE SLIDERS ================== //
function setupDraggableSlider(slider) {
  if (!slider) return;
  let isDown = false;
  let startX, scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  ["mouseleave", "mouseup"].forEach(event => {
    slider.addEventListener(event, () => {
      isDown = false;
      slider.classList.remove("active");
    });
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
}

setupDraggableSlider(document.getElementById("campusSlider"));
setupDraggableSlider(document.getElementById("testimonialSlider"));

// ================== TYPEWRITER EFFECT ================== //
const typewriterElement = document.getElementById("typewriter");
if (typewriterElement) {
  const text = "Shaping Minds. Building Leaders. Inspiring the Future.";
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      typewriterElement.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 80);
    }
  }
  typeWriter();
}

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
      bottom: "20px",
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

// ================== CONTACT CANVAS ANIMATION ================== //
const contactCanvas = document.getElementById("contact-bg");
if (contactCanvas) {
  const ctx = contactCanvas.getContext("2d");
  contactCanvas.width = window.innerWidth;
  contactCanvas.height = window.innerHeight;

  let particles = [];
  const colors = ["#facc15", "#00ffcc", "#ffffff", "#064e3b"];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * contactCanvas.width,
      y: Math.random() * contactCanvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5),
      dy: (Math.random() - 0.5),
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function animate() {
    ctx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > contactCanvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > contactCanvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    contactCanvas.width = window.innerWidth;
    contactCanvas.height = window.innerHeight;
  });
}
