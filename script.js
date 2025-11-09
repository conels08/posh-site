/* =========================
   POSH — Interaction & Data
   ========================= */

/**
 * ARTIST DIRECTORY
 * Replace placeholders with real people as you get them.
 * - 'services' tags drive the filter.
 * - 'links' include website/booking/socials. Use null for any you don't have yet.
 * - Images are Unsplash placeholders; swap file paths or URLs when ready.
 */
const ARTISTS = [
  {
    id: "owner-cyndie",
    name: "Cyndie Nelsen", // TODO: confirm spelling/name
    role: "Owner • Master Stylist",
    services: ["hair"],
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    blurb:
      "Precision cuts, color, and transformative styling with a soft, modern finish.",
    email: "cyndie@poshnewberg.com", // TODO: update
    phone: "(503) 555-0101", // TODO: update
    links: {
      website: null, // e.g., "https://poshnewberg.com/cyndie"
      booking: "#contact",
      instagram: "#",
    },
  },
  {
    id: "stylist-avery",
    name: "Avery Hart",
    role: "Color Specialist",
    services: ["hair"],
    photo:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
    blurb: "Dimensional color, blonding, and lived-in looks.",
    email: "avery@poshnewberg.com",
    phone: "(503) 555-0102",
    links: {
      website: "https://example.com/avery", // TODO: replace with tenant's real site
      booking: "https://calendly.com/example-avery", // TODO
      instagram: "https://instagram.com/avery_hair", // TODO
    },
  },
  {
    id: "nails-luna",
    name: "Luna Park",
    role: "Nail Artist",
    services: ["nails"],
    photo:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=800&auto=format&fit=crop",
    blurb: "Structured gel, minimal art, and healthy nail care.",
    email: "luna@poshnewberg.com",
    phone: "(503) 555-0103",
    links: {
      website: "https://example.com/luna", // TODO
      booking: "https://squareup.com/appointments/book/yourlink", // TODO
      instagram: "https://instagram.com/luna_nails", // TODO
    },
  },
  {
    id: "esthetics-mira",
    name: "Mira Stone",
    role: "Esthetician",
    services: ["esthetics"],
    photo:
      "https://images.unsplash.com/photo-1522335789203-dc7f5f567f64?q=80&w=800&auto=format&fit=crop",
    blurb:
      "Targeted facials, brows, and lash lifts with a skin-first approach.",
    email: "mira@poshnewberg.com",
    phone: "(503) 555-0104",
    links: {
      website: "https://example.com/mira", // TODO
      booking: "#contact",
      instagram: "#",
    },
  },
  {
    id: "tattoo-river",
    name: "River Cole",
    role: "Tattoo Artist",
    services: ["tattoo"],
    photo:
      "https://images.unsplash.com/photo-1519415943484-9fa18778aa1d?q=80&w=800&auto=format&fit=crop",
    blurb: "Custom linework and fine-detail pieces by appointment.",
    email: "river@poshnewberg.com",
    phone: "(503) 555-0105",
    links: {
      website: "https://example.com/river", // TODO
      booking: "mailto:river@poshnewberg.com?subject=Tattoo%20Inquiry",
      instagram: "https://instagram.com/river_inks", // TODO
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
          <div class="actions">
            ${website}${booking}${insta}
          </div>
        </div>
      </article>
    `;
    })
    .join("");

  // Card tap behavior for mobile (toggle reveal)
  artistGrid.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", (e) => {
      // Only toggle if clicking non-link area
      if (e.target.closest("a")) return;
      card.classList.toggle("show");
    });
  });
}

function labelForService(key) {
  const map = {
    hair: "Hair",
    nails: "Nails",
    esthetics: "Esthetics",
    tattoo: "Tattoo",
  };
  return map[key] ?? key;
}
function sanitizePhone(raw) {
  return raw.replace(/[^\d+]/g, "");
}

/* Populate contact form artist dropdown to keep in sync with directory */
function populateContactArtists() {
  if (!contactArtistSelect) return;
  const opts = ARTISTS.map(
    (a) => `<option value="${a.id}">${a.name} — ${a.role}</option>`
  ).join("");
  contactArtistSelect.insertAdjacentHTML("beforeend", opts);
}

/* Service filter */
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

/* Reduced motion check */
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Lightweight client-side form validation + faux submit */
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

  // TODO: Wire to Netlify Forms or a serverless endpoint.
  // Netlify example: add name="contact" hidden form-name input and action="/" method="POST"
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

/* Initial render */
renderArtists("all");
populateContactArtists();
updateProgress();
