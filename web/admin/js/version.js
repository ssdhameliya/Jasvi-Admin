/**
 * DSE ERP Web Admin Studio - Centralized Runtime Version Registry
 * Automatically synchronized with version.json and Desktop release revision.
 */
window.AppVersion = window.DSE_VERSION = {
  version: "11.0.21.01",
  desktopVersion: "11.0.21",
  webBuild: 15,
  webVersion: "11.0.21.01",
  tag: "web-v11.0.21.01",
  releaseDate: "2026-11-01T15:15:00+05:30",
  environment: "Production / Enterprise",
  summary: "v11.0.21.01 Enterprise Web Release: Excel Template In-Cell Dropdowns, Sales/Purchase Attachment Parity, Settings Document Numbering & Double Confirmation",
  highlights: [
    "1. Settings Document Numbering: Added dedicated card in Screen 3 (Invoice & Delivery) with token guidance info modal and 4-point impact double-confirmation.",
    "2. Excel Import In-Cell Dropdowns: Native Excel dropdowns for gst_percent, gst_type, charge types, and taxable flags streamed via server endpoint.",
    "3. Template Dynamic Samples: Sales and Purchases sample rows dynamically reflect active reference formats for party and item codes.",
    "4. Attachment & Charges Parity: Consolidated to single attachment_files column with backward-compatible fallback across Sales and Purchases, plus charge deduplication."
  ]
};

// Automatic UI Version Injection
(function() {
  function syncVersionToDOM() {
    const v = window.DSE_VERSION;
    if (!v) return;

    // 1. Login Page Version Badge & Desktop Baseline
    const loginBadge = document.getElementById('auth-app-version-badge') || document.querySelector('.auth-brand-version-badge');
    if (loginBadge) {
      loginBadge.textContent = `Version ${v.webVersion}`;
      loginBadge.title = `Desktop Compatibility: v${v.desktopVersion} | Release Tag: ${v.tag}`;
    }

    const baselineEl = document.getElementById('auth-desktop-baseline');
    if (baselineEl) {
      baselineEl.textContent = `Desktop Baseline: v${v.desktopVersion}`;
    }

    // 2. Profile Menu / Sidebar Version Footer
    const menuVerEl = document.getElementById('menu-version-footer');
    if (menuVerEl) {
      menuVerEl.innerHTML = `<span>Web Studio</span><span style="color: var(--cyan); font-weight: 600;">v${v.webVersion}</span>`;
    }

    // 3. Header & Footer Badges
    const desktopParityEl = document.getElementById('footer-desktop-version');
    if (desktopParityEl) {
      desktopParityEl.textContent = `Desktop v${v.desktopVersion} Parity`;
    }

    const webBuildEl = document.getElementById('footer-web-build');
    if (webBuildEl) {
      webBuildEl.textContent = `Web v${v.webVersion} (${v.environment})`;
    }

    const headerVerEl = document.getElementById('header-app-version');
    if (headerVerEl) {
      headerVerEl.textContent = `v${v.webVersion}`;
    }

    // 4. Any elements with class .dse-version-display
    document.querySelectorAll('.dse-version-display').forEach(el => {
      el.textContent = v.webVersion;
    });

    // 5. Document Title
    if (document.title && !document.title.includes(v.webVersion)) {
      document.title = `${document.title.split(' • ')[0]} • Jasvi Industries ERP v${v.webVersion}`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncVersionToDOM);
  } else {
    syncVersionToDOM();
  }
})();
