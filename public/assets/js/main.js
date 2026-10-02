/**
 * Template Name: FolioOne
 * Template URL: https://bootstrapmade.com/folioone-bootstrap-portfolio-website-template/
 * Updated: Aug 23 2025 with Bootstrap v5.3.7
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";
  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */

  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100 ? selectBody.classList.add("scrolled") : selectBody.classList.remove("scrolled");
  }
  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);
  /**
   * Mobile nav toggle
   */

  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToogle);
  }
  /**
   * Hide mobile nav on same-page/hash links
   */

  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });
  /**
   * Toggle mobile nav dropdowns
   */

  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });
  /**
   * Preloader
   */

  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }
  /**
   * Scroll top button
   */

  let scrollTop = document.querySelector(".scroll-top");
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add("active") : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);
  /**
   * Animation on scroll function and init
   */

  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);
  /**
   * Init typed.js after database content is loaded
   */

  let typedInstance = null;
  function initTypedFromDatabase() {
    const selectTyped = document.querySelector(".typed");
    if (!selectTyped || typeof Typed === "undefined") return;
    const typedStrings = selectTyped.getAttribute("data-typed-items");
    if (!typedStrings) return;
    if (typedInstance && typeof typedInstance.destroy === "function") {
      typedInstance.destroy();
    }
    const strings = typedStrings
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (!strings.length) return;
    selectTyped.textContent = "";
    typedInstance = new Typed(".typed", {
      strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  }
  window.addEventListener("site-data-loaded", initTypedFromDatabase);
  /**
   * Animate the skills items on reveal
   */

  let skillsAnimation = document.querySelectorAll(".skills-animation");
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: "80%",
      handler: function (direction) {
        let progress = item.querySelectorAll(".progress .progress-bar");
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  });
  /**
   * Initiate Pure Counter
   */

  new PureCounter();
  /**
   * Init swiper sliders
   */

  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(swiperElement.querySelector(".swiper-config").innerHTML.trim());
      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);
  /**
   * Init isotope layout and filters
   * Re-run after database content is rendered.
   */

  let isotopeInstances = [];
  function initIsotopeLayouts() {
    isotopeInstances.forEach((instance) => {
      if (instance && typeof instance.destroy === "function") {
        instance.destroy();
      }
    });
    isotopeInstances = [];
    document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
      const container = isotopeItem.querySelector(".isotope-container");
      if (!container || typeof Isotope === "undefined" || typeof imagesLoaded === "undefined") return;
      const layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
      const filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
      const sort = isotopeItem.getAttribute("data-sort") ?? "original-order";
      imagesLoaded(container, function () {
        const instance = new Isotope(container, {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter,
          sortBy: sort,
        });
        isotopeInstances.push(instance);
        isotopeItem.querySelectorAll(".isotope-filters li").forEach(function (filterItem) {
          filterItem.addEventListener(
            "click",
            function () {
              const active = isotopeItem.querySelector(".isotope-filters .filter-active");
              if (active) active.classList.remove("filter-active");
              this.classList.add("filter-active");
              instance.arrange({
                filter: this.getAttribute("data-filter"),
              });
              if (typeof aosInit === "function") aosInit();
            },
            false,
          );
        });
      });
    });
  }
  initIsotopeLayouts();
  window.addEventListener("site-data-loaded", initIsotopeLayouts);
  /**
   * Initiate glightbox
   * Re-run after database content is rendered.
   */

  let glightboxInstance = null;
  function initGlightbox() {
    if (typeof GLightbox === "undefined") return;
    if (glightboxInstance && typeof glightboxInstance.destroy === "function") {
      glightboxInstance.destroy();
    }
    glightboxInstance = GLightbox({ selector: ".glightbox" });
  }
  initGlightbox();
  window.addEventListener("site-data-loaded", initGlightbox);
})();
