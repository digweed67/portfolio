
/**
 * Amaia Artola – Cleaned main.js (trimmed from template)
 * What’s kept: header toggle, hide-on-nav click, preloader, scroll-top,
 * AOS init, typed.js, hash scroll fix, nav scrollspy, contact form,
 * touch overlay support, ARIA fix for Bootstrap modals.
 */

(function () {
  "use strict";

  /* =====================
     Header toggle
  ===================== */
  const headerToggleBtn = document.querySelector(".header-toggle");
  function headerToggle() {
    const header = document.querySelector("#header");
    if (!header || !headerToggleBtn) return;
    header.classList.toggle("header-show");
    headerToggleBtn.classList.toggle("bi-list");
    headerToggleBtn.classList.toggle("bi-x");
  }
  if (headerToggleBtn) headerToggleBtn.addEventListener("click", headerToggle);

  /* Hide mobile nav on same-page/hash links */
  document.querySelectorAll("#navmenu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (document.querySelector(".header-show")) headerToggle();
    });
  });

  /* =====================
     Preloader
  ===================== */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => preloader.remove());
  }

  /* =====================
     Scroll Top button
  ===================== */
  const scrollTop = document.querySelector(".scroll-top");
  function toggleScrollTop() {
    if (!scrollTop) return;
    if (window.scrollY > 100) scrollTop.classList.add("active");
    else scrollTop.classList.remove("active");
  }
  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /* =====================
     AOS init
  ===================== */
  function aosInit() {
    if (window.AOS && typeof AOS.init === "function") {
      AOS.init({ duration: 600, easing: "ease-in-out", once: true, mirror: false });
    }
  }
  window.addEventListener("load", aosInit);

  /* =====================
     typed.js init
  ===================== */
  (function initTyped() {
    const el = document.querySelector(".typed");
    if (!el || !window.Typed) return;
    let items = el.getAttribute("data-typed-items");
    if (!items) return;
    items = items.split(",");
    new Typed(".typed", {
      strings: items,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  })();

  /* =====================
     Correct hash scroll on load
  ===================== */
  window.addEventListener("load", () => {
    if (!window.location.hash) return;
    const section = document.querySelector(window.location.hash);
    if (!section) return;
    setTimeout(() => {
      const scrollMarginTop = parseInt(getComputedStyle(section).scrollMarginTop || "0", 10);
      window.scrollTo({ top: section.offsetTop - scrollMarginTop, behavior: "smooth" });
    }, 100);
  });

  /* =====================
     Navmenu Scrollspy
  ===================== */
  const navmenulinks = document.querySelectorAll(".navmenu a");
  function navmenuScrollspy() {
    const pos = window.scrollY + 200;
    navmenulinks.forEach((link) => {
      if (!link.hash) return;
      const section = document.querySelector(link.hash);
      if (!section) return;
      const inView = pos >= section.offsetTop && pos <= section.offsetTop + section.offsetHeight;
      link.classList.toggle("active", inView);
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);

  /* =====================
     Contact form (AJAX -> JSON)
  ===================== */
  function setupContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const loading = form.querySelector(".loading");
    const errorMessage = form.querySelector(".error-message");
    const sentMessage = form.querySelector(".sent-message");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (loading) loading.style.display = "block";
      if (errorMessage) errorMessage.style.display = "none";
      if (sentMessage) sentMessage.style.display = "none";

      const formData = new FormData(form);

      fetch(form.action, { method: "POST", body: formData })
        .then((r) => r.json())
        .then((data) => {
          if (loading) loading.style.display = "none";
          if (data.status === "success") {
            if (sentMessage) sentMessage.style.display = "block";
            form.reset();
            setTimeout(() => { if (sentMessage) sentMessage.style.display = "none"; }, 5000);
          } else {
            if (errorMessage) errorMessage.innerHTML = data.message || "Submission failed.";
            if (errorMessage) errorMessage.style.display = "block";
            setTimeout(() => { if (errorMessage) errorMessage.style.display = "none"; }, 5000);
          }
        })
        .catch(() => {
          if (loading) loading.style.display = "none";
          if (errorMessage) errorMessage.innerHTML = "An unexpected error occurred.";
          if (errorMessage) errorMessage.style.display = "block";
          setTimeout(() => { if (errorMessage) errorMessage.style.display = "none"; }, 5000);
        });
    });
  }
  setupContactForm();

  /* =====================
     Touch support for portfolio overlays
  ===================== */
  document.addEventListener("DOMContentLoaded", function () {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (isTouch) {
      document.querySelectorAll(".overlay").forEach((overlay) => {
        overlay.addEventListener("click", function (e) {
          e.stopPropagation();
          document.querySelectorAll(".overlay.active").forEach((o) => o.classList.remove("active"));
          this.classList.add("active");
        });
      });

      document.addEventListener("click", function () {
        document.querySelectorAll(".overlay.active").forEach((o) => o.classList.remove("active"));
      });
    }

    // Clear overlays when any Bootstrap modal is closed
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("hidden.bs.modal", function () {
        document.querySelectorAll(".overlay.active").forEach((o) => o.classList.remove("active"));
      });
    });
  });

  /* =====================
     ARIA focus fix when hiding modals (jQuery + Bootstrap)
  ===================== */
  if (window.jQuery) {
    jQuery(".modal").on("hide.bs.modal", function () {
      if (document.activeElement && this.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    });
  }
})();
