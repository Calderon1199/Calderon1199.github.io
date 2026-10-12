(function () {
  "use strict";

  const body = document.body;
  const root = document.documentElement;

  /* ---------------------------------------------------------------------
     Theme: system preference by default, explicit choice persisted.
     The pre-paint script in <head> has already applied any stored value.
     --------------------------------------------------------------------- */

  const themeToggle = document.querySelector("[data-theme-toggle]");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  const readStored = () => {
    try {
      const stored = localStorage.getItem("theme");
      return stored === "dark" || stored === "light" ? stored : null;
    } catch (e) {
      return null;
    }
  };

  const activeTheme = () => root.getAttribute("data-theme") || (systemDark.matches ? "dark" : "light");

  /* Browsers use the FIRST theme-color whose media matches, so an explicit
     choice needs an unscoped meta inserted ahead of the media-scoped pair.
     With no explicit choice we remove it and let those two do their job. */
  const syncThemeColor = () => {
    const explicit = root.getAttribute("data-theme");
    let override = document.querySelector('meta[name="theme-color"][data-theme-override]');

    if (!explicit) {
      if (override) {
        override.remove();
      }
      return;
    }

    if (!override) {
      override = document.createElement("meta");
      override.setAttribute("name", "theme-color");
      override.setAttribute("data-theme-override", "");
      const first = document.querySelector('meta[name="theme-color"]');
      if (first) {
        first.parentNode.insertBefore(override, first);
      } else {
        document.head.appendChild(override);
      }
    }

    override.setAttribute("content", explicit === "dark" ? "#12120f" : "#fbfaf7");
  };

  const syncToggle = () => {
    syncThemeColor();

    if (!themeToggle) {
      return;
    }

    const next = activeTheme() === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", "Switch to " + next + " theme");
  };

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = activeTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);

      try {
        localStorage.setItem("theme", next);
      } catch (e) { /* private mode: choice applies for this page view only */ }

      syncToggle();
    });
  }

  // Follow the OS only while the visitor has not made an explicit choice.
  const onSystemChange = () => {
    if (!readStored()) {
      root.removeAttribute("data-theme");
      syncToggle();
    }
  };

  if (typeof systemDark.addEventListener === "function") {
    systemDark.addEventListener("change", onSystemChange);
  } else if (typeof systemDark.addListener === "function") {
    systemDark.addListener(onSystemChange);
  }

  syncToggle();

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".masthead__nav");
  const navLinks = Array.from(document.querySelectorAll(".masthead__nav a"));

  // Only anchor links map to sections. A PDF or external href must not reach querySelector.
  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      return href && href.startsWith("#") ? document.querySelector(href) : null;
    })
    .filter(Boolean);

  const closeNav = () => {
    body.classList.remove("nav-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => link.addEventListener("click", closeNav));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });
  }

  if (sections.length) {
    const setActiveLink = () => {
      const marker = window.scrollY + window.innerHeight * 0.3;
      let activeId = "";

      sections.forEach((section) => {
        if (marker >= section.offsetTop) {
          activeId = section.id;
        }
      });

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + activeId);
      });
    };

    setActiveLink();
    window.addEventListener("scroll", setActiveLink, { passive: true });
    window.addEventListener("resize", setActiveLink);
  }
})();
