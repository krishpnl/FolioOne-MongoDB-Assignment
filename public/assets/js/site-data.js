(function () {
  "use strict";
  const API = "/api";
  document.addEventListener("DOMContentLoaded", loadSiteData);
  async function loadSiteData() {
    try {
      const [home, social] = await Promise.all([getData("/home"), getData("/social-links")]);
      renderGlobal(home, social);
      if (home?.name) {
        document.title = `${home.name} | Portfolio`;
      }
      const body = document.body;
      if (body.classList.contains("index-page")) {
        renderHome(home);
      }
      if (body.classList.contains("about-page")) {
        const [about, skills, skillCards, journey, facts, stats, testimonials] = await Promise.all([
          getData("/about"),
          getData("/skills"),
          getData("/about-skill-cards"),
          getData("/about-journey"),
          getData("/about-facts"),
          getData("/stats"),
          getData("/testimonials"),
        ]);
        renderAbout(about, home, skills, skillCards, journey, facts, stats, testimonials);
      }
      if (body.classList.contains("resume-page")) {
        const [education, experience, skills] = await Promise.all([
          getData("/education"),
          getData("/experience"),
          getData("/skills"),
        ]);
        renderResume(home, education, experience, skills);
      }
      if (body.classList.contains("services-page")) {
        renderServices(await getData("/services"));
      }
      if (body.classList.contains("portfolio-page")) {
        renderPortfolio(await getData("/projects"));
      }
      if (body.classList.contains("contact-page")) {
        renderContact(await getData("/about"));
      }
      if (body.classList.contains("portfolio-details-page")) {
        renderPortfolioDetails(await getData("/projects"));
      }
      if (body.classList.contains("service-details-page")) {
        renderServiceDetails(await getData("/services"));
      }
    } catch (error) {
      console.error("Website data loading error:", error);
    } finally {
      window.dispatchEvent(new Event("site-data-loaded"));
    }
  }
  async function getData(endpoint) {
    const response = await fetch(`${API}${endpoint}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Unable to load ${endpoint}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || `Unable to load ${endpoint}`);
    }
    return result.data;
  }
  function renderGlobal(home, social) {
    const siteName = home?.name || "";
    document.querySelectorAll("[data-site-name]").forEach((element) => {
      element.textContent = siteName;
    });
    renderSocialLinks(Array.isArray(social) ? social : []);
  }
  function renderSocialLinks(links) {
    document.querySelectorAll("[data-social-links]").forEach((container) => {
      container.innerHTML = links
        .map(
          (link) => `
        <a href="${escapeAttribute(link.url)}"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="${escapeAttribute(link.platform)}">
          <i class="${escapeAttribute(link.icon || "bi bi-link-45deg")}"></i>
        </a>
      `,
        )
        .join("");
    });
  }
  function renderHome(home) {
    if (!home) return;
    const greeting = document.querySelector("[data-home-greeting]");
    const title = document.querySelector("[data-home-name]");
    const typed = document.querySelector("[data-home-title]");
    const titlePrefix = document.querySelector("[data-home-title-prefix]");
    const description = document.querySelector("[data-home-description]");
    const image = document.querySelector("[data-home-image]");
    if (greeting) greeting.textContent = home.greeting || "";
    if (title) title.textContent = home.name || "";
    if (titlePrefix) titlePrefix.textContent = home.titlePrefix || "Creative";
    if (typed) {
      typed.setAttribute("data-typed-items", home.title || "");
      typed.textContent = "";
    }
    if (description) description.textContent = home.description || "";
    if (image && home.profileImage) {
      image.src = home.profileImage;
      image.alt = home.name || "Profile";
    }
    const cards = [
      ["[data-home-card1-icon]", "[data-home-card1-title]", home.card1Icon, home.card1Title],
      ["[data-home-card2-icon]", "[data-home-card2-title]", home.card2Icon, home.card2Title],
      ["[data-home-card3-icon]", "[data-home-card3-title]", home.card3Icon, home.card3Title],
    ];
    cards.forEach(([iconSelector, titleSelector, icon, text]) => {
      const iconElement = document.querySelector(iconSelector);
      const titleElement = document.querySelector(titleSelector);
      if (iconElement) iconElement.className = icon || "bi bi-lightbulb";
      if (titleElement) titleElement.textContent = text || "";
    });
    document.querySelectorAll("[data-home-resume]").forEach((link) => {
      link.href = home.resumeLink || "#";
    });
  }
  function renderAbout(about, home, skills, skillCards, journeyItems, factsItems, stats, testimonials) {
    if (!about) return;
    const sectionTitle = document.querySelector("[data-about-section-title]");
    const sectionDescription = document.querySelector("[data-about-section-description]");
    const eyebrow = document.querySelector("[data-about-eyebrow]");
    const headline = document.querySelector("[data-about-headline]");
    const lead = document.querySelector("[data-about-lead]");
    const body = document.querySelector("[data-about-body]");
    const image = document.querySelector("[data-about-image]");
    const resume = document.querySelector("[data-about-resume]");
    const quote = document.querySelector("[data-about-quote]");
    const skillCardsContainer = document.querySelector("[data-about-skill-cards]");
    const journey = document.querySelector("[data-about-journey]");
    const facts = document.querySelector("[data-about-facts]");
    const skillsContainer = document.querySelector("[data-skills-container]");
    const statsContainer = document.querySelector("[data-stats-container]");
    const testimonialsContainer = document.querySelector("[data-testimonials-container]");
    if (sectionTitle) sectionTitle.textContent = about.sectionTitle || "About";
    if (sectionDescription) sectionDescription.textContent = about.sectionDescription || "";
    if (eyebrow) eyebrow.textContent = about.eyebrow || "";
    if (headline) headline.textContent = about.headline || "";
    if (lead) lead.textContent = about.lead || "";
    if (body) body.textContent = about.body || "";
    if (image) {
      image.src = about.profileImage || home?.profileImage || "";
      image.alt = home?.name || "Profile";
    }
    if (resume) {
      resume.href = about.resumeLink || home?.resumeLink || "resume.html";
    }
    if (quote) {
      quote.textContent = about.quote || "";
      quote.parentElement.style.display = about.quote ? "" : "none";
    }
    if (skillCardsContainer) {
      const cards = Array.isArray(skillCards) ? skillCards : [];
      skillCardsContainer.innerHTML = cards
        .map(
          (item, index) => `
        <div class="col-6 col-md-4 col-lg-3" data-aos="fade-up" data-aos-delay="${120 + index * 60}">
          <div class="skill-item">
            <i class="${escapeAttribute(item.icon || "bi bi-code-slash")}"></i>
            <h3>${escapeHTML(item.title || "")}</h3>
            <p>${escapeHTML(item.description || "")}</p>
          </div>
        </div>
      `,
        )
        .join("");
    }
    if (skillsContainer) {
      skillsContainer.innerHTML = (skills || [])
        .map(
          (skill) => `
        <div class="col-md-6 col-lg-3">
          <div class="skill-box">
            <h3>${escapeHTML(skill.name || "")}</h3>
            <p>${escapeHTML(skill.category || "")}</p>
            <div class="progress">
              <div class="progress-bar" role="progressbar" aria-valuenow="${Number(skill.percentage || 0)}" aria-valuemin="0" aria-valuemax="100" style="width:${Number(skill.percentage || 0)}%"></div>
            </div>
          </div>
        </div>
      `,
        )
        .join("");
    }
    if (journey) {
      const items = Array.isArray(journeyItems) ? journeyItems : [];
      journey.innerHTML = items.length
        ? `
        <div class="row g-4">
          ${items
            .map(
              (item, index) => `
            <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="${120 + index * 60}">
              <article class="timeline-item">
                <span class="dot"></span>
                <time>${escapeHTML(item.year || "")}</time>
                <h4>${escapeHTML(item.title || "")}</h4>
                <p>${escapeHTML(item.description || "")}</p>
              </article>
            </div>
          `,
            )
            .join("")}
        </div>
      `
        : "";
    }
    if (facts) {
      const items = Array.isArray(factsItems) ? factsItems : [];
      facts.innerHTML = items
        .map(
          (item, index) => `
        <div class="col-6 col-md-3 col-lg-2" data-aos="zoom-in" data-aos-delay="${120 + index * 40}">
          <div class="fact-pill">
            <i class="${escapeAttribute(item.icon || "bi bi-lightbulb")}"></i>
            <span>${escapeHTML(item.text || "")}</span>
          </div>
        </div>
      `,
        )
        .join("");
    }
    if (statsContainer) {
      const items = Array.isArray(stats) ? stats : [];
      statsContainer.innerHTML = items
        .map(
          (item, index) => `
    <div class="col-md-4" data-aos="fade-up" data-aos-delay="${300 + index * 100}">
      <h2><span data-purecounter-start="0" data-purecounter-end="${Number(item.value || 0)}" data-purecounter-duration="1" class="purecounter">${Number(item.value || 0)}</span>${escapeHTML(item.suffix || "")}</h2>
      <p>${escapeHTML(item.label || "")}</p>
    </div>
  `,
        )
        .join("");
      if (typeof PureCounter !== "undefined") new PureCounter();
    }
    if (testimonialsContainer) {
      const items = Array.isArray(testimonials) ? testimonials : [];
      testimonialsContainer.innerHTML = items
        .map((item) => {
          const stars = Array.from(
            { length: Math.min(5, Math.max(1, Number(item.rating || 5))) },
            () => '<i class="bi bi-star-fill"></i>',
          ).join("");
          const image = item.image || "assets/img/person/person-m-2.webp";
          return `
          <div class="swiper-slide">
            <div class="testimonial-item">
              <div class="testimonial-content">
                <p><i class="bi bi-quote quote-icon-left"></i>${escapeHTML(item.quote || "")}<i class="bi bi-quote quote-icon-right"></i></p>
              </div>
              <img src="${escapeAttribute(image)}" class="testimonial-img" alt="${escapeAttribute(item.name || "Testimonial")}" loading="lazy">
              <h3>${escapeHTML(item.name || "")}</h3>
              <h4>${escapeHTML(item.role || "")}</h4>
              <div class="stars">${stars}</div>
            </div>
          </div>
        `;
        })
        .join("");
    }
  }
  function renderResume(home, education, experience, skills) {
    const description = document.querySelector("[data-resume-description]");
    if (description) description.textContent = home?.description || "";
    const educationContainer = document.querySelector("[data-education-list]");
    if (educationContainer) {
      educationContainer.innerHTML = (education || [])
        .map(
          (item) => `
        <article class="education-item">
          <h4>${escapeHTML(item.degree)}</h4>
          <h5>${escapeHTML([item.startYear, item.endYear].filter(Boolean).join(" - "))}</h5>
          <p class="institution"><em>${escapeHTML(item.institution)}${item.location ? ` — ${escapeHTML(item.location)}` : ""}</em></p>
          <p>${escapeHTML(item.description || "")}</p>
        </article>
      `,
        )
        .join("");
    }
    const skillsContainer = document.querySelector("[data-resume-skills]");
    if (skillsContainer) {
      skillsContainer.innerHTML = (skills || [])
        .map(
          (skill) => `
        <div class="skill-item">
          <h4>${escapeHTML(skill.name)}</h4>
          <div class="progress">
            <div class="progress-bar" role="progressbar"
              aria-valuenow="${Number(skill.percentage || 0)}"
              aria-valuemin="0" aria-valuemax="100"
              style="width:${Number(skill.percentage || 0)}%"></div>
          </div>
        </div>
      `,
        )
        .join("");
    }
    const experienceContainer = document.querySelector("[data-experience-list]");
    if (experienceContainer) {
      experienceContainer.innerHTML = (experience || [])
        .map(
          (item) => `
        <article class="experience-item">
          <h4>${escapeHTML(item.position)}</h4>
          <h5>${escapeHTML([item.startDate, item.endDate].filter(Boolean).join(" - "))}</h5>
          <p class="company"><em>${escapeHTML(item.company)}${item.location ? ` — ${escapeHTML(item.location)}` : ""}</em></p>
          <p>${escapeHTML(item.description || "")}</p>
        </article>
      `,
        )
        .join("");
    }
  }
  function renderServices(services) {
    const container = document.querySelector("[data-services-list]");
    if (!container) return;
    container.innerHTML = (services || [])
      .map(
        (service, index) => `
      <div class="col-md-6" data-aos="fade-${index % 2 ? "left" : "right"}" data-aos-delay="${100 + Math.floor(index / 2) * 100}">
        <div class="service-item">
          <div class="service-icon"><i class="${escapeAttribute(service.icon || "bi bi-code-slash")}"></i></div>
          <div class="service-content">
            <h3>${escapeHTML(service.title)}</h3>
            <p>${escapeHTML(service.description)}</p>
            <a href="service-details.html?id=${encodeURIComponent(service._id)}" class="service-link">
              <span>Learn More</span><i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `,
      )
      .join("");
  }
  function renderPortfolio(projects) {
    const filters = document.querySelector("[data-portfolio-filters]");
    const container = document.querySelector("[data-portfolio-list]");
    if (!container) return;
    const categories = [...new Set((projects || []).map((project) => project.category).filter(Boolean))];
    if (filters) {
      filters.innerHTML =
        `<li data-filter="*" class="filter-active">All</li>` +
        categories
          .map((category) => `<li data-filter=".filter-${slugify(category)}">${escapeHTML(category)}</li>`)
          .join("");
    }
    container.innerHTML = (projects || [])
      .map((project) => {
        const category = project.category || "Web";
        const filterClass = `filter-${slugify(category)}`;
        const image = project.image || "assets/img/services/services-7.webp";
        const tags = (project.technologies || []).map((tag) => `<span>${escapeHTML(tag)}</span>`).join("");
        return `
        <div class="col-lg-4 col-md-6 portfolio-item isotope-item ${filterClass}">
          <div class="portfolio-card">
            <div class="portfolio-img">
              <img src="${escapeAttribute(image)}" alt="${escapeAttribute(project.title)}" class="img-fluid">
              <div class="portfolio-overlay">
                <a href="${escapeAttribute(image)}" class="glightbox portfolio-lightbox"><i class="bi bi-plus"></i></a>
                <a href="portfolio-details.html?id=${encodeURIComponent(project._id)}" class="portfolio-details-link"><i class="bi bi-link"></i></a>
              </div>
            </div>
            <div class="portfolio-info">
              <h4>${escapeHTML(project.title)}</h4>
              <p>${escapeHTML(category)}</p>
              <div class="portfolio-tags">${tags}</div>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  }
  function renderContact(about) {
    if (!about) return;
    const map = {
      "[data-contact-location]": about.location,
      "[data-contact-phone]": about.phone,
      "[data-contact-email]": about.email,
    };
    Object.entries(map).forEach(([selector, value]) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = value || "";
    });
  }
  function renderPortfolioDetails(projects) {
    const id = new URLSearchParams(window.location.search).get("id");
    const project = (projects || []).find((item) => item._id === id) || projects?.[0];
    if (!project) return;
    setText("[data-project-title]", project.title);
    setText("[data-project-description]", project.description);
    setImage("[data-project-image]", project.image, project.title);
    setLink("[data-project-url]", project.projectUrl);
    setLink("[data-project-github]", project.githubUrl);
    const tech = document.querySelector("[data-project-technologies]");
    if (tech) tech.innerHTML = (project.technologies || []).map((item) => `<span>${escapeHTML(item)}</span>`).join("");
  }
  function renderServiceDetails(services) {
    const id = new URLSearchParams(window.location.search).get("id");
    const service = (services || []).find((item) => item._id === id) || services?.[0];
    if (!service) return;
    setText("[data-service-title]", service.title);
    setText("[data-service-description]", service.description);
    const icon = document.querySelector("[data-service-icon]");
    if (icon) icon.className = service.icon || "bi bi-code-slash";
  }
  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value || "";
    });
  }
  function setImage(selector, value, alt) {
    const element = document.querySelector(selector);
    if (element && value) {
      element.src = value;
      element.alt = alt || "";
    }
  }
  function setLink(selector, value) {
    const element = document.querySelector(selector);
    if (!element) return;
    if (value) {
      element.href = value;
      element.style.display = "inline-flex";
    } else {
      element.style.display = "none";
    }
  }
  function slugify(value) {
    return String(value || "web")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  function escapeAttribute(value) {
    return escapeHTML(value);
  }
})();
