/* =========================
   POSH — Interaction & Data
   ========================= */

/**
 * ARTIST DIRECTORY
 * Replace placeholders as you get final details.
 * - services: hair, esthetics, injectables
 * - images: picsum seeds to guarantee loading; swap with real images later
 *   Search for "UPDATE PHOTO:" comments to find them quickly.
 */
const ARTISTS = [
  {
    id: "owner-cyndie",
    name: "Cyndie Phillips",
    role: "Owner • Stylist",
    services: ["hair"],
    // UPDATE PHOTO: Owner headshot
    photo: "assets/CyndiePhillips.jpg",
    blurb:
      "Experienced stylist specializing in precision cuts, classic color, and healthy hair.",
    email: "cyndie@poshnewberg.com", // TODO: update when ready
    phone: "(503) 538-7056",
    links: {
      website: null, // e.g. "https://poshnewberg.com/cyndie"
      booking: "#contact",
      instagram: "#",
    },
  },
  {
    id: "hair-riley",
    name: "Riley Johnisee",
    role: "Stylist",
    services: ["hair"],
    // UPDATE PHOTO: Riley headshot
    photo: "assets/Riley-profile-img.jpg",
    blurb: "Cut, color, and styles tailored to your vibe. Book online.",
    email: "riley@poshnewberg.com", // placeholder
    phone: "(503) 555-0111", // placeholder
    links: {
      website: "https://hairbyrileyyy.glossgenius.com",
      booking: "https://hairbyrileyyy.glossgenius.com",
      instagram: "#",
    },
  },
  {
    id: "esthetics-kaeli",
    name: "Kaeli Tegland",
    role: "Certified Advanced Esthetician",
    services: ["esthetics"],
    photo: "assets/Kaeli-profile-img.jpeg",
    blurb:
      "Skin-first treatments, brows, and lash lifts. Explore services and book online.",
    email: "info@simplyskinlaserllc.com", // public-facing inbox (placeholder)
    phone: "(971) 281-9373",
    links: {
      website: "https://www.simplyskinlaserllc.com",
      booking:
        "https://book.squareup.com/appointments/lbgth1486i8nxh/location/LHG8GB536NJCW/services?buttonTextColor=ffffff&color=000000&locale=en&referrer=so",
      instagram: "https://www.instagram.com/simplyskinlaserllc/",
    },
  },
  {
    id: "inject-dottie",
    name: "Dottie Massey",
    role: "Nurse Injector • Wine Country Beauty & Wellness",
    services: ["injectables"],
    // UPDATE PHOTO: Dottie headshot
    photo: "assets/Dottie-profile-img.jpg",
    blurb:
      "Botox and wellness services in a comfortable, client-first setting.",
    email: "dottie@poshnewberg.com", // placeholder
    phone: "(503) 710-7494",
    links: {
      website: "https://example.com/wcbw", // placeholder until she has one
      booking: "#contact",
      instagram: "#",
    },
  },
];

/* DOM refs */
const artistGrid = document.getElementById("artistGrid");
const serviceFilter = document.getElementById("serviceFilter");
const contactArtistSelect = document.getElementById("artist");
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");
const progressBar = document.getElementById("progressBar");
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");

// Sync --header-h to the actual fixed header height
function syncHeaderHeight() {
  const h =
    document.querySelector(".site-header")?.getBoundingClientRect().height ||
    64;
  document.documentElement.style.setProperty("--header-h", `${h}px`);
}
syncHeaderHeight();
window.addEventListener("load", syncHeaderHeight);
window.addEventListener("resize", syncHeaderHeight);

/* Render Artist Cards */
function renderArtists(filter = "all") {
  if (!artistGrid) return;
  const items =
    filter === "all"
      ? ARTISTS
      : ARTISTS.filter((a) => a.services.includes(filter));

  artistGrid.innerHTML = items
    .map((a) => {
      const tags = a.services
        .map((s) => `<span class="tag">${labelForService(s)}</span>`)
        .join("");
      const website = a.links.website
        ? `<a class="btn btn-outline" href="${a.links.website}" target="_blank" rel="noopener">Website</a>`
        : "";
      const booking = a.links.booking
        ? `<a class="btn btn-primary" href="${a.links.booking}" target="${
            a.links.booking.startsWith("http") ? "_blank" : "_self"
          }" rel="noopener">Book</a>`
        : "";
      const insta = a.links.instagram
        ? `<a class="btn btn-outline" href="${a.links.instagram}" target="_blank" rel="noopener">Instagram</a>`
        : "";

      return `
      <article class="card" data-services="${a.services.join(
        ","
      )}" tabindex="0">
        <div class="media">
          <img src="${a.photo}" alt="${a.name} — ${
        a.role
      }" loading="lazy" decoding="async" />
        </div>
        <div class="body">
          <h3>${a.name}</h3>
          <div class="role">${a.role}</div>
          <div class="tags">${tags}</div>
        </div>
        <div class="reveal" aria-hidden="true">
          <p>${a.blurb}</p>
          <p><a href="mailto:${a.email}">${
        a.email
      }</a><br><a href="tel:${sanitizePhone(a.phone)}">${a.phone}</a></p>
          <div class="actions">${website}${booking}${insta}</div>
        </div>
      </article>
    `;
    })
    .join("");

  // Tap-to-toggle for mobile (non-link area)
  artistGrid.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      card.classList.toggle("show");
    });
  });
}

function labelForService(key) {
  const map = {
    hair: "Hair",
    esthetics: "Aesthetics",
    injectables: "Injectables",
  };
  return map[key] ?? key;
}
function sanitizePhone(raw) {
  return raw.replace(/[^\d+]/g, "");
}

/* Contact dropdown in sync with directory */
function populateContactArtists() {
  if (!contactArtistSelect) return;
  const opts = ARTISTS.map(
    (a) => `<option value="${a.id}">${a.name} — ${a.role}</option>`
  ).join("");
  contactArtistSelect.insertAdjacentHTML("beforeend", opts);
}

/* Filter */
serviceFilter?.addEventListener("change", (e) => renderArtists(e.target.value));

/* Progress bar */
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}
document.addEventListener("scroll", updateProgress, { passive: true });

/* Mobile nav toggle */
navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

/* Smooth scroll for internal links */
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href");
  const target = document.querySelector(id);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    siteNav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

/* Reduced motion */
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Lightweight form handling (client only) */
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !email || !message) {
    setFormMsg("Please fill in name, email, and your message.", "error");
    return;
  }

  // TODO: Netlify Forms — add:
  // <input type="hidden" name="form-name" value="contact"> and set <form name="contact" method="POST" data-netlify="true">
  form.reset();
  setFormMsg("Thanks! Your message has been sent. We'll reply soon.", "ok");
});

function setFormMsg(text, type = "ok") {
  formMsg.textContent = text;
  formMsg.style.color =
    type === "ok"
      ? "var(--ok)"
      : type === "warn"
      ? "var(--warn)"
      : "var(--err)";
}

/* Footer year */
document.getElementById("year").textContent = new Date().getFullYear();

/* Init */
renderArtists("all");
populateContactArtists();
updateProgress();
