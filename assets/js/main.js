(function () {
  var cfg = window.BNW_CONFIG || {};

  // Wires every element carrying a data-bnw hook up to config.js, so a page
  // never hardcodes the download URL or contact email directly.
  function applyConfig() {
    document.querySelectorAll('[data-bnw="download-apk"]').forEach(function (el) {
      el.href = cfg.apkDownloadUrl;
    });
    document.querySelectorAll('[data-bnw="play-store"]').forEach(function (el) {
      el.href = cfg.playStoreUrl;
      if (!cfg.playStoreLive) {
        el.classList.add('is-disabled');
        el.setAttribute('aria-disabled', 'true');
        el.addEventListener('click', function (e) {
          e.preventDefault();
        });
      }
    });
    document.querySelectorAll('[data-bnw="contact-email"]').forEach(function (el) {
      el.textContent = cfg.contactEmail;
      if (el.tagName === 'A') el.href = 'mailto:' + cfg.contactEmail;
    });
  }

  // Mobile nav (simple open/close, no dependencies).
  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-nav-menu]');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  // Fade/slide sections in as they scroll into view. Falls back to just
  // showing everything immediately if IntersectionObserver isn't available.
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  // Small "download" bar pinned to the bottom on phones, only once the hero
  // (which already has its own big download button) has scrolled past.
  function initStickyDownload() {
    var bar = document.querySelector('[data-sticky-download]');
    var hero = document.querySelector('.hero');
    if (!bar || !hero) return;
    var shown = false;
    window.addEventListener(
      'scroll',
      function () {
        var heroBottom = hero.getBoundingClientRect().bottom;
        var shouldShow = heroBottom < 0;
        if (shouldShow !== shown) {
          shown = shouldShow;
          bar.classList.toggle('visible', shown);
        }
      },
      { passive: true }
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyConfig();
    initNav();
    initReveal();
    initStickyDownload();
  });
})();
