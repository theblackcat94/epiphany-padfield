const REVEAL_PHONE_DISPLAY = "0400 000 000";
const REVEAL_PHONE_TEL = "+61400000000";
const REVEAL_EMAIL = "enquiries@padfield.example";

const toggle = document.getElementById("themeToggle");

function paintToggle(theme) {
  if (!toggle) return;
  const next = theme === "dark" ? "light" : "dark";
  toggle.textContent = next === "light" ? "Light" : "Dark";
  toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  toggle.setAttribute("aria-label", "Switch to " + next + " mode");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#F8F9F7" : "#1A1E21");
}

paintToggle(document.documentElement.getAttribute("data-theme") || "dark");

if (toggle) {
  toggle.addEventListener("click", function () {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("padfield-theme", next); } catch (e) {}
    paintToggle(next);
  });
}

const navToggle = document.getElementById("navToggle");
const header = document.querySelector(".nav");
const siteNav = document.getElementById("siteNav");

function closeNav() {
  if (!header || !navToggle) return;
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle && header && siteNav) {
  navToggle.addEventListener("click", function () {
    const open = header.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  siteNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wide = window.matchMedia("(min-width: 961px)").matches;

const heroMedia = document.querySelector(".hero-media");
if (heroMedia && !reduceMotion && wide) {
  let ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      const y = Math.min(window.scrollY, 280);
      heroMedia.style.transform = "translate3d(0," + (y * 0.08) + "px,0) scale(1.06)";
      ticking = false;
    });
  }, { passive: true });
}

if (!reduceMotion && "IntersectionObserver" in window) {
  const seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      seen.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { seen.observe(el); });
} else {
  document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
}

const form = document.getElementById("enquiry");
const status = document.getElementById("formStatus");

if (form && status) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.classList.remove("is-error");
    status.textContent = "";
    if (form.website && form.website.value) return;
    if (!form.reportValidity()) {
      status.classList.add("is-error");
      status.textContent = "Add the missing details, then send again.";
      return;
    }

    const reveal = document.getElementById("contactReveal");
    const phone = document.getElementById("revealPhone");
    const email = document.getElementById("revealEmail");
    if (phone) {
      phone.textContent = REVEAL_PHONE_DISPLAY;
      phone.href = "tel:" + REVEAL_PHONE_TEL;
    }
    if (email) {
      email.textContent = REVEAL_EMAIL;
      email.href = "mailto:" + REVEAL_EMAIL;
    }
    if (reveal) reveal.hidden = false;
    status.textContent = "The phone number and email are below.";
  });
}
