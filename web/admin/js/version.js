/**
 * DSE ERP Web Admin Studio - Centralized Runtime Version Registry
 * Automatically synchronized with version.json and Desktop release revision.
 */
window.AppVersion = window.DSE_VERSION = {
  version: "11.0.21.02",
  desktopVersion: "11.0.21",
  webBuild: 16,
  webVersion: "11.0.21.02",
  tag: "web-v11.0.21.02",
  releaseDate: "2026-11-01T15:45:00+05:30",
  environment: "Production / Enterprise",
  summary: "v11.0.21.02 Enterprise Web Release: Non-Intrusive Floating Toast Notifications & Jasvi Cyan / Slate Navy Theme Restoration",
  highlights: [
    "1. Non-Intrusive Floating Toast System: Replaced blocking fuzzy modal popups on page refresh and routine events with lightweight floating top-right toast alerts that auto-dismiss smoothly in 3.2s.",
    "2. Modal Dialog Isolation: Reserved full-screen modal dialogs exclusively for critical decisions (Delete, Discard Unsaved Changes, Void) and refined backdrop blur (14px -> 6px) to eliminate fuzzy text.",
    "3. Jasvi Industrial Palette Restoration: Removed electric purple overrides across buttons, quick actions, tabs, table row actions, and secondary buttons, restoring the canonical Ocean Blue / Cyan gradient (#0284c7 / #38bdf8) and Slate Glass styling."
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
