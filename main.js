const ENQUIRY_EMAIL = "padfieldepiphany@gmail.com";

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

const video = document.getElementById("heroVideo");
if (video && !reduceMotion && wide) {
  video.src = "assets/hero.mp4";
  video.play().catch(function () {});
}

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

const emailLink = document.getElementById("emailLink");
if (emailLink) {
  emailLink.textContent = ENQUIRY_EMAIL;
  emailLink.href = "mailto:" + ENQUIRY_EMAIL;
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

    const data = new FormData(form);
    const lines = [
      "Name: " + data.get("name"),
      "Organisation: " + (data.get("organisation") || "—"),
      "Email: " + data.get("email"),
      "Phone: " + (data.get("phone") || "—"),
      "Service: " + data.get("service"),
      "",
      data.get("message")
    ];
    const href = "mailto:" + ENQUIRY_EMAIL
      + "?subject=" + encodeURIComponent("Enquiry — " + data.get("service"))
      + "&body=" + encodeURIComponent(lines.join("\n"));

    status.textContent = "Your email app should open with this message addressed to " + ENQUIRY_EMAIL + ". If nothing opens, email that address direct.";
    window.location.href = href;
  });
}
