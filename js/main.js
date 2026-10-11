/* =====================================================================
   Smart Reading Buddy — site script (vanilla JS, no dependencies)
   Renders the shared header/footer and each page from js/data.js.
   ===================================================================== */
(function () {
  "use strict";

  var D = window.SITE_DATA || {};
  var THEME_KEY = "srb-theme";

  /* ---------------- Helpers ---------------- */
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function isPlaceholder(v) {
    if (v == null) return true;
    var s = String(v).trim();
    return s === "" || s === "#" || /^TBA$/i.test(s) || /PASTE_/i.test(s);
  }
  function isPendingLink(link) { return isPlaceholder(link) || !/^https?:\/\//i.test(String(link).trim()); }
  function initials(name) {
    if (isPlaceholder(name)) return "?";
    var parts = String(name).replace(/^(dr|prof|mr|mrs|ms|miss)\.?\s+/i, "").trim().split(/\s+/);
    return ((parts[0] || "")[0] + ((parts.length > 1 ? parts[parts.length - 1] : "")[0] || "")).toUpperCase();
  }
  var MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  function parseDate(v) { // "17 March 2026" → timestamp, or null
    var m = String(v || "").trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (!m) return null;
    var mi = MONTHS.indexOf(m[2].toLowerCase());
    return mi < 0 ? null : new Date(+m[3], mi, +m[1]).getTime();
  }
  function storageGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function storageSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }

  /* ---------------- Icons (inline SVG, stroke style) ---------------- */
  var P = {
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>',
    type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    gamepad: '<rect x="2" y="6" width="20" height="12" rx="6"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="13" r="1"/><circle cx="18" cy="11" r="1"/>',
    robot: '<rect x="4" y="8" width="16" height="12" rx="3"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="14" r="1.5"/><line x1="12" y1="4" x2="12" y2="8"/><circle cx="12" cy="3" r="1"/><line x1="1.5" y1="13" x2="4" y2="13"/><line x1="20" y1="13" x2="22.5" y2="13"/>',
    wifiOff: '<line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
    globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    bluetooth: '<polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><polyline points="9 14 11 16 15 12"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
    award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    percent: '<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mapPin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    chevronLeft: '<polyline points="15 18 9 12 15 6"/>',
    chevronRight: '<polyline points="9 18 15 12 9 6"/>',
    chevronDown: '<polyline points="6 9 12 15 18 9"/>',
    arrowUp: '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
    arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    smartphone: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    git: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    alertTriangle: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    xCircle: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>'
  };
  function icon(name, cls) {
    return '<svg class="icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || P.file) + "</svg>";
  }
  function statusBadge(done, okText, waitText) {
    return done
      ? '<span class="badge badge-ok">' + esc(okText) + "</span>"
      : '<span class="badge badge-warn">' + esc(waitText) + "</span>";
  }
  function viewButton(link, label, title) {
    if (isPendingLink(link)) {
      return '<button type="button" class="btn btn-sm btn-primary" disabled aria-disabled="true" title="Not available yet">' + icon("clock") + " Pending</button>";
    }
    return '<a class="btn btn-sm btn-primary" href="' + esc(link) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(label + " " + title + " (opens in a new tab)") + '">' + esc(label) + " " + icon("external") + "</a>";
  }

  /* ---------------- Theme ---------------- */
  var mql = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function effectiveTheme() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t === "dark" || t === "light") return t;
    return mql && mql.matches ? "dark" : "light";
  }
  function syncThemeUI() {
    var dark = effectiveTheme() === "dark";
    document.documentElement.classList.toggle("is-dark", dark);
    var btn = $(".theme-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      btn.title = dark ? "Light mode" : "Dark mode";
    }
  }
  function toggleTheme() {
    var next = effectiveTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    storageSet(THEME_KEY, next);
    syncThemeUI();
  }
  if (mql) {
    var onScheme = function () { syncThemeUI(); };
    if (mql.addEventListener) mql.addEventListener("change", onScheme);
    else if (mql.addListener) mql.addListener(onScheme);
  }

  /* ---------------- Shared header & footer ---------------- */
  var NAV = [
    { href: "index.html", label: "Home", page: "home" },
    { href: "domain.html", label: "Domain", page: "domain" },
    { href: "milestones.html", label: "Milestones", page: "milestones" },
    { href: "documents.html", label: "Documents", page: "documents" },
    { href: "presentations.html", label: "Presentations", page: "presentations" },
    { href: "about.html", label: "About Us", page: "about" },
    { href: "contact.html", label: "Contact", page: "contact" }
  ];

  function renderHeader(page) {
    var el = $("#site-header");
    if (!el) return;
    var s = D.site || {};
    var links = NAV.map(function (n) {
      return '<li><a href="' + n.href + '"' + (n.page === page ? ' aria-current="page"' : "") + ">" + n.label + "</a></li>";
    }).join("");
    el.innerHTML =
      '<nav class="container nav" aria-label="Main">' +
        '<a class="brand" href="index.html" aria-label="' + esc(s.title) + ' home">' +
          '<img class="brand-logo" src="' + esc(s.logoIcon || s.logo) + '" alt="" width="40" height="40">' +
          '<span class="brand-text"><span>' + esc(s.title) + "</span><small>" + esc(s.projectId) + "</small></span>" +
        "</a>" +
        '<ul class="nav-links" id="nav-links">' + links + "</ul>" +
        '<div class="nav-actions">' +
          '<button type="button" class="icon-btn theme-toggle">' + icon("sun", "icon-sun") + icon("moon", "icon-moon") + "</button>" +
          '<button type="button" class="icon-btn menu-toggle" aria-controls="nav-links" aria-expanded="false" aria-label="Open menu">' + icon("menu") + "</button>" +
        "</div>" +
      "</nav>";

    $(".theme-toggle", el).addEventListener("click", toggleTheme);

    var menuBtn = $(".menu-toggle", el), list = $("#nav-links", el);
    function setMenu(open) {
      list.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menuBtn.innerHTML = icon(open ? "close" : "menu");
    }
    menuBtn.addEventListener("click", function () { setMenu(!list.classList.contains("is-open")); });
    $all("a", list).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && list.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
    });
    document.addEventListener("click", function (e) {
      // composedPath() still includes the header even if the tapped icon was just re-rendered
      var inside = e.composedPath ? e.composedPath().indexOf(el) !== -1 : el.contains(e.target);
      if (list.classList.contains("is-open") && !inside) setMenu(false);
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 960) setMenu(false); });

    var onScroll = function () {
      el.classList.toggle("is-scrolled", window.scrollY > 8);
      document.documentElement.classList.toggle("nav-compact", window.scrollY > 24);
      var tt = $(".to-top");
      if (tt) tt.classList.toggle("is-visible", window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    syncThemeUI();
  }

  function renderFooter() {
    var el = $("#site-footer");
    if (!el) return;
    var s = D.site || {}, c = D.contact || {};
    var email = isPlaceholder(c.groupEmail) ? "" : '<a href="mailto:' + esc(c.groupEmail) + '">' + esc(c.groupEmail) + "</a>";
    var phone = isPlaceholder(c.phone) ? "" : '<a href="' + esc(c.phoneLink || "tel:" + String(c.phone).replace(/\s+/g, "")) + '">' + esc(c.phone) + "</a>";
    el.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          "<div>" +
            '<div class="footer-brand"><img src="' + esc(s.logoIcon || s.logo) + '" alt="" width="48" height="48">' + esc(s.title) + "</div>" +
            "<p>" + esc(s.projectId) + (s.panel ? " · Panel " + esc(s.panel) : "") + " · " + esc(s.officialTitle) + ". Final-year research project, " + esc(s.degree) + ", " + esc(s.faculty) + ", " + esc(s.university) + ".</p>" +
          "</div>" +
          '<div><h3>Quick links</h3><ul>' +
            NAV.map(function (n) { return '<li><a href="' + n.href + '">' + n.label + "</a></li>"; }).join("") +
          "</ul></div>" +
          '<div><h3>Contact</h3><ul>' +
            (email ? "<li>" + icon("mail") + "<span>" + email + "</span></li>" : "") +
            (phone ? "<li>" + icon("phone") + "<span>" + phone + "</span></li>" : "") +
            "<li>" + icon("mapPin") + "<span>" + esc(c.address) + "</span></li>" +
          "</ul></div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          "<span>© " + esc(s.year || new Date().getFullYear()) + " " + esc(s.title) + " · " + esc(s.projectId) + "</span>" +
          "<span>Built for academic purposes · SLIIT</span>" +
        "</div>" +
      "</div>";

    var top = document.createElement("button");
    top.type = "button";
    top.className = "icon-btn to-top";
    top.setAttribute("aria-label", "Back to top");
    top.innerHTML = icon("arrowUp");
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.body.appendChild(top);
  }

  /* ---------------- Image fallbacks (missing photos/screenshots) ---------------- */
  // If an image is missing, try the same path as .jpg / .webp / .png before showing a placeholder.
  function altSources(src) {
    var m = String(src || "").match(/^(.*)\.(jpe?g|webp|png)$/i);
    if (!m) return [];
    var cur = m[2].toLowerCase().replace("jpeg", "jpg");
    return ["jpg", "webp", "png"].filter(function (e) { return e !== cur; }).map(function (e) { return m[1] + "." + e; });
  }
  function wireImageFallbacks(root) {
    $all("img[data-fallback]", root).forEach(function (img) {
      var queue = altSources(img.getAttribute("src"));
      function swap() {
        if (queue.length) { img.src = queue.shift(); return; }
        var kind = img.getAttribute("data-fallback");
        if (kind === "hide") { // optional image: remove its whole block when the file is missing
          img.removeEventListener("error", swap);
          var block = img.closest("[data-fallback-root]") || img;
          if (block.parentNode) block.parentNode.removeChild(block);
          return;
        }
        var div = document.createElement("div");
        if (kind === "initials") {
          div.className = "initials";
          div.setAttribute("role", "img");
          div.setAttribute("aria-label", img.alt);
          div.textContent = img.getAttribute("data-initials") || "?";
        } else {
          div.className = "img-fallback";
          div.setAttribute("role", "img");
          div.setAttribute("aria-label", img.alt + " (image coming soon)");
          div.innerHTML = icon("image") + "<span>Screenshot coming soon</span>";
        }
        img.removeEventListener("error", swap);
        if (img.parentNode) img.parentNode.replaceChild(div, img);
      }
      img.addEventListener("error", swap);
      if (img.complete && img.naturalWidth === 0) swap();
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  function initReveal() {
    var els = $all(".reveal:not(.is-visible)");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || reduce) {
      els.forEach(function (e) { e.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (e) { io.observe(e); });
  }
  // staggered delay for items in a grid
  function d(i) { return ' style="--delay:' + Math.min(i * 0.08, 0.48).toFixed(2) + 's"'; }

  /* =====================================================================
     PAGES
     ===================================================================== */

  /* ---------------- Home ---------------- */
  function youtubeId(v) {
    if (isPlaceholder(v)) return null;
    var s = String(v).trim();
    var m = s.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    if (m) return m[1];
    return /^[\w-]{11}$/.test(s) ? s : null;
  }

  // Count-up animation for stat values like "86.09%", "5,225", "95"
  function animateCount(el) {
    var final = el.getAttribute("data-count") || "";
    var m = final.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!m || reduce || !window.requestAnimationFrame) { el.textContent = final; return; }
    var target = parseFloat(m[1].replace(/,/g, ""));
    var decimals = (m[1].split(".")[1] || "").length;
    var commas = m[1].indexOf(",") !== -1;
    var start = null, dur = 1400;
    function fmt(n) {
      var s = n.toFixed(decimals);
      if (commas) { var p = s.split("."); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); s = p.join("."); }
      return s + m[2];
    }
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) window.requestAnimationFrame(step); else el.textContent = final;
    }
    window.requestAnimationFrame(step);
  }
  function initCounters(root) {
    var els = $all("[data-count]", root);
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.textContent = e.getAttribute("data-count"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { animateCount(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.6 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------------- Home hero: live app showcase ---------------- */
  // Phone mockup that cycles through the screenshots; slide i pairs with component i (C1–C4).
  var SLIDE_MS = 5000;

  function showcaseHtml(comps, shots) {
    var n = Math.min(comps.length, shots.length);
    if (!n) return "";
    var slides = "", dots = "", chips = "";
    for (var i = 0; i < n; i++) {
      var c = comps[i], sh = shots[i], chip = c.heroChip || { label: c.code + " " + c.title, text: c.summary };
      slides += '<div class="sc-slide' + (i === 0 ? " is-active" : "") + '" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " of " + n + ": " + esc(c.title) + '"' + (i === 0 ? "" : ' aria-hidden="true"') + ">" +
        '<img src="' + esc(sh.src) + '" alt="' + esc(sh.alt) + '" width="709" height="1600" data-fallback="shot"' + (i === 0 ? "" : ' loading="lazy"') + "></div>";
      dots += '<button type="button" class="sc-dot" data-slide="' + i + '" aria-label="Show ' + esc(c.title) + ' screen"' + (i === 0 ? ' aria-current="true"' : "") + ">" +
        '<span class="sc-dot-track"><span class="sc-dot-fill"></span></span></button>';
      chips += '<div class="sc-chip sc-chip-' + (i + 1) + '" style="--float-delay:' + (-i * 1.4).toFixed(1) + 's">' +
        '<div class="sc-chip-inner' + (i === 0 ? " is-active" : "") + '" data-slide="' + i + '">' +
          '<button type="button" class="sc-chip-btn" data-slide="' + i + '" aria-label="Show ' + esc(c.title) + ' screen: ' + esc(chip.text) + '">' +
            '<span class="sc-chip-icon">' + icon(c.icon) + "</span>" +
            '<span class="sc-chip-text"><b>' + esc(chip.label) + "</b><small>" + esc(chip.text) + "</small></span>" +
          "</button>" +
          // the ONLY link to the Domain page
          '<a class="sc-chip-link" href="domain.html#' + esc(String(c.code).toLowerCase()) + '" title="View details" aria-label="View details: ' + esc(c.title) + '">' + icon("arrowRight") + "</a>" +
        "</div>" +
      "</div>";
    }
    return '<div class="showcase reveal" style="--delay:.15s" role="region" aria-roledescription="carousel" aria-label="App screens">' +
      '<div class="sc-bg" aria-hidden="true"><span class="sc-grid"></span><span class="sc-glow"></span><span class="sc-blob b1"></span><span class="sc-blob b2"></span><span class="sc-blob b3"></span></div>' +
      '<div class="sc-stage">' +
        '<div class="sc-float">' +
          '<div class="phone">' +
            '<span class="phone-notch" aria-hidden="true"><span class="phone-cam"></span></span>' +
            '<div class="phone-screen" tabindex="0" aria-label="App screens. Use the left and right arrow keys to change screen.">' + slides + "</div>" +
          "</div>" +
          '<button type="button" class="sc-nav sc-prev" aria-label="Previous screen">' + icon("chevronLeft") + "</button>" +
          '<button type="button" class="sc-nav sc-next" aria-label="Next screen">' + icon("chevronRight") + "</button>" +
          '<div class="ble-badge"><span class="ble-icon">' + icon("bluetooth") + '<span class="ble-pulse" aria-hidden="true"></span></span>Buddy via BLE</div>' +
        "</div>" +
        '<div class="sc-chips">' + chips + "</div>" +
      "</div>" +
      '<div class="sc-dots">' + dots + "</div>" +
    "</div>";
  }

  function initShowcase(root) {
    var sc = $(".showcase", root);
    if (!sc) return;
    var slides = $all(".sc-slide", sc), dots = $all(".sc-dot", sc), chips = $all(".sc-chip-inner", sc);
    var fills = $all(".sc-dot-fill", sc);
    var n = slides.length, cur = 0;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var auto = !reduce && n > 1;
    var elapsed = 0, last = null, hovering = 0;

    function setFill(p) {
      fills.forEach(function (f, k) { f.style.transform = "scaleX(" + (k === cur ? p : 0) + ")"; });
    }
    function show(i) {
      cur = (i + n) % n;
      slides.forEach(function (s, k) {
        var on = k === cur;
        s.classList.toggle("is-active", on);
        if (on) s.removeAttribute("aria-hidden"); else s.setAttribute("aria-hidden", "true");
        if (on) { var img = $("img", s); if (img) img.loading = "eager"; }
      });
      // warm up the next image so the crossfade never shows an empty screen
      var nextImg = $("img", slides[(cur + 1) % n]); if (nextImg) nextImg.loading = "eager";
      dots.forEach(function (d, k) { if (k === cur) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
      chips.forEach(function (c) { c.classList.toggle("is-active", +c.getAttribute("data-slide") === cur); });
    }
    // Manual change: jump, and restart the 5 s timer from this slide (auto-play keeps going)
    function go(i) { show(i); elapsed = 0; setFill(auto ? 0 : 1); }

    function paused() { return hovering > 0 || document.hidden; }
    function frame(ts) {
      var dt = last === null ? 0 : ts - last;
      last = ts;
      if (dt > 250) dt = 0; // tab was in the background or the page was busy: don't jump ahead
      if (!paused()) {
        elapsed += dt;
        if (elapsed >= SLIDE_MS) { show(cur + 1); elapsed = 0; }
        setFill(elapsed / SLIDE_MS);
      }
      window.requestAnimationFrame(frame);
    }

    // Clicks: chip buttons, dots, prev / next (the chip arrow link is a normal link)
    $all(".sc-chip-btn, .sc-dot", sc).forEach(function (b) {
      b.addEventListener("click", function () { go(+b.getAttribute("data-slide")); });
    });
    $(".sc-prev", sc).addEventListener("click", function () { go(cur - 1); });
    $(".sc-next", sc).addEventListener("click", function () { go(cur + 1); });

    // Keyboard: left / right while focus is anywhere in the showcase
    sc.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); }
    });

    // Swipe on touch screens
    var screen = $(".phone-screen", sc), sx = null, sy = null;
    screen.addEventListener("touchstart", function (e) { var t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; }, { passive: true });
    screen.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      sx = sy = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? cur + 1 : cur - 1);
    }, { passive: true });

    // Pause while the mouse is over the phone or a chip
    $all(".phone, .sc-nav, .sc-chip-inner", sc).forEach(function (el) {
      el.addEventListener("mouseenter", function () { hovering++; });
      el.addEventListener("mouseleave", function () { hovering = Math.max(0, hovering - 1); });
    });
    // Tab hidden: freeze; when it comes back, carry on from where it was
    document.addEventListener("visibilitychange", function () { last = null; });

    sc.classList.toggle("is-auto", auto);
    show(0);
    setFill(auto ? 0 : 1);
    if (auto) window.requestAnimationFrame(frame);
  }

  function renderHome() {
    var root = $("#home");
    if (!root) return;
    var s = D.site || {};
    var comps = D.components || [];
    var vid = youtubeId(s.youtubeId);

    var stats = (D.stats || []).map(function (st, i) {
      return '<div class="kpi reveal"' + d(i) + ">" +
        '<b aria-hidden="true" data-count="' + esc(st.value) + '">' + esc(st.value) + "</b>" +
        '<span class="kpi-label"><span class="visually-hidden">' + esc(st.value) + " </span>" + esc(st.label) + "</span>" +
        (st.note ? "<small>" + esc(st.note) + "</small>" : "") +
      "</div>";
    }).join("");

    var compCards = comps.map(function (c, i) {
      return '<article class="card comp-card reveal"' + d(i) + ">" +
        '<span class="card-num" aria-hidden="true">' + esc(c.code) + "</span>" +
        '<div class="card-icon">' + icon(c.icon) + "</div>" +
        "<h3>" + esc(c.title) + "</h3>" +
        "<p>" + esc(c.summary) + "</p>" +
        '<div class="tags">' + (c.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
        '<p class="card-meta">' + icon("user") + esc(c.member) + "</p>" +
        '<a class="card-link" href="domain.html#' + esc(String(c.code).toLowerCase()) + '">Learn more<span class="visually-hidden"> about ' + esc(c.title) + "</span> " + icon("arrowRight") + "</a>" +
      "</article>";
    }).join("");

    var highlights = (D.highlights || []).map(function (h, i) {
      return '<div class="card highlight reveal"' + d(i) + '><div class="card-icon">' + icon(h.icon) + "</div><div><h3>" + esc(h.title) + "</h3><p>" + esc(h.text) + "</p></div></div>";
    }).join("");

    var shots = (D.screenshots || []).map(function (sh, i) {
      return '<figure class="shot reveal"' + d(i) + '><div class="shot-frame"><img src="' + esc(sh.src) + '" alt="' + esc(sh.alt) + '" data-fallback="shot"></div><figcaption>' + esc(sh.caption) + "</figcaption></figure>";
    }).join("");

    // Thumbnail + play button first; the iframe is only loaded on click (see initVideo)
    var video = vid
      ? '<button type="button" class="video-poster" data-vid="' + vid + '" aria-label="Play demo video">' +
          '<img src="https://img.youtube.com/vi/' + vid + '/hqdefault.jpg" alt="" loading="lazy">' +
          '<span class="play">' + icon("play") + "</span>" +
        "</button>"
      : '<div class="video-placeholder"><span class="play">' + icon("play") + "</span><p>Demo video coming soon</p></div>";
    var videoNote = vid
      ? '<p class="video-note"><a href="https://youtu.be/' + vid + '" target="_blank" rel="noopener noreferrer">Watch on YouTube ' + icon("external") + "</a></p>"
      : "";

    var title = esc(s.title || "");
    var split = title.split(" ");
    var heroTitle = split.length > 1 ? split.slice(0, -1).join(" ") + ' <span class="accent">' + split[split.length - 1] + "</span>" : title;

    root.innerHTML =
      '<section class="hero">' +
        '<div class="container">' +
          '<div class="hero-grid">' +
            '<div class="reveal">' +
              '<span class="hero-tag">' + icon("cap") + " SLIIT Research Project · <b>" + esc(s.projectId) + "</b>" + (s.panel ? ' · <b class="nw">Panel ' + esc(s.panel) + "</b>" : "") + "</span>" +
              "<h1>" + heroTitle + "</h1>" +
              '<p class="official">' + esc(s.officialTitle) + "</p>" +
              '<div class="hero-actions">' +
                '<a class="btn btn-primary" href="' + esc(s.ctaLink || "domain.html") + '">' + esc(s.ctaText || "Explore") + " " + icon("arrowRight") + "</a>" +
                '<a class="btn btn-outline" href="#demo" data-scroll="demo">' + icon("play") + " Watch Demo</a>" +
              "</div>" +
            "</div>" +
            showcaseHtml(comps, D.screenshots || []) +
          "</div>" +
          '<div class="intro-grid">' +
            '<div class="abstract-card reveal"><h2>' + icon("book") + " Abstract</h2><p>" + esc(s.abstract) + "</p></div>" +
            '<div class="abstract-card vision-card reveal" style="--delay:.1s"><h2>' + icon("eye") + " Vision</h2><p>" + esc(s.vision) + "</p></div>" +
          "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section section-alt" aria-labelledby="kpi-h">' +
        '<div class="container">' +
          '<div class="section-head reveal"><span class="eyebrow">Key results</span><h2 id="kpi-h">At a glance</h2></div>' +
          '<div class="kpi-grid">' + stats + "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section" aria-labelledby="comp-h">' +
        '<div class="container">' +
          '<div class="section-head reveal"><span class="eyebrow">Research components</span><h2 id="comp-h">Four components, one learning companion</h2><p>Each team member leads one component; together they form a single offline Sinhala–English learning system.</p></div>' +
          '<div class="grid grid-4">' + compCards + "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section section-alt" aria-labelledby="hl-h">' +
        '<div class="container">' +
          '<div class="section-head reveal"><span class="eyebrow">Key features</span><h2 id="hl-h">Why Smart Reading Buddy?</h2></div>' +
          '<div class="grid grid-3">' + highlights + "</div>" +
        "</div>" +
      "</section>" +

      (shots ?
      '<section class="section" aria-labelledby="shots-h">' +
        '<div class="container">' +
          '<div class="section-head reveal"><span class="eyebrow">App preview</span><h2 id="shots-h">A look inside the app</h2></div>' +
          '<div class="shots">' + shots + "</div>" +
        "</div>" +
      "</section>" : "") +

      '<section class="section section-alt" id="demo" aria-labelledby="demo-h">' +
        '<div class="container">' +
          '<div class="section-head reveal"><span class="eyebrow">Demo</span><h2 id="demo-h">See it in action</h2><p>A walkthrough of the app and the Buddy device working together.</p></div>' +
          '<div class="video-wrap reveal">' + video + "</div>" + videoNote +
        "</div>" +
      "</section>" +

      '<section class="section">' +
        '<div class="container">' +
          '<div class="cta-band reveal"><div><h2>Dive into the research</h2><p>Read about the research need, objectives, scope and safeguards.</p></div>' +
          '<a class="btn" href="domain.html">View Domain ' + icon("arrowRight") + "</a></div>" +
        "</div>" +
      "</section>";

    wireImageFallbacks(root);
    initCounters(root);
    initShowcase(root);
    initVideo(root);
  }

  function initVideo(root) {
    var poster = $(".video-poster", root);
    if (poster) poster.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + poster.getAttribute("data-vid") + "?rel=0&autoplay=1";
      f.title = "Smart Reading Buddy demo video";
      f.loading = "lazy";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.referrerPolicy = "strict-origin-when-cross-origin";
      f.allowFullscreen = true;
      poster.parentNode.replaceChild(f, poster);
      f.focus();
    });

    // Hero "Watch Demo" button: smooth-scroll to the video (respects reduced motion)
    var btn = $('[data-scroll="demo"]', root), demo = $("#demo", root);
    if (btn && demo) btn.addEventListener("click", function (e) {
      e.preventDefault();
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      demo.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", "#demo");
    });
  }

  /* ---------------- Domain ---------------- */
  function bulletList(items, ic, cls) {
    return '<ul class="check-list' + (cls ? " " + cls : "") + '">' + (items || []).map(function (t, i) {
      return '<li class="reveal"' + d(i) + ">" + icon(ic) + "<span>" + esc(t) + "</span></li>";
    }).join("") + "</ul>";
  }
  function dataTable(caption, heads, rows) {
    return '<div class="table-wrap reveal"><table class="data-table">' +
      '<caption class="visually-hidden">' + esc(caption) + "</caption>" +
      "<thead><tr>" + heads.map(function (h) { return '<th scope="col">' + esc(h) + "</th>"; }).join("") + "</tr></thead>" +
      "<tbody>" + rows.map(function (r) {
        return "<tr>" + r.map(function (c, i) { return i === 0 ? '<th scope="row">' + c + "</th>" : "<td>" + c + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
  }

  function renderDomain() {
    var root = $("#domain");
    if (!root) return;
    var dm = D.domain || {};
    var comps = D.components || [];
    var sections = [];
    function add(id, label, ic, intro, html) { sections.push({ id: id, label: label, icon: ic, intro: intro, html: html }); }

    // Research need
    add("need", "Research Need", "search", "Why this research is needed.",
      bulletList(dm.need, "alert", "grid-list"));

    // Optional: literature survey
    if (dm.literature && dm.literature.length) {
      add("literature", "Literature Survey", "book", "",
        '<div class="grid grid-2">' + dm.literature.map(function (l, i) {
          return '<div class="card lit-item reveal"' + d(i) + "><h3>" + esc(l.title) + "</h3><p>" + esc(l.text) + "</p></div>";
        }).join("") + "</div>");
    }

    // Optional: research gap table
    var gap = dm.gap;
    if (gap && gap.systems && gap.systems.length && gap.rows && gap.rows.length) {
      var nSys = gap.systems.length;
      var cell = function (v, ours) {
        var cls = ours ? ' class="ours"' : "";
        if (v === true) return "<td" + cls + '><span class="mark mark-yes">' + icon("check") + '<span class="visually-hidden">Yes</span></span></td>';
        if (v === false) return "<td" + cls + '><span class="mark mark-no">' + icon("close") + '<span class="visually-hidden">No</span></span></td>';
        return "<td" + cls + '><span class="mark-partial">' + esc(v) + "</span></td>";
      };
      add("gap", "Research Gap", "layers", "",
        '<div class="table-wrap reveal"><table class="compare">' +
          (gap.caption ? "<caption>" + esc(gap.caption) + "</caption>" : "") +
          '<thead><tr><th scope="col">Feature</th>' +
            gap.systems.map(function (s, i) { return '<th scope="col"' + (i === nSys - 1 ? ' class="ours"' : "") + ">" + esc(s) + "</th>"; }).join("") +
          "</tr></thead><tbody>" +
            gap.rows.map(function (r) {
              return '<tr><th scope="row">' + esc(r.feature) + "</th>" + r.values.map(function (v, i) { return cell(v, i === nSys - 1); }).join("") + "</tr>";
            }).join("") +
          "</tbody></table></div>");
    }

    // Objectives
    add("objectives", "Research Objectives", "target", "Each objective and the evidence that shows it has been met.",
      dataTable("Research objectives and evidence", ["ID", "Objective", "Evidence"], (dm.objectives || []).map(function (o) {
        return ['<span class="id-pill">' + esc(o.id) + "</span>", esc(o.objective), esc(o.evidence)];
      })));

    // Components (tabs)
    var tabs =
      '<div class="tabs reveal">' +
        '<div class="tablist" role="tablist" aria-label="Research components">' +
          comps.map(function (c, i) {
            var k = String(c.code).toLowerCase();
            return '<button type="button" class="tab" role="tab" id="tab-' + k + '" aria-controls="panel-' + k + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' +
              icon(c.icon) + '<span><small>' + esc(c.code) + "</small>" + esc(c.title) + "</span></button>";
          }).join("") +
        "</div>" +
        comps.map(function (c, i) {
          var k = String(c.code).toLowerCase();
          return '<div class="tabpanel" role="tabpanel" id="panel-' + k + '" aria-labelledby="tab-' + k + '" tabindex="0"' + (i === 0 ? "" : " hidden") + ">" +
            '<div class="panel-head"><div class="card-icon">' + icon(c.icon) + "</div><div>" +
              '<span class="eyebrow">' + esc(c.code) + "</span><h3>" + esc(c.title) + "</h3>" +
              '<p class="muted panel-owner">' + icon("user") + esc(c.member) + (c.itNumber ? " · " + esc(c.itNumber) : "") + "</p>" +
            "</div></div>" +
            '<p class="panel-summary">' + esc(c.summary) + "</p>" +
            (c.details || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
            '<h4 class="panel-sub">What it does</h4>' +
            '<ul class="check-list">' + (c.features || []).map(function (f) { return "<li>" + icon("check") + "<span>" + esc(f) + "</span></li>"; }).join("") + "</ul>" +
            '<div class="output-box">' + icon("flag") + '<div><small>Output</small><b>' + esc(c.output) + "</b></div></div>" +
          "</div>";
        }).join("") +
      "</div>";
    add("components", "Research Components", "layers", "Select a component to see what it does and what it produces.", tabs);

    // Scope
    var sc = dm.scope || {};
    add("scope", "Scope", "flag", "What the project covers, and what it deliberately does not.",
      '<div class="grid grid-2 scope-grid">' +
        '<div class="card scope-card scope-in reveal"><h3>' + icon("checkCircle") + " In scope</h3>" +
          '<ul class="scope-list">' + (sc["in"] || []).map(function (t) { return "<li>" + icon("check") + "<span>" + esc(t) + "</span></li>"; }).join("") + "</ul></div>" +
        '<div class="card scope-card scope-out reveal" style="--delay:.1s"><h3>' + icon("xCircle") + " Out of scope</h3>" +
          '<ul class="scope-list">' + (sc.out || []).map(function (t) { return "<li>" + icon("close") + "<span>" + esc(t) + "</span></li>"; }).join("") + "</ul></div>" +
      "</div>");

    // Integration concept (snake-flow diagram)
    var flow = dm.integration || [];
    var COLS = 4;
    var flowHtml = flow.map(function (n, i) {
      var row = Math.floor(i / COLS), pos = i % COLS;
      var col = row % 2 === 0 ? pos + 1 : COLS - pos;
      var last = i === flow.length - 1;
      var dir = last ? "" : (pos === COLS - 1 ? "dir-down" : (row % 2 === 0 ? "dir-right" : "dir-left"));
      return '<li class="flow-node lane-' + esc(n.lane || "app") + " " + dir + ' reveal" style="--col:' + col + ";--row:" + (row + 1) + ";--delay:" + Math.min(i * 0.06, 0.48).toFixed(2) + 's">' +
        '<span class="flow-icon">' + icon(n.icon) + "</span>" +
        '<span class="flow-step">Step ' + (i + 1) + "</span>" +
        '<span class="flow-label">' + esc(n.label) + "</span></li>";
    }).join("");
    add("integration", "Integration Concept", "activity", "How a single activity travels from the child, through the app, to the Buddy device.",
      '<div class="flow-legend reveal" aria-hidden="true">' +
        '<span class="lane-key lane-child">Child</span><span class="lane-key lane-app">Mobile app (offline)</span><span class="lane-key lane-device">Buddy device</span>' +
      "</div>" +
      '<ol class="flow" aria-label="Integration flow">' + flowHtml + "</ol>" +
      (isPlaceholder(dm.architectureDiagram) ? "" :
        '<figure class="diagram reveal"><img src="' + esc(dm.architectureDiagram) + '" alt="' + esc(dm.architectureAlt || "System architecture diagram") + '"><figcaption>System architecture</figcaption></figure>'));

    // Technologies
    add("technologies", "Technologies Used", "code", "",
      '<div class="tech-grid">' + (dm.technologies || []).map(function (t, i) {
        return '<div class="card tech reveal"' + d(i) + '><div class="card-icon">' + icon(t.icon) + "</div><h3>" + esc(t.name) + "</h3>" + (t.role ? "<p>" + esc(t.role) + "</p>" : "") + "</div>";
      }).join("") + "</div>");

    // Success criteria
    add("success", "Success Criteria", "award", "The project is successful when:",
      bulletList(dm.successCriteria, "checkCircle", "success-list"));

    // Ethics
    add("ethics", "Ethics & Safeguarding", "shield", "How children and their data are protected.",
      '<div class="grid grid-3">' + (dm.ethics || []).map(function (e, i) {
        return '<div class="card ethic reveal"' + d(i) + '><div class="card-icon">' + icon(e.icon || "shield") + "</div><p>" + esc(e.text) + "</p></div>";
      }).join("") + "</div>");

    // Risks
    add("risks", "Risks & Mitigation", "alertTriangle", "",
      dataTable("Risks and mitigation", ["Risk", "Mitigation"], (dm.risks || []).map(function (r) {
        return [icon("alertTriangle", "risk-icon") + esc(r.risk), esc(r.mitigation)];
      })));

    root.innerHTML =
      '<div class="container domain-layout">' +
        '<nav class="subnav" aria-label="Domain sections"><p class="subnav-title">On this page</p><ul>' +
          sections.map(function (s) { return '<li><a href="#' + s.id + '">' + esc(s.label) + "</a></li>"; }).join("") +
        "</ul></nav>" +
        "<div>" +
          sections.map(function (s) {
            return '<section class="domain-section" id="' + s.id + '" aria-labelledby="' + s.id + '-h">' +
              '<div class="reveal"><h2 id="' + s.id + '-h"><span class="card-icon">' + icon(s.icon) + "</span>" + esc(s.label) + "</h2>" +
              (s.intro ? '<p class="muted">' + esc(s.intro) + "</p>" : "") + "</div>" +
              s.html + "</section>";
          }).join("") +
        "</div>" +
      "</div>";

    initTabs(root);

    // Scroll-spy for the sub-navigation
    var links = $all(".subnav a", root);
    var nav = $(".subnav", root);
    function activate(id) {
      links.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + id;
        a.classList.toggle("is-active", on);
        if (on) {
          a.setAttribute("aria-current", "location");
          if (nav.scrollWidth > nav.clientWidth) nav.scrollLeft = a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2;
        } else a.removeAttribute("aria-current");
      });
    }
    activate(sections[0].id);
    if ("IntersectionObserver" in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) activate(en.target.id); });
      }, { rootMargin: "-35% 0px -60% 0px" });
      sections.forEach(function (s) { var el = document.getElementById(s.id); if (el) spy.observe(el); });
    }
  }

  // Accessible tabs (arrow keys, Home/End) + deep links like domain.html#c3
  function initTabs(root) {
    var tabs = $all('[role="tab"]', root);
    if (!tabs.length) return;
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) {
          panel.hidden = !on;
          if (on) $all(".reveal", panel).forEach(function (r) { r.classList.add("is-visible"); });
        }
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab, false); });
      tab.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") n = tabs[0];
        else if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    function fromHash() {
      var h = (window.location.hash || "").replace("#", "").toLowerCase();
      var t = h && document.getElementById("tab-" + h);
      if (t) {
        select(t, false);
        var sec = document.getElementById("components");
        if (sec) setTimeout(function () { sec.scrollIntoView(); }, 0);
      }
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
  }

  /* ---------------- Milestones ---------------- */
  function renderMilestones() {
    var root = $("#milestones");
    if (!root) return;
    // Sort assessments by date (undated ones keep their order, at the end)
    var list = (D.milestones || []).map(function (m, i) { return { m: m, i: i, t: parseDate(m.date) }; })
      .sort(function (a, b) {
        if (a.t === null && b.t === null) return a.i - b.i;
        if (a.t === null) return 1;
        if (b.t === null) return -1;
        return a.t - b.t || a.i - b.i;
      }).map(function (x) { return x.m; });
    var phases = D.phases || [];
    var done = list.filter(function (m) { return /^completed$/i.test(m.status); }).length;

    var phaseHtml = phases.map(function (p, i) {
      var row = function (label, v) { return isPlaceholder(v) ? "" : "<dt>" + label + "</dt><dd>" + esc(v) + "</dd>"; };
      var rows = row("Main activity", p.activity) + row("Exit criterion", p.exit);
      return '<li class="card phase reveal"' + d(i) + ">" +
        '<span class="phase-num" aria-hidden="true">' + (i + 1) + "</span>" +
        "<h3>" + esc(p.name) + "</h3>" +
        (rows ? "<dl>" + rows + "</dl>" : "") +
      "</li>";
    }).join("");

    var items = list.map(function (m, i) {
      var isDone = /^completed$/i.test(m.status);
      var id = "ms-" + i;
      return '<li class="tl-item reveal' + (isDone ? " is-done" : "") + '"' + d(i) + ">" +
        '<span class="tl-dot">' + icon(isDone ? "check" : "clock") + "</span>" +
        '<div class="acc">' +
          '<button type="button" class="acc-btn" aria-expanded="false" aria-controls="' + id + '">' +
            '<span class="acc-title"><strong>' + esc(m.title) + "</strong>" + (isPlaceholder(m.date) ? "" : "<span>" + icon("calendar") + esc(m.date) + "</span>") + "</span>" +
            statusBadge(isDone, "Completed", "Upcoming") +
            icon("chevronDown", "acc-chevron") +
          "</button>" +
          '<div class="acc-panel" id="' + id + '" role="region" aria-label="' + esc(m.title) + ' details"><div><div class="acc-body">' +
            "<p>" + esc(m.description) + "</p>" +
            '<div class="facts">' +
              (isPlaceholder(m.date) ? "" : '<div class="fact"><small>' + icon("calendar") + "Date</small><b>" + esc(m.date) + "</b></div>") +
              (isPlaceholder(m.marks) ? "" : '<div class="fact"><small>' + icon("percent") + "Marks</small><b>" + esc(m.marks) + (/%$/.test(String(m.marks)) ? "" : "%") + "</b></div>") +
              '<div class="fact"><small>' + icon("checkCircle") + "Status</small><b>" + esc(isDone ? "Completed" : "Upcoming") + "</b></div>" +
            "</div>" +
            feedbackBox(m.feedback) +
          "</div></div></div>" +
        "</div>" +
      "</li>";
    }).join("");

    root.innerHTML =
      '<div class="container">' +
        (phases.length ?
        '<section aria-labelledby="ph-h" class="phase-block">' +
          '<div class="section-head reveal"><span class="eyebrow">Project Charter</span><h2 id="ph-h">Project phases</h2><p>' + (phases.some(function (p) { return !isPlaceholder(p.activity) || !isPlaceholder(p.exit); }) ? "The phases defined in the charter, each with its main activity and exit criterion." : "The phases defined in the Project Charter.") + '</p></div>' +
          '<ol class="phases">' + phaseHtml + "</ol>" +
        "</section>" : "") +
        '<section aria-labelledby="as-h">' +
          '<div class="section-head reveal"><span class="eyebrow">Assessments</span><h2 id="as-h">Assessment timeline</h2></div>' +
          '<div class="summary-row reveal">' +
            '<div class="stat"><b>' + list.length + "</b><span>Assessments</span></div>" +
            '<div class="stat"><b>' + done + "</b><span>Completed</span></div>" +
            '<div class="stat"><b>' + (list.length - done) + "</b><span>Upcoming</span></div>" +
          "</div>" +
          '<ol class="timeline" style="--progress:' + (list.length ? Math.round(done / list.length * 100) : 0) + '%">' + items + "</ol>" +
        "</section>" +
      "</div>";

    $all(".acc", root).forEach(function (acc, i) {
      var btn = $(".acc-btn", acc);
      function set(open) { acc.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", open ? "true" : "false"); }
      btn.addEventListener("click", function () { set(!acc.classList.contains("is-open")); });
      if (i === 0) set(true);
    });

    wireImageFallbacks(root);
    initLightbox(root);
  }

  // Group-level panel feedback quote (optional image opens in a lightbox)
  function feedbackBox(fb) {
    if (!fb || isPlaceholder(fb.text)) return "";
    var panel = (D.site || {}).panel;
    var img = isPlaceholder(fb.image) ? "" :
      '<figure class="fb-figure" data-fallback-root>' +
        '<a class="fb-zoom" href="' + esc(fb.image) + '" target="_blank" rel="noopener noreferrer" aria-label="Enlarge: ' + esc(fb.imageAlt || "panel feedback") + '">' +
          '<img src="' + esc(fb.image) + '" alt="' + esc(fb.imageAlt || "Panel feedback") + '" loading="lazy" data-fallback="hide">' +
          '<span class="fb-zoom-hint" aria-hidden="true">' + icon("search") + " Click to enlarge</span>" +
        "</a>" +
      "</figure>";
    return '<blockquote class="feedback-box">' +
      '<p class="fb-label">' + icon("award") + " Panel Feedback" + (panel ? ' <span class="fb-panel">Panel ' + esc(panel) + "</span>" : "") + "</p>" +
      '<p class="fb-text">' + esc(fb.text) + "</p>" +
      img +
    "</blockquote>";
  }

  // Lightweight lightbox using <dialog>; falls back to opening the image in a new tab
  function initLightbox(root) {
    var links = $all(".fb-zoom", root);
    if (!links.length || typeof document.createElement("dialog").showModal !== "function") return; // old browser: the link simply opens the image
    var dlg = null, big = null;
    function ensureDialog() { // built on first use, so no empty <img> sits in the page
      if (dlg) return;
      dlg = document.createElement("dialog");
      dlg.className = "lightbox";
      dlg.setAttribute("aria-label", "Enlarged image");
      dlg.innerHTML = '<button type="button" class="icon-btn lightbox-close" aria-label="Close">' + icon("close") + "</button>";
      big = document.createElement("img");
      dlg.appendChild(big);
      document.body.appendChild(dlg);
      $(".lightbox-close", dlg).addEventListener("click", function () { dlg.close(); });
      dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); }); // click on backdrop
    }
    links.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        ensureDialog();
        var img = $("img", a);
        big.src = img ? img.currentSrc || img.src : a.href;
        big.alt = img ? img.alt : "";
        dlg.showModal();
      });
    });
  }


  /* ---------------- Documents ---------------- */
  function renderDocuments() {
    var root = $("#documents");
    if (!root) return;
    var groups = D.documents || [];
    var total = 0, submitted = 0;

    var html = groups.map(function (g, gi) {
      var count = 0;
      var cards = (g.items || []).map(function (it, i) {
        var pending = isPendingLink(it.link);
        total++; count++; if (!pending) submitted++;
        // Sub-documents grouped inside a main card (e.g. individual proposals under the group proposal)
        var kids = (it.children || []).map(function (ch) {
          var chPending = isPendingLink(ch.link);
          total++; count++; if (!chPending) submitted++;
          return '<li class="sub-doc">' +
            '<span class="sub-doc-icon">' + icon("user") + "</span>" +
            '<span class="sub-doc-text"><b>' + esc(ch.title) + "</b>" + (ch.subtitle ? "<small>" + esc(ch.subtitle) + "</small>" : "") + "</span>" +
            statusBadge(!chPending, "Submitted", "Pending") +
            viewButton(ch.link, "View", "proposal of " + ch.title) +
          "</li>";
        }).join("");
        return '<article class="card doc-card' + (it.featured ? " doc-featured" : "") + ' reveal"' + d(i) + ">" +
          '<div class="doc-top"><div class="card-icon">' + icon(it.icon || "file") + "</div>" + statusBadge(!pending, "Submitted", "Pending") + "</div>" +
          "<h3>" + esc(it.title) + "</h3><p>" + esc(it.description) + "</p>" +
          viewButton(it.link, "View", it.title) +
          (kids ? '<h4 class="sub-doc-head">Individual proposals</h4><ul class="sub-docs">' + kids + "</ul>" : "") +
        "</article>";
      }).join("");
      return '<section class="doc-group" data-group="' + gi + '" aria-labelledby="dg-' + gi + '">' +
        '<h2 class="doc-group-title reveal" id="dg-' + gi + '">' + esc(g.group) + ' <span class="count">' + count + "</span></h2>" +
        '<div class="grid grid-auto">' + cards + "</div></section>";
    }).join("");

    var chips = '<button type="button" class="chip" aria-pressed="true" data-filter="all">All</button>' +
      groups.map(function (g, gi) { return '<button type="button" class="chip" aria-pressed="false" data-filter="' + gi + '">' + esc(g.group) + "</button>"; }).join("");

    root.innerHTML =
      '<div class="container">' +
        '<div class="summary-row reveal">' +
          '<div class="stat"><b>' + total + "</b><span>Documents</span></div>" +
          '<div class="stat"><b>' + submitted + "</b><span>Submitted</span></div>" +
          '<div class="stat"><b>' + (total - submitted) + "</b><span>Pending</span></div>" +
        "</div>" +
        '<div class="filter-bar reveal" role="group" aria-label="Filter documents">' + chips + "</div>" +
        html +
      "</div>";

    $all(".chip", root).forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter");
        $all(".chip", root).forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
        $all(".doc-group", root).forEach(function (g) {
          g.hidden = !(f === "all" || g.getAttribute("data-group") === f);
          if (!g.hidden) $all(".reveal", g).forEach(function (r) { r.classList.add("is-visible"); });
        });
      });
    });
  }

  /* ---------------- Presentations ---------------- */
  function renderPresentations() {
    var root = $("#presentations");
    if (!root) return;
    var cards = (D.presentations || []).map(function (p, i) {
      var pending = isPendingLink(p.link);
      return '<article class="card doc-card reveal"' + d(i) + ">" +
        '<div class="slide-thumb' + (pending ? " is-pending" : "") + '" aria-hidden="true"><span class="num">0' + (i + 1) + "</span>" + icon("monitor") + "</div>" +
        '<div class="doc-top"><h3>' + esc(p.title) + "</h3>" + statusBadge(!pending, "Completed", "Pending") + "</div>" +
        (isPlaceholder(p.date) ? "" : '<p class="card-meta">' + icon("calendar") + esc(p.date) + "</p>") +
        "<p>" + esc(p.description) + "</p>" +
        viewButton(p.link, "View Slides", p.title) +
      "</article>";
    }).join("");
    root.innerHTML = '<div class="container"><div class="grid grid-2">' + cards + "</div></div>";
  }

  /* ---------------- About ---------------- */
  function personCard(p, i, opts) {
    opts = opts || {};
    var hasName = !isPlaceholder(p.name);
    var name = hasName ? p.name : "To be announced";
    var alt = hasName ? "Photo of " + p.name : "Photo of the " + (p.role || "team member");
    var size = opts.sup ? 160 : 144;
    // Unknown email / designation → the line is hidden rather than showing "TBA"
    var mail = isPlaceholder(p.email) ? "" :
      '<a class="mail" href="mailto:' + esc(p.email) + '">' + icon("mail") + esc(p.email) + "</a>";
    var designation = isPlaceholder(p.designation) ? "" : '<span class="it">' + esc(p.designation) + "</span>";
    var leader = /leader/i.test(p.role || "");
    return '<article class="card person' + (leader ? " is-leader" : "") + ' reveal"' + d(i) + ">" +
      '<div class="avatar' + (opts.sup ? " avatar-sup" : "") + '"><img src="' + esc(p.photo) + '" alt="' + esc(alt) + '" width="' + size + '" height="' + size + '" data-fallback="initials" data-initials="' + esc(initials(p.name)) + '"></div>' +
      (p.role && !opts.sup ? '<span class="role">' + esc(p.role) + "</span>" : "") +
      "<h3>" + esc(name) + "</h3>" + designation + (opts.extra || "") + mail +
    "</article>";
  }
  function renderAbout() {
    var root = $("#about");
    if (!root) return;
    var t = D.team || {};
    var members = (t.members || []).map(function (m, i) {
      return personCard(m, i, { extra: (isPlaceholder(m.itNumber) ? "" : '<span class="it">' + esc(m.itNumber) + "</span>") + '<span class="comp">' + esc(m.component) + "</span>" });
    }).join("");
    var sups = (t.supervisors || []).map(function (s, i) {
      return personCard(s, i, { sup: true, extra: '<span class="comp">' + esc(s.role) + "</span>" });
    }).join("");
    root.innerHTML =
      '<section class="section" style="padding-top:24px" aria-labelledby="team-h"><div class="container">' +
        '<div class="section-head reveal"><span class="eyebrow">Research team</span><h2 id="team-h">Group members</h2></div>' +
        '<div class="grid grid-4">' + members + "</div>" +
      "</div></section>" +
      '<section class="section section-alt" aria-labelledby="sup-h"><div class="container">' +
        '<div class="section-head reveal"><span class="eyebrow">Guidance</span><h2 id="sup-h">Supervisors</h2></div>' +
        '<div class="grid grid-2 sup-grid">' + sups + "</div>" +
      "</div></section>";
    wireImageFallbacks(root);
  }

  /* ---------------- Contact ---------------- */
  function renderContact() {
    var root = $("#contact");
    if (!root) return;
    var c = D.contact || {}, s = D.site || {};
    var hasEmail = !isPlaceholder(c.groupEmail);
    var hasPhone = !isPlaceholder(c.phone);
    function info(ic, label, value) {
      return '<div class="card info-item reveal"><div class="card-icon">' + icon(ic) + "</div><div><small>" + label + "</small>" + value + "</div></div>";
    }
    root.innerHTML =
      '<div class="container"><div class="contact-grid">' +
        '<div class="contact-info">' +
          (hasEmail ? info("mail", "Group email", '<a href="mailto:' + esc(c.groupEmail) + '">' + esc(c.groupEmail) + "</a>") : "") +
          (hasPhone ? info("phone", "Phone", '<a href="' + esc(c.phoneLink || "tel:" + String(c.phone).replace(/\s+/g, "")) + '">' + esc(c.phone) + "</a>") : "") +
          info("mapPin", "Address", "<b>" + esc(c.address) + "</b>") +
          '<div class="reveal"><div class="map-wrap"><iframe src="' + esc(c.mapEmbed) + '" title="Map showing SLIIT Malabe campus" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>' +
          '<a class="map-link" href="' + esc(c.mapLink) + '" target="_blank" rel="noopener noreferrer">Open in Google Maps ' + icon("external") + "</a></div>" +
        "</div>" +
        '<div class="card reveal" style="--delay:.1s">' +
          "<h2>Send us a message</h2>" +
          '<p class="muted">Fill in the form and press send — your email app will open with the message ready to go.</p>' +
          '<form class="form" id="contact-form" novalidate>' +
            '<div class="form-row">' +
              '<div class="field"><label for="cf-name">Your name</label><input id="cf-name" name="name" autocomplete="name" required><span class="err" aria-live="polite"></span></div>' +
              '<div class="field"><label for="cf-email">Your email</label><input id="cf-email" name="email" type="email" autocomplete="email" required><span class="err" aria-live="polite"></span></div>' +
            "</div>" +
            '<div class="field"><label for="cf-topic">Topic</label><select id="cf-topic" name="topic">' +
              "<option>General enquiry</option><option>Research collaboration</option><option>Request a demo</option><option>Feedback</option>" +
            "</select></div>" +
            '<div class="field"><label for="cf-subject">Subject</label><input id="cf-subject" name="subject" required><span class="err" aria-live="polite"></span></div>' +
            '<div class="field"><label for="cf-msg">Message</label><textarea id="cf-msg" name="message" required></textarea><span class="err" aria-live="polite"></span></div>' +
            '<p class="notice" id="cf-notice" role="status" hidden>' + icon("alert") + "<span></span></p>" +
            '<button type="submit" class="btn btn-primary">' + icon("send") + " Open in email app</button>" +
            '<p class="form-note">Nothing is sent from this website — it only prepares an email in your own mail app.</p>' +
          "</form>" +
        "</div>" +
      "</div></div>";

    var form = $("#contact-form", root);
    var notice = $("#cf-notice", root);
    function F(n) { return form.elements.namedItem(n); }
    function setErr(input, msg) {
      var f = input.closest(".field");
      f.classList.toggle("has-error", !!msg);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      $(".err", f).textContent = msg || "";
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = F("name").value.trim(), email = F("email").value.trim(), subject = F("subject").value.trim(), msg = F("message").value.trim();
      var ok = true;
      setErr(F("name"), name ? "" : "Please enter your name."); ok = ok && !!name;
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setErr(F("email"), emailOk ? "" : "Please enter a valid email address."); ok = ok && emailOk;
      setErr(F("subject"), subject ? "" : "Please add a subject."); ok = ok && !!subject;
      setErr(F("message"), msg ? "" : "Please write a message."); ok = ok && !!msg;
      if (!ok) { var bad = $("[aria-invalid='true']", form); if (bad) bad.focus(); return; }

      if (!hasEmail) {
        notice.hidden = false;
        $("span", notice).textContent = "The group email address hasn't been set yet, so the message can't be addressed. Please try again later.";
        return;
      }
      notice.hidden = true;
      var fullSubject = "[" + (s.projectId || "Research") + "] " + F("topic").value + ": " + subject;
      var body =
        "Hello " + (s.title || "") + " team (" + (s.projectId || "") + "),\n\n" +
        msg + "\n\n" +
        "Best regards,\n" + name + "\n" + email + "\n\n" +
        "---\nSent via the " + (s.title || "") + " research website";
      window.location.href = "mailto:" + encodeURIComponent(c.groupEmail).replace(/%40/g, "@") +
        "?subject=" + encodeURIComponent(fullSubject) + "&body=" + encodeURIComponent(body);
    });
    $all("input, textarea", form).forEach(function (inp) {
      inp.addEventListener("input", function () { if (inp.getAttribute("aria-invalid") === "true") setErr(inp, ""); });
    });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    var page = document.body.getAttribute("data-page") || "";
    renderHeader(page);
    renderFooter();
    ({
      home: renderHome,
      domain: renderDomain,
      milestones: renderMilestones,
      documents: renderDocuments,
      presentations: renderPresentations,
      about: renderAbout,
      contact: renderContact
    }[page] || function () {})();
    initReveal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
