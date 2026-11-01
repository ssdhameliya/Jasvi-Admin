/**
 * DSE ERP Web Admin Studio - Centralized Runtime Version Registry
 * Automatically synchronized with version.json and Desktop release revision.
 */
window.AppVersion = window.DSE_VERSION = {
  version: "11.0.23.01",
  desktopVersion: "11.0.23",
  webBuild: 19,
  webVersion: "11.0.23.01",
  tag: "web-v11.0.23.01",
  releaseDate: "2026-11-02T00:20:00+05:30",
  environment: "Production / Enterprise",
  summary: "v11.0.23.01 Enterprise Web Release: Bank Statement Ref (BST/...), Payment Ref (PRF/...) 2-Way Deep-Linking, Purchase Recon Linkage & Multi-Format Templates",
  highlights: [
    "1. Bank Statement & Purchase Recon Reference Parity: Added auto-generated Statement Ref (BST/DD-MM-YYYY/XXXX) column, removed redundant Value Date column, and updated Purchase Recon # Linked Ref to display and deep-link to BST/...",
    "2. Payment Reference (PRF/DD-MM-YYYY/XXXX) & 2-Way Audit Linkage: Added clickable Payment Ref across Payment History, Bank Statement Match/Link, and UniversalLinkageService with 1-click Bank Statement isolation or manual settlement notice.",
    "3. Multi-Format Template Downloads (.xlsx, .xls, .csv): Enabled downloading Bank Statement templates in .xlsx, .xls, .csv, or All 3 Formats simultaneously."
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
