// 🌐 C3 Frontend Script
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.getElementById("navLinks");
  const hamburger = document.getElementById("hamburger");
  const navbar = document.querySelector(".navbar");
  const themeToggle = document.getElementById("themeToggle");

  /* ==========================================================
     📱 MOBILE NAVIGATION (NO OVERLAY VERSION)
  ========================================================== */
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const icon = hamburger.querySelector("i");
      const isActive = navLinks.classList.toggle("active");
      icon.classList.replace(isActive ? "fa-bars" : "fa-times", isActive ? "fa-times" : "fa-bars");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 900) {
          navLinks.classList.remove("active");
          hamburger.querySelector("i").classList.replace("fa-times", "fa-bars");
        }
      });
    });
  }

  /* ==========================================================
     🧭 NAVBAR SCROLL ANIMATION + ACTIVE SECTION HIGHLIGHT
  ========================================================== */
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");

    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(".nav-links a").forEach((link) => link.classList.remove("active"));
        const currentLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        if (currentLink) currentLink.classList.add("active");
      }
    });
  });

  /* ==========================================================
     🌙 THEME TOGGLE (Dark / Light)
  ========================================================== */
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      const icon = themeToggle.querySelector("i");

      if (document.body.classList.contains("light-mode")) {
        icon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("theme", "light");
      } else {
        icon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("theme", "dark");
      }
    });

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.body.classList.add("light-mode");
      themeToggle.querySelector("i").classList.replace("fa-moon", "fa-sun");
    }
  }

  /* ==========================================================
     ⚡ FETCH EVENTS FROM BACKEND
  ========================================================== */
  async function fetchEvents() {
    const eventsGrid = document.getElementById("eventsGrid");
    if (!eventsGrid) return;

    try {
      const res = await fetch("/allevents");
      if (!res.ok) throw new Error("Failed to fetch events");
      const events = await res.json();
      displayEvents(events);
    } catch (err) {
      console.error("Error fetching events:", err);
      eventsGrid.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Unable to load events.</div>`;
    }
  }

  function displayEvents(events) {
    const grid = document.getElementById("eventsGrid");
    grid.innerHTML = "";

    if (!events || events.length === 0) {
      grid.innerHTML = `<p class="no-events">No upcoming events yet 🚫</p>`;
      return;
    }

    events.forEach((e) => {
      const date = e.date
        ? new Date(e.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "TBA";

      const registerLink = e.link?.trim() ? e.link : "https://forms.gle/XYZ123";

      const html = `
        <div class="event-card" data-aos="fade-up">
          <div class="event-image-box">
            <img src="${e.imagelink || "/assets/img/default-event.jpg"}" alt="${e.name}" class="event-image" />
          </div>
          <div class="event-info">
            <h3>${e.name}</h3>
            <p>${e.description || "No description available."}</p>
            <div class="event-meta">
              <span><i class="far fa-calendar-alt"></i> ${date}</span>
              <span><i class="fas fa-map-marker-alt"></i> ${e.location || "TBA"}</span>
              <span><i class="fas fa-trophy"></i> ${e.prize || "Exciting Rewards"}</span>
            </div>
            <a href="${registerLink}" target="_blank" class="event-btn">Register Now</a>
          </div>
        </div>`;
      grid.insertAdjacentHTML("beforeend", html);
    });
  }

  /* ==========================================================
     📢 FETCH NOTICES
  ========================================================== */
  async function fetchNotices() {
    const container = document.getElementById("noticesContainer");
    if (!container) return;

    try {
      const res = await fetch("/api/notices");
      if (!res.ok) throw new Error("Failed to fetch notices");
      const notices = await res.json();
      displayNotices(notices);
    } catch (err) {
      console.error("Error fetching notices:", err);
      container.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Unable to load notices.</div>`;
    }
  }

  function displayNotices(notices) {
    const container = document.getElementById("noticesContainer");
    container.innerHTML = "";

    if (!notices?.length) {
      container.innerHTML = `<p>No new notices at the moment 📭</p>`;
      return;
    }

    notices.forEach((n) => {
      const date = new Date(n.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const noticeHTML = `
        <div class="notice-item" data-aos="fade-up">
          <h4>${n.title}</h4>
          <p>${n.message}</p>
          <small><i class="far fa-clock"></i> ${date}</small>
        </div>`;
      container.insertAdjacentHTML("beforeend", noticeHTML);
    });
  }

  // 🧩 INIT
  fetchEvents();
  fetchNotices();
});

/* ==========================================================
   🌌 MATRIX BACKGROUND ANIMATION (Safe single instance)
========================================================== */
if (!window.matrixInitialized) {
  const canvas = document.getElementById("matrixCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const chars = "01アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function drawMatrix() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00e0ff";
      ctx.font = fontSize + "px monospace";

      drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        ctx.fillText(text, x, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }

    setInterval(drawMatrix, 35);
    window.matrixInitialized = true;
  }
}

/* ==========================================================
   🚀 LOGO PRELOADER
========================================================== */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) setTimeout(() => preloader.classList.add("hidden"), 500);
});
