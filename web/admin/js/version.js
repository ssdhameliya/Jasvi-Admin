/**
 * DSE ERP Web Admin Studio - Centralized Runtime Version Registry
 * Automatically synchronized with version.json and Desktop release revision.
 */
window.AppVersion = window.DSE_VERSION = {
  version: "11.0.20.01",
  desktopVersion: "11.0.20",
  webBuild: 14,
  webVersion: "11.0.20.01",
  tag: "web-v11.0.20.01",
  releaseDate: "2026-11-01T14:05:00+05:30",
  environment: "Production / Enterprise",
  summary: "v11.0.20.01 Enterprise Web Release: Standardize Reference Formats, FY Tokens, Global Sync & Dynamic Colour-Coded Excel Templates",
  highlights: [
    "1. Financial Year Reference Tokens: Full support for {YY-YYYY}, {YYYY-YYYY}, {YYYY-YY}, and {YY-YY} with Indian financial year calendar logic.",
    "2. Global Format Synchronization: Added ⇄ Sync All Formats modal in Masters to update all document reference formats at once with live multi-document preview.",
    "3. Dynamic & Colour-Coded Excel Templates: Downloadable import templates now dynamically resolve sample identifiers from active formats and feature color-coded headers (Red=Mandatory, Amber=Tax, Blue=Charges, Gray=Optional).",
    "4. Multiple Sales Charges: Added full support for additional_charges on Sales import identical to Purchases."
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
      document.title = `${document.title.split(' — ')[0]} — Jasvi Industries ERP v${v.webVersion}`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncVersionToDOM);
  } else {
    syncVersionToDOM();
  }
})();
