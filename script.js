/* =========================================================
   MANINDER KAUR — PORTFOLIO
   Vanilla JS: nav, theme, reveal, timeline, contact form.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById("siteHeader");
  const onScrollHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Hamburger / mobile nav ---------- */
  const hamburger = document.getElementById("hamburgerBtn");
  const mainNav = document.getElementById("mainNav");

  function closeMenu() {
    hamburger.classList.remove("is-open");
    mainNav.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open navigation menu");
  }
  function openMenu() {
    hamburger.classList.add("is-open");
    mainNav.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Close navigation menu");
  }
  hamburger.addEventListener("click", () => {
    const isOpen = mainNav.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Smooth scroll (with header offset) ---------- */
  const headerHeight = () => header.offsetHeight;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight() + 1;
      window.scrollTo({ top, behavior: "smooth" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  const scrollCue = document.getElementById("scrollCue");
  if (scrollCue) {
    scrollCue.addEventListener("click", () => {
      const about = document.getElementById("about");
      const top = about.getBoundingClientRect().top + window.scrollY - headerHeight() + 1;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active-link", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: `-${100}px 0px -60% 0px`, threshold: 0.01 }
  );
  sections.forEach((sec) => navObserver.observe(sec));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min((i % 6) * 60, 240)}ms`;
    revealObserver.observe(el);
  });

  /* ---------- Animated counters (education scores — real data) ---------- */
  const scoreEls = document.querySelectorAll(".edu-score[data-count]");
  const scoreObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute("data-count"));
        const suffix = el.querySelector("span") ? el.querySelector("span").outerHTML : "";
        const duration = 1100;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = (target * eased).toFixed(target % 1 !== 0 ? 2 : 0);
          el.innerHTML = `${value}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  scoreEls.forEach((el) => scoreObserver.observe(el));

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById("backToTop");
  window.addEventListener(
    "scroll",
    () => backToTop.classList.toggle("is-visible", window.scrollY > 600),
    { passive: true }
  );
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Toast helper ---------- */
  const toast = document.getElementById("toast");
  let toastTimer = null;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  /* ---------- Copy email ---------- */
  const copyBtn = document.getElementById("copyEmailBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.getAttribute("data-email");
      try {
        await navigator.clipboard.writeText(email);
        showToast("Email copied!");
      } catch (err) {
        // Fallback for older browsers
        const temp = document.createElement("textarea");
        temp.value = email;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        try {
          document.execCommand("copy");
          showToast("Email copied!");
        } catch (fallbackErr) {
          showToast("Could not copy email");
        }
        document.body.removeChild(temp);
      }
    });
  }

  /* ---------- Theme toggle (persists per session only) ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  let currentTheme = "light";

  function applyTheme(theme) {
    currentTheme = theme;
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeToggle.setAttribute("aria-pressed", "true");
      themeToggle.setAttribute("aria-label", "Switch to light mode");
    } else {
      root.removeAttribute("data-theme");
      themeToggle.setAttribute("aria-pressed", "false");
      themeToggle.setAttribute("aria-label", "Switch to dark mode");
    }
  }

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");

  themeToggle.addEventListener("click", () => {
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });

  /* ---------- Profile image fallback ---------- */
  const profileImg = document.getElementById("profileImg");
  if (profileImg) {
    profileImg.addEventListener("error", () => {
      profileImg.style.display = "none";
    });
  }

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  const validators = {
    name: (value) => (value.trim().length >= 2 ? "" : "Please enter your name."),
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Please enter a valid email address.",
    message: (value) => (value.trim().length >= 10 ? "" : "Message should be at least 10 characters."),
  };

  function validateField(field) {
    const value = field.value;
    const errorEl = document.getElementById(`err-${field.name}`);
    const message = validators[field.name] ? validators[field.name](value) : "";
    field.closest(".form-field").classList.toggle("has-error", Boolean(message));
    if (errorEl) errorEl.textContent = message;
    return !message;
  }

  if (form) {
    ["name", "email", "message"].forEach((fieldName) => {
      const field = form.elements[fieldName];
      if (field) field.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;
      ["name", "email", "message"].forEach((fieldName) => {
        const field = form.elements[fieldName];
        if (field && !validateField(field)) isValid = false;
      });

      if (!isValid) {
        formStatus.style.color = "#C0442F";
        formStatus.textContent = "Please correct the highlighted fields.";
        return;
      }

      formStatus.style.color = "var(--teal-600)";
      formStatus.textContent = "Thank you — your message has been noted. Maninder will get back to you soon.";
      form.reset();
      showToast("Message sent!");
    });
  }
})();
