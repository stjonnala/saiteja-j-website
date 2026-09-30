document.addEventListener("DOMContentLoaded", () => {

  // ── Footer year ──────────────────────────────────────────
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Active nav link ──────────────────────────────────────
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar .nav-link").forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage || (linkPage === "index.html" && currentPage === "")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // ── Navbar brand icon ────────────────────────────────────
  const brand = document.querySelector(".navbar-brand");
  if (brand) {
    brand.innerHTML = `<i class="bi bi-cpu-fill me-2" style="color:#7aa7ff;font-size:.9em"></i>${brand.textContent.trim()}`;
  }

  // ── Nav link icons ───────────────────────────────────────
  const navIcons = {
    "index.html":                    "bi-house-fill",
    "about.html":                    "bi-person-fill",
    "innovation.html":               "bi-lightbulb-fill",
    "leadership_consulting.html":    "bi-briefcase-fill",
    "inspiration_recognitions.html": "bi-award-fill",
    "public-influencer.html":        "bi-megaphone-fill",
    "blogs.html":                    "bi-pencil-square",
    "contact.html":                  "bi-envelope-fill"
  };
  document.querySelectorAll(".navbar .nav-link").forEach(link => {
    const href = link.getAttribute("href");
    const icon = navIcons[href];
    if (icon) {
      link.innerHTML = `<i class="bi ${icon}"></i> ${link.textContent.trim()}`;
    }
  });

  // ── Typing demo (pages with #typing-text only) ───────────
  const typingTarget = document.getElementById("typing-text");
  if (typingTarget) {
    const text =
      "Each menu item points to a separate HTML file in the same folder. " +
      "Example: clicking Research opens research.html.";
    const typingSpeed = 35;
    let idx = 0;
    function type() {
      if (idx < text.length) {
        typingTarget.textContent += text.charAt(idx++);
        setTimeout(type, typingSpeed);
      }
    }
    type();
  }

  // ── Back-to-top button ───────────────────────────────────
  const btn = document.createElement("button");
  btn.id = "back-to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  document.body.appendChild(btn);
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ── Navbar shadow + back-to-top visibility on scroll ─────
  const nav = document.querySelector(".glass-nav");
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 60;
    nav && nav.classList.toggle("scrolled", scrolled);
    btn.classList.toggle("visible", scrolled);
  }, { passive: true });

  // ── Scroll fade-in for cards ─────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".soft-card, .cert-card, .card, .talk-card-new").forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight * 0.85) {
      el.classList.add("fade-in-up");
      el.style.transitionDelay = `${(i % 4) * 60}ms`;
      observer.observe(el);
    }
  });

  // ════════════════════════════════════════════════════════
  // SHARED IMAGE LIGHTBOX — injected into every page
  // ════════════════════════════════════════════════════════
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal fade" id="imgLightboxModal" tabindex="-1" aria-label="Image preview">
      <div class="modal-dialog modal-dialog-centered" style="max-width:min(92vw,920px)">
        <div class="modal-content border-0" style="background:#0f172a;border-radius:16px;overflow:hidden">
          <div class="modal-header border-0 px-4 pt-4 pb-1">
            <h6 id="imgLightboxCaption" class="modal-title fw-normal"
              style="color:rgba(255,255,255,.65);font-size:.875rem;white-space:normal"></h6>
            <button type="button" class="btn-close btn-close-white ms-auto"
              data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body px-4 pb-4 pt-2 text-center">
            <img id="imgLightboxImg" src="" alt=""
              style="max-width:100%;max-height:80vh;object-fit:contain;border-radius:10px;background:#1e293b">
          </div>
        </div>
      </div>
    </div>`);

  function openLightbox(imgSrc, caption) {
    document.getElementById("imgLightboxImg").src = imgSrc;
    document.getElementById("imgLightboxImg").alt = caption || "";
    document.getElementById("imgLightboxCaption").textContent = caption || "";
    new bootstrap.Modal(document.getElementById("imgLightboxModal")).show();
  }

  // helper — make any element open the lightbox on click/enter
  function makeLightboxTrigger(el, getSrc, getCaption) {
    el.classList.add("lightbox-trigger");
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    const open = () => openLightbox(getSrc(el), getCaption(el));
    el.addEventListener("click", e => { e.preventDefault(); open(); });
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  }

  // ── Cert card links (inspiration_recognitions.html) ──────
  // <a class="cert-card" href="image.png"> → modal instead of new tab
  document.querySelectorAll("a.cert-card[href]").forEach(card => {
    makeLightboxTrigger(
      card,
      el => el.getAttribute("href"),
      el => el.querySelector(".cert-title")?.textContent.trim() || ""
    );
  });

  // ── Appreciation cert images (leadership_consulting.html) ─
  // Already had data-bs-target="#certModal" which didn't exist
  document.querySelectorAll("img.cert-img").forEach(img => {
    img.removeAttribute("data-bs-toggle");
    img.removeAttribute("data-bs-target");
    makeLightboxTrigger(
      img,
      el => el.src,
      el => el.closest(".card")?.querySelector("h3, h6")?.textContent.trim() || el.alt
    );
  });

  // ── Architecture / figure images (leadership page) ───────
  document.querySelectorAll("figure img").forEach(img => {
    makeLightboxTrigger(
      img,
      el => el.src,
      el => el.closest("figure")?.querySelector("figcaption")?.textContent.trim() || el.alt
    );
  });

  // ── Profile photo (about.html) ───────────────────────────
  document.querySelectorAll(".profile-photo").forEach(img => {
    makeLightboxTrigger(
      img,
      el => el.src,
      el => el.alt || "Saiteja Jonnalagadda"
    );
  });

  // ── Blog thumbnails (blogs.html, inspiration_recognitions) ─
  document.querySelectorAll(".blog-thumb").forEach(img => {
    makeLightboxTrigger(
      img,
      el => el.src,
      el => el.closest(".blog-item")?.querySelector(".blog-title")?.textContent.trim() || ""
    );
  });

  // ── Talk image modal (public-influencer page) ────────────
  const talkModal = document.getElementById("talkImgModal");
  if (talkModal) {
    document.querySelectorAll(".talk-img-wrap").forEach(wrap => {
      wrap.style.cursor = "zoom-in";
      wrap.setAttribute("title", "Click to enlarge");
      wrap.setAttribute("role", "button");
      wrap.setAttribute("tabindex", "0");

      const hint = document.createElement("div");
      hint.className = "talk-zoom-hint";
      hint.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
      wrap.appendChild(hint);

      const openModal = () => {
        const img = wrap.querySelector(".talk-img-main");
        const title = wrap.closest(".talk-card-new")?.querySelector(".talk-card-title")?.textContent.trim() || "";
        document.getElementById("talkModalImg").src = img.src;
        document.getElementById("talkModalImg").alt = title;
        document.getElementById("talkModalCaption").textContent = title;
        new bootstrap.Modal(talkModal).show();
      };

      wrap.addEventListener("click", openModal);
      wrap.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openModal(); });
    });
  }

});

// ── Animated typewriter on home page ────────────────────────
const animatedEl = document.getElementById("animated-text");
if (animatedEl) {
  const phrases = [
    "identity systems",
    "synthetic data methods",
    "privacy-preserving linkage",
    "applied AI for healthcare"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const speed = 90;

  function animate() {
    const current = phrases[phraseIndex];
    if (!isDeleting) {
      animatedEl.textContent = current.slice(0, charIndex++);
      if (charIndex === current.length + 1) {
        setTimeout(() => { isDeleting = true; }, 1200);
      }
    } else {
      animatedEl.textContent = current.slice(0, charIndex--);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(animate, isDeleting ? speed / 2 : speed);
  }
  animate();
}
