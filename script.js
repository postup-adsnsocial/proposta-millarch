document.documentElement.classList.add("js");

const header = document.querySelector("[data-elevate]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll(".reveal");

function setHeaderElevation() {
  header.classList.toggle("is-elevated", window.scrollY > 12);
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  navLinks.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menu");
}

function setupNavigation() {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });
}

function setupRevealAnimations() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

window.addEventListener("scroll", setHeaderElevation, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 920) {
    closeMenu();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  setHeaderElevation();
  setupNavigation();
  setupRevealAnimations();
});
