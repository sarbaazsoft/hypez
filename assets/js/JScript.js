document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const toggleBtn = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  const themeIcon = document.getElementById("themeIcon");
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const themes = document.querySelectorAll('[name="theme"][type="radio"]');
  const html = document.documentElement;

  // --- Configurations ---
  const defaultMode = "light";
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const toggleBtnOriginalHTML = toggleBtn ? toggleBtn.innerHTML : "";
  const closeIconHTML = "✕";

  // ==========================================
  // 1. MOBILE HAMBURGER MENU
  // ==========================================
  function setToggleIcon(isOpen) {
    if (!toggleBtn) return;
    toggleBtn.innerHTML = isOpen ? closeIconHTML : toggleBtnOriginalHTML;
    toggleBtn.classList.toggle("rotate-90", isOpen);
  }

  if (toggleBtn && menu) {
    // Open/Close menu
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle("menu-open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
      setToggleIcon(isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
        menu.classList.remove("menu-open");
        toggleBtn.setAttribute("aria-expanded", "false");
        setToggleIcon(false);
      }
    });

    // Close menu when clicking any nav link
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("menu-open");
        toggleBtn.setAttribute("aria-expanded", "false");
        setToggleIcon(false);
      });
    });
  }

  // ==========================================
  // 2. THEME DROPDOWN & SWITCHER
  // ==========================================
  if (themeIcon && dropdownMenu) {
    // Toggle theme dropdown menu
    themeIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("hidden");
    });

    // Close dropdown menu on outside click
    document.addEventListener("click", (e) => {
      if (!themeIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });
  }

  const saveTheme = (themeID) => {
    const themeInput = document.getElementById(themeID);
    if (!themeInput) return;

    // Update active icon on button
    const label = themeInput.nextElementSibling;
    const svg = label ? label.querySelector("svg") : null;
    if (svg && themeIcon) {
      themeIcon.innerHTML = svg.outerHTML;
    }

    themeInput.checked = true;

    switch (themeID) {
      case "light":
        localStorage.setItem("theme", "light");
        html.classList.remove("dark");
        html.classList.add("light");
        break;
      case "dark":
        localStorage.setItem("theme", "dark");
        html.classList.remove("light");
        html.classList.add("dark");
        break;
      case "system":
        localStorage.setItem("theme", "system");
        if (darkModeQuery.matches) {
          html.classList.remove("light");
          html.classList.add("dark");
        } else {
          html.classList.remove("dark");
          html.classList.add("light");
        }
        break;
      default:
        localStorage.removeItem("theme");
        html.classList.remove("dark");
        html.classList.add(defaultMode);
        break;
    }
  };

  // Radio button click listeners
  themes.forEach((theme) => {
    theme.addEventListener("change", () => {
      saveTheme(theme.id);
      if (dropdownMenu) {
        dropdownMenu.classList.add("hidden");
      }
    });
  });

  // Dynamic system dark mode listener
  darkModeQuery.addEventListener("change", (e) => {
    if (localStorage.getItem("theme") === "system") {
      if (e.matches) {
        html.classList.remove("light");
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
        html.classList.add("light");
      }
    }
  });

  // Initialize theme on page load
  const currentTheme = localStorage.getItem("theme") || defaultMode;
  saveTheme(currentTheme);

  // ==========================================
  // 3. SWIPER CAROUSEL INITIALIZATION
  // ==========================================
  if (document.querySelector(".swiper")) {
    new Swiper(".swiper", {
      slidesPerView: "auto",
      spaceBetween: 10,
      centeredSlides: true,
      centeredSlidesBounds: true,
      watchOverflow: true,
      breakpointsBase: "container",
      navigation: {
        nextEl: "#nextBtn",
        prevEl: "#prevBtn",
      },
      breakpoints: {
        480: { slidesPerView: 2.1, spaceBetween: 16 },
        768: { slidesPerView: 2.4, spaceBetween: 20 },
        920: { slidesPerView: 3.4, spaceBetween: 24 },
        1020: { slidesPerView: 4.2, spaceBetween: 30 },
      },
    });
  }
});