
// MENÚ PARA CELULARES

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];

const setMenuOpen = open => {
  nav.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
};

menuButton.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

navLinks.forEach(link => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("click", event => {
  if (!nav.contains(event.target) && !menuButton.contains(event.target)) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuButton.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 700) {
    setMenuOpen(false);
  }
});

const header = document.querySelector(".site-header");
const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const navObserver = new IntersectionObserver(entries => {
    const activeEntry = entries
      .filter(entry => entry.isIntersecting)
      .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)[0];

    if (!activeEntry) {
      return;
    }

    navLinks.forEach(link => link.removeAttribute("aria-current"));
    navLinks
      .find(link => link.getAttribute("href") === `#${activeEntry.target.id}`)
      ?.setAttribute("aria-current", "location");
  }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });

  sections.forEach(section => navObserver.observe(section));
}

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealTargets = document.querySelectorAll(
    ".intro-label, .intro-grid, .values-row > div, .mission-grid > *, .section-heading, .work-card, .more-help, .impact-copy, .impact-visual, .ceo-photo-wrap, .ceo-copy, .ceo-experience-card, .family-photo-wrap, .family-copy, .family-member, .donate-grid > *, .contact-card, .contact-bottom"
  );

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${(index % 3) * 65}ms`);
    revealObserver.observe(element);
  });
}

// AÑO AUTOMÁTICO DEL PIE DE PÁGINA

document.getElementById("year").textContent =
  new Date().getFullYear();

// ENVÍO POR CORREO

const donationForm = document.getElementById("donation-form");
const collaborationSelect = donationForm.elements.namedItem("kind");

document.querySelectorAll(".donate-tags button[data-kind]").forEach(button => {
  button.addEventListener("click", () => {
    collaborationSelect.value = button.dataset.kind;
    donationForm.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center"
    });
    collaborationSelect.focus({ preventScroll: true });
  });
});

donationForm.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(donationForm);
  const message = [
    `Nombre: ${formData.get("name")}`,
    `Correo o teléfono: ${formData.get("contact")}`,
    `Tipo de colaboración: ${formData.get("kind")}`,
    `Mensaje: ${formData.get("message") || "Sin mensaje adicional"}`
  ].join("\n");
  const subject = "Interés en colaborar - Fundación Arias";
  const composeUrl = new URL("https://mail.google.com/mail/");

  composeUrl.searchParams.set("view", "cm");
  composeUrl.searchParams.set("fs", "1");
  composeUrl.searchParams.set("to", "fundacionariasycalidaddevida@gmail.com");
  composeUrl.searchParams.set("su", subject);
  composeUrl.searchParams.set("body", message);

  window.location.assign(composeUrl);
});
