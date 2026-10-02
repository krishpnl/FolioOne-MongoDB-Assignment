const API = "/api";
// INITIALIZATION\r

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  // Login page

  if (path === "/admin/login") {
    setupLogin();
    return;
  }
  // Setup page

  if (path === "/admin/setup") {
    setupAdminSetup();
    return;
  }
  // Dashboard

  if (path === "/admin" || path === "/admin/index.html") {
    const authenticated = await checkAdminSession();
    if (!authenticated) {
      return;
    }
    setupNavigation();
    setupMobileMenu();
    setupButtons();
    setupLogout();
    updateAdminProfile();
    await loadDashboard();
  }
});
// NAVIGATION\r

function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item[data-section]");
  const pageTitle = document.getElementById("page-title");
  navItems.forEach((item) => {
    if (item.dataset.navigationBound === "true") {
      return;
    }
    item.dataset.navigationBound = "true";
    item.type = "button";
    item.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const section = item.dataset.section;
      if (!section) {
        return;
      }
      // Active navigation

      navItems.forEach((nav) => {
        nav.classList.remove("active");
      });
      item.classList.add("active");
      // Hide all sections

      document.querySelectorAll(".admin-section").forEach((sectionElement) => {
        sectionElement.classList.remove("active-section");
      });
      // Show selected section

      const target = document.getElementById(`${section}-section`);
      if (target) {
        target.classList.add("active-section");
      }
      // Change title

      if (pageTitle) {
        pageTitle.textContent = item.textContent.trim();
      }
      closeMobileSidebar();
      // Load section data

      await loadSection(section);
    });
  });
}
// MOBILE SIDEBAR\r

function setupMobileMenu() {
  const menuButton = document.getElementById("mobile-menu");
  const sidebar = document.querySelector(".sidebar");
  const closeButton = document.getElementById("sidebar-close");
  const overlay = document.getElementById("sidebar-overlay");
  if (!menuButton || !sidebar) {
    return;
  }
  menuButton.addEventListener("click", (event) => {
    event.preventDefault();
    sidebar.classList.add("mobile-open");
    if (overlay) {
      overlay.classList.add("show");
    }
  });
  if (closeButton) {
    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      closeMobileSidebar();
    });
  }
  if (overlay) {
    overlay.addEventListener("click", closeMobileSidebar);
  }
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileSidebar();
    }
  });
}
function closeMobileSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (sidebar) {
    sidebar.classList.remove("mobile-open");
  }
  if (overlay) {
    overlay.classList.remove("show");
  }
}
// BUTTONS\r

function setupButtons() {
  const buttons = [
    ["add-service-btn", () => openServiceModal()],
    ["add-skill-btn", () => openSkillModal()],
    ["add-education-btn", () => openEducationModal()],
    ["add-experience-btn", () => openExperienceModal()],
    ["add-project-btn", () => openProjectModal()],
    ["add-social-btn", () => openSocialModal()],
    ["add-about-skill-btn", () => openAboutSkillCardModal()],
    ["add-about-journey-btn", () => openAboutJourneyModal()],
    ["add-about-fact-btn", () => openAboutFactModal()],
    ["add-stat-btn", () => openStatModal()],
    ["add-testimonial-btn", () => openTestimonialModal()],
  ];
  buttons.forEach(([id, handler]) => {
    const button = document.getElementById(id);
    if (button) button.addEventListener("click", handler);
  });
  const homeForm = document.getElementById("home-form");
  if (homeForm) homeForm.addEventListener("submit", saveHome);
  const aboutForm = document.getElementById("about-form");
  if (aboutForm) aboutForm.addEventListener("submit", saveAbout);
}
// API REQUEST HELPER\r

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server returned HTTP ${response.status}.`);
  }
  // Session expired

  if (response.status === 401) {
    window.location.replace("/admin/login");
    throw new Error("Your admin session has expired.");
  }
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Something went wrong.");
  }
  return data;
}
// DASHBOARD\r

async function loadDashboard() {
  const setCount = (id, value) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = String(value);
    }
  };
  const loadCount = async (endpoint, elementId) => {
    try {
      const result = await apiRequest(`${API}/${endpoint}`);
      setCount(elementId, Array.isArray(result.data) ? result.data.length : 0);
      return true;
    } catch (error) {
      console.error(`${endpoint} error:`, error);
      return false;
    }
  };
  await Promise.all([
    loadCount("projects", "project-count"),
    loadCount("services", "service-count"),
    loadCount("skills", "skill-count"),
  ]);
  // IMPORTANT:
  // Contacts are private and require admin authentication.
  // This request is separate from the other counters.

  const contactsLoaded = await loadCount("contacts", "contact-count");
  if (!contactsLoaded) {
    setCount("contact-count", 0);
  }
}
// SECTION LOADER\r

async function loadSection(section) {
  try {
    if (section === "home") {
      await loadHome();
    }
    if (section === "about") {
      await loadAbout();
      await loadAboutExtras();
    }
    if (section === "services") {
      await loadServices();
    }
    if (section === "skills") {
      await loadSkills();
    }
    if (section === "education") {
      await loadEducation();
    }
    if (section === "experience") {
      await loadExperience();
    }
    if (section === "projects") {
      await loadProjects();
    }
    if (section === "social") {
      await loadSocialLinks();
    }
    if (section === "contacts") {
      await loadContacts();
    }
  } catch (error) {
    console.error(error);
    showToast(error.message, true);
  }
}
// HOME\r

async function loadHome() {
  const result = await apiRequest(`${API}/home`);
  const form = document.getElementById("home-form");
  if (!form) return;
  if (!result.data) {
    form.reset();
    return;
  }
  fillHomeForm(result.data);
}
function fillHomeForm(data) {
  const form = document.getElementById("home-form");
  if (!form || !data) return;
  const fields = [
    "name",
    "greeting",
    "title",
    "titlePrefix",
    "description",
    "profileImage",
    "resumeLink",
    "card1Icon",
    "card1Title",
    "card2Icon",
    "card2Title",
    "card3Icon",
    "card3Title",
  ];
  fields.forEach((field) => {
    if (form.elements[field]) form.elements[field].value = data[field] ?? "";
  });
}
async function saveHome(event) {
  event.preventDefault();
  const form = event.target;
  try {
    const currentResult = await apiRequest(`${API}/home`);
    const currentData = currentResult.data || {};
    const values = Object.fromEntries(new FormData(form).entries());
    const data = { ...currentData };
    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (typeof value === "string" && value.trim() !== "") data[key] = value.trim();
    });
    delete data._id;
    delete data.__v;
    delete data.createdAt;
    delete data.updatedAt;
    const result = await apiRequest(`${API}/home`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    fillHomeForm(result.data);
    showToast("Home information saved successfully.");
  } catch (error) {
    showToast(error.message, true);
  }
}
// ABOUT\r

async function loadAbout() {
  const result = await apiRequest(`${API}/about`);
  const form = document.getElementById("about-form");
  if (!form) return;
  if (!result.data) {
    form.reset();
    return;
  }
  fillAboutForm(result.data);
}
function fillAboutForm(data) {
  const form = document.getElementById("about-form");
  if (!form || !data) return;
  const fields = [
    "sectionTitle",
    "eyebrow",
    "sectionDescription",
    "headline",
    "lead",
    "body",
    "profileImage",
    "resumeLink",
    "location",
    "email",
    "phone",
    "quote",
  ];
  fields.forEach((field) => {
    if (form.elements[field]) form.elements[field].value = data[field] ?? "";
  });
}
async function saveAbout(event) {
  event.preventDefault();
  const form = event.target;
  try {
    const currentResult = await apiRequest(`${API}/about`);
    const currentData = currentResult.data || {};
    const values = Object.fromEntries(new FormData(form).entries());
    const data = { ...currentData };
    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (typeof value === "string" && value.trim() !== "") data[key] = value.trim();
    });
    delete data._id;
    delete data.__v;
    delete data.createdAt;
    delete data.updatedAt;
    const result = await apiRequest(`${API}/about`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    fillAboutForm(result.data);
    showToast("About information saved successfully.");
  } catch (error) {
    showToast(error.message, true);
  }
}
async function loadAboutExtras() {
  await Promise.all([loadAboutSkillCards(), loadAboutJourneys(), loadAboutFacts(), loadStats(), loadTestimonials()]);
}
async function loadAboutSkillCards() {
  const result = await apiRequest(`${API}/about-skill-cards`);
  const table = document.getElementById("about-skills-table");
  if (!table) return;
  table.innerHTML = result.data.length
    ? result.data
        .map(
          (item) => `
    <tr>
      <td><strong>${escapeHTML(item.title)}</strong></td>
      <td>${escapeHTML(item.description)}</td>
      <td><i class="${escapeAttribute(item.icon)}"></i></td>
      <td>${item.order || 0}</td>
      <td>
        <button class="action-btn edit-btn" onclick='editAboutSkillCard(${JSON.stringify(item)})'><i class="bi bi-pencil"></i></button>
        <button class="action-btn delete-btn" onclick="deleteAboutSkillCard('${item._id}')"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `,
        )
        .join("")
    : emptyRow(5);
}
function openAboutSkillCardModal(item = null) {
  const editing = Boolean(item);
  showModal(
    editing ? "Edit About Skill Card" : "Add About Skill Card",
    `
    <form id="about-skill-card-form">
      <div class="mb-3"><label>Title</label><input name="title" class="form-control" required value="${escapeAttribute(item?.title || "")}"></div>
      <div class="mb-3"><label>Description</label><textarea name="description" class="form-control" rows="4">${escapeHTML(item?.description || "")}</textarea></div>
      <div class="mb-3"><label>Bootstrap Icon</label><input name="icon" class="form-control" value="${escapeAttribute(item?.icon || "bi bi-code-slash")}"></div>
      <div class="mb-3"><label>Order</label><input type="number" name="order" class="form-control" value="${item?.order || 0}"></div>
      <button class="btn btn-primary w-100" type="submit">Save Skill Card</button>
    </form>
  `,
  );
  document.getElementById("about-skill-card-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.order = Number(data.order || 0);
    try {
      await apiRequest(editing ? `${API}/about-skill-cards/${item._id}` : `${API}/about-skill-cards`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      closeModal();
      showToast(editing ? "About skill card updated successfully." : "About skill card added successfully.");
      await loadAboutSkillCards();
    } catch (error) {
      showToast(error.message, true);
    }
  });
}
function editAboutSkillCard(item) {
  openAboutSkillCardModal(item);
}
async function deleteAboutSkillCard(id) {
  if (!confirm("Delete this About skill card?")) return;
  try {
    await apiRequest(`${API}/about-skill-cards/${id}`, { method: "DELETE" });
    showToast("About skill card deleted successfully.");
    await loadAboutSkillCards();
  } catch (error) {
    showToast(error.message, true);
  }
}
async function loadAboutJourneys() {
  const result = await apiRequest(`${API}/about-journey`);
  const table = document.getElementById("about-journey-table");
  if (!table) return;
  table.innerHTML = result.data.length
    ? result.data
        .map(
          (item) => `
    <tr>
      <td>${escapeHTML(item.year)}</td>
      <td><strong>${escapeHTML(item.title)}</strong></td>
      <td>${escapeHTML(item.description)}</td>
      <td>${item.order || 0}</td>
      <td>
        <button class="action-btn edit-btn" onclick='editAboutJourney(${JSON.stringify(item)})'><i class="bi bi-pencil"></i></button>
        <button class="action-btn delete-btn" onclick="deleteAboutJourney('${item._id}')"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `,
        )
        .join("")
    : emptyRow(5);
}
function openAboutJourneyModal(item = null) {
  const editing = Boolean(item);
  showModal(
    editing ? "Edit Journey" : "Add Journey",
    `
    <form id="about-journey-form">
      <div class="mb-3"><label>Year</label><input name="year" class="form-control" value="${escapeAttribute(item?.year || "")}"></div>
      <div class="mb-3"><label>Title</label><input name="title" class="form-control" required value="${escapeAttribute(item?.title || "")}"></div>
      <div class="mb-3"><label>Description</label><textarea name="description" class="form-control" rows="4">${escapeHTML(item?.description || "")}</textarea></div>
      <div class="mb-3"><label>Order</label><input type="number" name="order" class="form-control" value="${item?.order || 0}"></div>
      <button class="btn btn-primary w-100" type="submit">Save Journey</button>
    </form>
  `,
  );
  document.getElementById("about-journey-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.order = Number(data.order || 0);
    try {
      await apiRequest(editing ? `${API}/about-journey/${item._id}` : `${API}/about-journey`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      closeModal();
      showToast(editing ? "Journey updated successfully." : "Journey added successfully.");
      await loadAboutJourneys();
    } catch (error) {
      showToast(error.message, true);
    }
  });
}
function editAboutJourney(item) {
  openAboutJourneyModal(item);
}
async function deleteAboutJourney(id) {
  if (!confirm("Delete this journey item?")) return;
  try {
    await apiRequest(`${API}/about-journey/${id}`, { method: "DELETE" });
    showToast("Journey item deleted successfully.");
    await loadAboutJourneys();
  } catch (error) {
    showToast(error.message, true);
  }
}
async function loadAboutFacts() {
  const result = await apiRequest(`${API}/about-facts`);
  const table = document.getElementById("about-facts-table");
  if (!table) return;
  table.innerHTML = result.data.length
    ? result.data
        .map(
          (item) => `
    <tr>
      <td><strong>${escapeHTML(item.text)}</strong></td>
      <td><i class="${escapeAttribute(item.icon)}"></i></td>
      <td>${item.order || 0}</td>
      <td>
        <button class="action-btn edit-btn" onclick='editAboutFact(${JSON.stringify(item)})'><i class="bi bi-pencil"></i></button>
        <button class="action-btn delete-btn" onclick="deleteAboutFact('${item._id}')"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `,
        )
        .join("")
    : emptyRow(4);
}
function openAboutFactModal(item = null) {
  const editing = Boolean(item);
  showModal(
    editing ? "Edit Fun Fact" : "Add Fun Fact",
    `
    <form id="about-fact-form">
      <div class="mb-3"><label>Text</label><input name="text" class="form-control" required value="${escapeAttribute(item?.text || "")}"></div>
      <div class="mb-3"><label>Bootstrap Icon</label><input name="icon" class="form-control" value="${escapeAttribute(item?.icon || "bi bi-lightbulb")}"></div>
      <div class="mb-3"><label>Order</label><input type="number" name="order" class="form-control" value="${item?.order || 0}"></div>
      <button class="btn btn-primary w-100" type="submit">Save Fun Fact</button>
    </form>
  `,
  );
  document.getElementById("about-fact-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.order = Number(data.order || 0);
    try {
      await apiRequest(editing ? `${API}/about-facts/${item._id}` : `${API}/about-facts`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      closeModal();
      showToast(editing ? "Fun fact updated successfully." : "Fun fact added successfully.");
      await loadAboutFacts();
    } catch (error) {
      showToast(error.message, true);
    }
  });
}
function editAboutFact(item) {
  openAboutFactModal(item);
}
async function deleteAboutFact(id) {
  if (!confirm("Delete this fun fact?")) return;
  try {
    await apiRequest(`${API}/about-facts/${id}`, { method: "DELETE" });
    showToast("Fun fact deleted successfully.");
    await loadAboutFacts();
  } catch (error) {
    showToast(error.message, true);
  }
}
async function loadStats() {
  const result = await apiRequest(`${API}/stats`);
  const table = document.getElementById("stats-table");
  if (!table) return;
  table.innerHTML = result.data.length
    ? result.data
        .map(
          (item) => `
    <tr>
      <td><strong>${Number(item.value || 0)}</strong></td>
      <td>${escapeHTML(item.suffix || "")}</td>
      <td>${escapeHTML(item.label)}</td>
      <td>${item.order || 0}</td>
      <td>
        <button class="action-btn edit-btn" onclick='editStat(${JSON.stringify(item)})'><i class="bi bi-pencil"></i></button>
        <button class="action-btn delete-btn" onclick="deleteStat('${item._id}')"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `,
        )
        .join("")
    : emptyRow(5);
}
function openStatModal(item = null) {
  const editing = Boolean(item);
  showModal(
    editing ? "Edit Statistic" : "Add Statistic",
    `
    <form id="stat-form">
      <div class="mb-3"><label>Value</label><input type="number" min="0" name="value" class="form-control" required value="${Number(item?.value || 0)}"></div>
      <div class="mb-3"><label>Suffix</label><input name="suffix" class="form-control" value="${escapeAttribute(item?.suffix ?? "+")}"></div>
      <div class="mb-3"><label>Label</label><input name="label" class="form-control" required value="${escapeAttribute(item?.label || "")}"></div>
      <div class="mb-3"><label>Order</label><input type="number" name="order" class="form-control" value="${item?.order || 0}"></div>
      <button class="btn btn-primary w-100" type="submit">Save Statistic</button>
    </form>
  `,
  );
  document.getElementById("stat-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.value = Number(data.value || 0);
    data.order = Number(data.order || 0);
    try {
      await apiRequest(editing ? `${API}/stats/${item._id}` : `${API}/stats`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      closeModal();
      showToast(editing ? "Statistic updated successfully." : "Statistic added successfully.");
      await loadStats();
    } catch (error) {
      showToast(error.message, true);
    }
  });
}
function editStat(item) {
  openStatModal(item);
}
async function deleteStat(id) {
  if (!confirm("Delete this statistic?")) return;
  try {
    await apiRequest(`${API}/stats/${id}`, { method: "DELETE" });
    showToast("Statistic deleted successfully.");
    await loadStats();
  } catch (error) {
    showToast(error.message, true);
  }
}
async function loadTestimonials() {
  const result = await apiRequest(`${API}/testimonials`);
  const table = document.getElementById("testimonials-table");
  if (!table) return;
  table.innerHTML = result.data.length
    ? result.data
        .map(
          (item) => `
    <tr>
      <td><strong>${escapeHTML(item.name)}</strong></td>
      <td>${escapeHTML(item.role)}</td>
      <td>${escapeHTML(item.quote)}</td>
      <td>${item.order || 0}</td>
      <td>
        <button class="action-btn edit-btn" onclick='editTestimonial(${JSON.stringify(item)})'><i class="bi bi-pencil"></i></button>
        <button class="action-btn delete-btn" onclick="deleteTestimonial('${item._id}')"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `,
        )
        .join("")
    : emptyRow(5);
}
function openTestimonialModal(item = null) {
  const editing = Boolean(item);
  showModal(
    editing ? "Edit Testimonial" : "Add Testimonial",
    `
    <form id="testimonial-form">
      <div class="mb-3"><label>Quote</label><textarea name="quote" class="form-control" rows="5" required>${escapeHTML(item?.quote || "")}</textarea></div>
      <div class="mb-3"><label>Name</label><input name="name" class="form-control" required value="${escapeAttribute(item?.name || "")}"></div>
      <div class="mb-3"><label>Role</label><input name="role" class="form-control" value="${escapeAttribute(item?.role || "")}"></div>
      <div class="mb-3"><label>Image URL</label><input name="image" class="form-control" value="${escapeAttribute(item?.image || "")}"></div>
      <div class="mb-3"><label>Rating (1-5)</label><input type="number" min="1" max="5" name="rating" class="form-control" value="${Number(item?.rating || 5)}"></div>
      <div class="mb-3"><label>Order</label><input type="number" name="order" class="form-control" value="${item?.order || 0}"></div>
      <button class="btn btn-primary w-100" type="submit">Save Testimonial</button>
    </form>
  `,
  );
  document.getElementById("testimonial-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.rating = Math.min(5, Math.max(1, Number(data.rating || 5)));
    data.order = Number(data.order || 0);
    try {
      await apiRequest(editing ? `${API}/testimonials/${item._id}` : `${API}/testimonials`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      closeModal();
      showToast(editing ? "Testimonial updated successfully." : "Testimonial added successfully.");
      await loadTestimonials();
    } catch (error) {
      showToast(error.message, true);
    }
  });
}
function editTestimonial(item) {
  openTestimonialModal(item);
}
async function deleteTestimonial(id) {
  if (!confirm("Delete this testimonial?")) return;
  try {
    await apiRequest(`${API}/testimonials/${id}`, { method: "DELETE" });
    showToast("Testimonial deleted successfully.");
    await loadTestimonials();
  } catch (error) {
    showToast(error.message, true);
  }
}
// SERVICES\r

async function loadServices() {
  const result = await apiRequest(`${API}/services`);
  const table = document.getElementById("services-table");
  if (!result.data.length) {
    table.innerHTML = emptyRow(5);
    return;
  }
  table.innerHTML = result.data
    .map(
      (service) => `
            <tr>
                <td>
                    <strong>
                        ${escapeHTML(service.title)}
                    </strong>
                </td>
                <td>
                    ${escapeHTML(service.description)}
                </td>
                <td>
                    <i class="${escapeAttribute(service.icon)}"></i>
                </td>
                <td>
                    ${service.order || 0}
                </td>
                <td>
                    <button
                        class="action-btn edit-btn"
                        onclick='editService(${JSON.stringify(service)})'>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button
                        class="action-btn delete-btn"
                        onclick="deleteService('${service._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `,
    )
    .join("");
}
function openServiceModal(service = null) {
  const editing = Boolean(service);
  showModal(
    editing ? "Edit Service" : "Add Service",
    `
        <form id="service-modal-form">
            <div class="mb-3">
                <label>Service Title</label>
                <input
                    name="title"
                    class="form-control"
                    required
                    value="${escapeAttribute(service?.title || "")}">
            </div>
            <div class="mb-3">
                <label>Description</label>
                <textarea
                    name="description"
                    class="form-control"
                    rows="4"
                    required>${escapeHTML(service?.description || "")}</textarea>
            </div>
            <div class="mb-3">
                <label>Bootstrap Icon</label>
                <input
                    name="icon"
                    class="form-control"
                    value="${escapeAttribute(service?.icon || "bi bi-code-slash")}">
            </div>
            <div class="mb-3">
                <label>Order</label>
                <input
                    type="number"
                    name="order"
                    class="form-control"
                    value="${service?.order || 0}">
            </div>
            <button
                class="btn btn-primary w-100"
                type="submit">
                Save Service
            </button>
        </form>
        `,
  );
  document.getElementById("service-modal-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.order = Number(data.order || 0);
    try {
      await apiRequest(editing ? `${API}/services/${service._id}` : `${API}/services`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      event.target.reset();
      closeModal();
      showToast(editing ? "Service updated successfully." : "Service added successfully.");
      await loadServices();
      await loadDashboard();
    } catch (error) {
      showToast(error.message, true);
    }
  });
}
function editService(service) {
  openServiceModal(service);
}
async function deleteService(id) {
  if (!confirm("Delete this service?")) {
    return;
  }
  try {
    await apiRequest(`${API}/services/${id}`, {
      method: "DELETE",
    });
    showToast("Service deleted successfully.");
    await loadServices();
    await loadDashboard();
  } catch (error) {
    showToast(error.message, true);
  }
}
// SKILLS\r

async function loadSkills() {
  const result = await apiRequest(`${API}/skills`);
  const table = document.getElementById("skills-table");
  if (!result.data.length) {
    table.innerHTML = emptyRow(5);
    return;
  }
  table.innerHTML = result.data
    .map(
      (skill) => `
            <tr>
                <td>
                    <strong>
                        ${escapeHTML(skill.name)}
                    </strong>
                </td>
                <td>
                    ${escapeHTML(skill.category)}
                </td>
                <td>
                    ${skill.percentage || 0}%
                </td>
                <td>
                    ${skill.order || 0}
                </td>
                <td>
                    <button
                        class="action-btn edit-btn"
                        onclick='editSkill(${JSON.stringify(skill)})'>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button
                        class="action-btn delete-btn"
                        onclick="deleteSkill('${skill._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `,
    )
    .join("");
}
function openSkillModal(skill = null) {
  const editing = Boolean(skill);
  showModal(
    editing ? "Edit Skill" : "Add Skill",
    `
        <form id="skill-modal-form">
            <div class="mb-3">
                <label>Skill Name</label>
                <input
                    name="name"
                    class="form-control"
                    required
                    value="${escapeAttribute(skill?.name || "")}">
            </div>
            <div class="mb-3">
                <label>Category</label>
                <input
                    name="category"
                    class="form-control"
                    value="${escapeAttribute(skill?.category || "Other")}">
            </div>
            <div class="mb-3">
                <label>Percentage</label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    name="percentage"
                    class="form-control"
                    value="${skill?.percentage ?? 50}">
            </div>
            <div class="mb-3">
                <label>Order</label>
                <input
                    type="number"
                    name="order"
                    class="form-control"
                    value="${skill?.order || 0}">
            </div>
            <button
                class="btn btn-primary w-100"
                type="submit">
                Save Skill
            </button>
        </form>
        `,
  );
  document.getElementById("skill-modal-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.percentage = Number(data.percentage || 0);
    data.order = Number(data.order || 0);
    try {
      await apiRequest(editing ? `${API}/skills/${skill._id}` : `${API}/skills`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      event.target.reset();
      closeModal();
      showToast(editing ? "Skill updated successfully." : "Skill added successfully.");
      await loadSkills();
      await loadDashboard();
    } catch (error) {
      showToast(error.message, true);
    }
  });
}
function editSkill(skill) {
  openSkillModal(skill);
}
async function deleteSkill(id) {
  if (!confirm("Delete this skill?")) {
    return;
  }
  try {
    await apiRequest(`${API}/skills/${id}`, {
      method: "DELETE",
    });
    showToast("Skill deleted successfully.");
    await loadSkills();
    await loadDashboard();
  } catch (error) {
    showToast(error.message, true);
  }
}
// EDUCATION\r

async function loadEducation() {
  const result = await apiRequest(`${API}/education`);
  const table = document.getElementById("education-table");
  if (!result.data.length) {
    table.innerHTML = emptyRow(4);
    return;
  }
  table.innerHTML = result.data
    .map(
      (item) => `
            <tr>
                <td>
                    <strong>
                        ${escapeHTML(item.degree)}
                    </strong>
                </td>
                <td>
                    ${escapeHTML(item.institution)}
                </td>
                <td>
                    ${escapeHTML(item.startYear)}
                    -
                    ${escapeHTML(item.endYear)}
                </td>
                <td>
                    <button
                        class="action-btn edit-btn"
                        onclick='editEducation(${JSON.stringify(item)})'>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button
                        class="action-btn delete-btn"
                        onclick="deleteEducation('${item._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `,
    )
    .join("");
}
function openEducationModal(item = null) {
  const editing = Boolean(item);
  showModal(
    editing ? "Edit Education" : "Add Education",
    `
        <form id="education-modal-form">
            <div class="mb-3">
                <label>Degree</label>
                <input
                    name="degree"
                    class="form-control"
                    required
                    value="${escapeAttribute(item?.degree || "")}">
            </div>
            <div class="mb-3">
                <label>Institution</label>
                <input
                    name="institution"
                    class="form-control"
                    required
                    value="${escapeAttribute(item?.institution || "")}">
            </div>
            <div class="mb-3">
                <label>Location</label>
                <input
                    name="location"
                    class="form-control"
                    value="${escapeAttribute(item?.location || "")}">
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label>Start Year</label>
                    <input
                        name="startYear"
                        class="form-control"
                        value="${escapeAttribute(item?.startYear || "")}">
                </div>
                <div class="col-md-6 mb-3">
                    <label>End Year</label>
                    <input
                        name="endYear"
                        class="form-control"
                        value="${escapeAttribute(item?.endYear || "")}">
                </div>
            </div>
            <div class="mb-3">
                <label>Description</label>
                <textarea
                    name="description"
                    class="form-control"
                    rows="4">${escapeHTML(item?.description || "")}</textarea>
            </div>
            <div class="mb-3">
                <label>Order</label>
                <input
                    type="number"
                    name="order"
                    class="form-control"
                    value="${item?.order || 0}">
            </div>
            <button
                class="btn btn-primary w-100"
                type="submit">
                Save Education
            </button>
        </form>
        `,
  );
  document.getElementById("education-modal-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.order = Number(data.order || 0);
    try {
      await apiRequest(editing ? `${API}/education/${item._id}` : `${API}/education`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      event.target.reset();
      closeModal();
      showToast(editing ? "Education updated successfully." : "Education added successfully.");
      await loadEducation();
    } catch (error) {
      showToast(error.message, true);
    }
  });
}
function editEducation(item) {
  openEducationModal(item);
}
async function deleteEducation(id) {
  if (!confirm("Delete this education record?")) {
    return;
  }
  try {
    await apiRequest(`${API}/education/${id}`, {
      method: "DELETE",
    });
    showToast("Education deleted successfully.");
    await loadEducation();
  } catch (error) {
    showToast(error.message, true);
  }
}
// EXPERIENCE\r

async function loadExperience() {
  const result = await apiRequest(`${API}/experience`);
  const table = document.getElementById("experience-table");
  if (!result.data.length) {
    table.innerHTML = emptyRow(4);
    return;
  }
  table.innerHTML = result.data
    .map(
      (item) => `
            <tr>
                <td>
                    <strong>
                        ${escapeHTML(item.position)}
                    </strong>
                </td>
                <td>
                    ${escapeHTML(item.company)}
                </td>
                <td>
                    ${escapeHTML(item.startDate)}
                    -
                    ${escapeHTML(item.endDate)}
                </td>
                <td>
                    <button
                        class="action-btn edit-btn"
                        onclick='editExperience(${JSON.stringify(item)})'>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button
                        class="action-btn delete-btn"
                        onclick="deleteExperience('${item._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `,
    )
    .join("");
}
function openExperienceModal(item = null) {
  const editing = Boolean(item);
  showModal(
    editing ? "Edit Experience" : "Add Experience",
    `
        <form id="experience-modal-form">
            <div class="mb-3">
                <label>Position</label>
                <input
                    name="position"
                    class="form-control"
                    required
                    value="${escapeAttribute(item?.position || "")}">
            </div>
            <div class="mb-3">
                <label>Company</label>
                <input
                    name="company"
                    class="form-control"
                    required
                    value="${escapeAttribute(item?.company || "")}">
            </div>
            <div class="mb-3">
                <label>Location</label>
                <input
                    name="location"
                    class="form-control"
                    value="${escapeAttribute(item?.location || "")}">
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label>Start Date</label>
                    <input
                        name="startDate"
                        class="form-control"
                        value="${escapeAttribute(item?.startDate || "")}">
                </div>
                <div class="col-md-6 mb-3">
                    <label>End Date</label>
                    <input
                        name="endDate"
                        class="form-control"
                        value="${escapeAttribute(item?.endDate || "")}">
                </div>
            </div>
            <div class="mb-3">
                <label>Description</label>
                <textarea
                    name="description"
                    class="form-control"
                    rows="4">${escapeHTML(item?.description || "")}</textarea>
            </div>
            <div class="mb-3">
                <label>Order</label>
                <input
                    type="number"
                    name="order"
                    class="form-control"
                    value="${item?.order || 0}">
            </div>
            <button
                class="btn btn-primary w-100"
                type="submit">
                Save Experience
            </button>
        </form>
        `,
  );
  document.getElementById("experience-modal-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.order = Number(data.order || 0);
    try {
      await apiRequest(editing ? `${API}/experience/${item._id}` : `${API}/experience`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      event.target.reset();
      closeModal();
      showToast(editing ? "Experience updated successfully." : "Experience added successfully.");
      await loadExperience();
    } catch (error) {
      showToast(error.message, true);
    }
  });
}
function editExperience(item) {
  openExperienceModal(item);
}
async function deleteExperience(id) {
  if (!confirm("Delete this experience?")) {
    return;
  }
  try {
    await apiRequest(`${API}/experience/${id}`, {
      method: "DELETE",
    });
    showToast("Experience deleted successfully.");
    await loadExperience();
  } catch (error) {
    showToast(error.message, true);
  }
}
// PROJECTS\r

async function loadProjects() {
  const result = await apiRequest(`${API}/projects`);
  const table = document.getElementById("projects-table");
  if (!result.data.length) {
    table.innerHTML = emptyRow(5);
    return;
  }
  table.innerHTML = result.data
    .map(
      (project) => `
            <tr>
                <td>
                    <strong>
                        ${escapeHTML(project.title)}
                    </strong>
                </td>
                <td>
                    ${escapeHTML(project.category)}
                </td>
                <td>
                    ${escapeHTML((project.technologies || []).join(", "))}
                </td>
                <td>
                    ${project.featured ? "Yes" : "No"}
                </td>
                <td>
                    <button
                        class="action-btn edit-btn"
                        onclick='editProject(${JSON.stringify(project)})'>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button
                        class="action-btn delete-btn"
                        onclick="deleteProject('${project._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `,
    )
    .join("");
}
function openProjectModal(project = null) {
  const editing = Boolean(project);
  showModal(
    editing ? "Edit Project" : "Add Project",
    `
      <form id="project-modal-form">
        <div class="mb-3">
          <label>Project Title</label>
          <input
            name="title"
            class="form-control"
            required
            value="${escapeAttribute(project?.title || "")}">
        </div>

        <div class="mb-3">
          <label>Category</label>
          <input
            name="category"
            class="form-control"
            value="${escapeAttribute(project?.category || "Web")}">
        </div>

        <div class="mb-3">
          <label>Description</label>
          <textarea
            name="description"
            class="form-control"
            rows="4">${escapeHTML(project?.description || "")}</textarea>
        </div>

        <div class="mb-3">
          <label>Project Image</label>

          <div class="input-group">
            <input
              name="image"
              id="project-image-url"
              class="form-control"
              placeholder="Paste direct internet image URL"
              value="${escapeAttribute(project?.image || "")}">

            <button
              type="button"
              class="btn btn-outline-primary"
              id="generate-project-preview">
              <i class="bi bi-camera"></i>
              Generate Preview
            </button>
          </div>

          <small class="text-muted">
            Paste a direct image URL, or generate a screenshot from the Project URL below.
          </small>

          <div class="mt-3 text-center">
            <img
              id="project-image-preview"
              src="${escapeAttribute(project?.image || "")}"
              alt="Project Preview"
              style="
                max-width:100%;
                max-height:250px;
                object-fit:cover;
                border-radius:8px;
                display:${project?.image ? "block" : "none"};
              ">
          </div>

          <div
            id="project-image-error"
            class="text-danger small mt-2">
          </div>

          <div
            id="project-preview-status"
            class="small mt-2">
          </div>
        </div>

        <div class="mb-3">
          <label>Technologies</label>
          <input
            name="technologies"
            class="form-control"
            placeholder="HTML, CSS, JavaScript"
            value="${escapeAttribute((project?.technologies || []).join(", "))}">
        </div>

        <div class="mb-3">
          <label>Project URL</label>
          <input
            name="projectUrl"
            id="project-url"
            type="url"
            class="form-control"
            placeholder="https://your-project.com/"
            value="${escapeAttribute(project?.projectUrl || "")}">
        </div>

        <div class="mb-3">
          <label>GitHub URL</label>
          <input
            name="githubUrl"
            type="url"
            class="form-control"
            placeholder="https://github.com/username/repository"
            value="${escapeAttribute(project?.githubUrl || "")}">
        </div>

        <div class="mb-3">
          <label>Order</label>
          <input
            type="number"
            name="order"
            class="form-control"
            value="${project?.order || 0}">
        </div>

        <div class="form-check mb-3">
          <input
            type="checkbox"
            class="form-check-input"
            id="project-featured"
            name="featured"
            ${project?.featured ? "checked" : ""}>

          <label
            class="form-check-label"
            for="project-featured">
            Featured Project
          </label>
        </div>

        <button
          class="btn btn-primary w-100"
          type="submit">
          Save Project
        </button>
      </form>
    `,
  );
  const form = document.getElementById("project-modal-form");
  const imageInput = document.getElementById("project-image-url");
  const imagePreview = document.getElementById("project-image-preview");
  const projectUrlInput = document.getElementById("project-url");
  const generateButton = document.getElementById("generate-project-preview");
  const previewStatus = document.getElementById("project-preview-status");
  const imageError = document.getElementById("project-image-error");
  if (imageInput && imagePreview) {
    imageInput.addEventListener("input", () => {
      const url = imageInput.value.trim();
      imageError.textContent = "";
      if (!url) {
        imagePreview.style.display = "none";
        imagePreview.removeAttribute("src");
        return;
      }
      imagePreview.src = url;
      imagePreview.style.display = "block";
    });
    imagePreview.addEventListener("load", () => {
      imageError.textContent = "";
      imagePreview.style.display = "block";
    });
    imagePreview.addEventListener("error", () => {
      imagePreview.style.display = "none";
      imageError.textContent = "This URL is not a direct image URL or the image cannot be loaded.";
    });
  }
  if (generateButton) {
    generateButton.addEventListener("click", async () => {
      const projectUrl = projectUrlInput?.value.trim();
      if (!projectUrl) {
        showToast("Enter the Project URL first.", true);
        return;
      }
      try {
        new URL(projectUrl);
      } catch {
        showToast("Please enter a valid Project URL.", true);
        return;
      }
      generateButton.disabled = true;
      previewStatus.textContent = "Generating website screenshot...";
      previewStatus.className = "small mt-2 text-primary";
      try {
        const result = await apiRequest(`${API}/projects/preview`, {
          method: "POST",
          body: JSON.stringify({
            url: projectUrl,
          }),
        });
        if (result.imageUrl) {
          imageInput.value = result.imageUrl;
          imagePreview.src = result.imageUrl;
          imagePreview.style.display = "block";
          imageError.textContent = "";
          previewStatus.textContent = "Project preview generated successfully.";
          previewStatus.className = "small mt-2 text-success";
        } else {
          throw new Error("Server did not return an image.");
        }
      } catch (error) {
        previewStatus.textContent = error.message;
        previewStatus.className = "small mt-2 text-danger";
      } finally {
        generateButton.disabled = false;
      }
    });
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    data.technologies = data.technologies
      ? data.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
    data.featured = form.elements.featured.checked;
    data.order = Number(data.order || 0);
    try {
      await apiRequest(editing ? `${API}/projects/${project._id}` : `${API}/projects`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      closeModal();
      showToast(editing ? "Project updated successfully." : "Project added successfully.");
      await loadProjects();
      await loadDashboard();
    } catch (error) {
      showToast(error.message, true);
    }
  });
}
function editProject(project) {
  openProjectModal(project);
}
async function deleteProject(id) {
  if (!confirm("Delete this project?")) {
    return;
  }
  try {
    await apiRequest(`${API}/projects/${id}`, {
      method: "DELETE",
    });
    showToast("Project deleted successfully.");
    await loadProjects();
    await loadDashboard();
  } catch (error) {
    showToast(error.message, true);
  }
}
// SOCIAL LINKS\r

async function loadSocialLinks() {
  const result = await apiRequest(`${API}/social-links`);
  const table = document.getElementById("social-table");
  if (!result.data.length) {
    table.innerHTML = emptyRow(5);
    return;
  }
  table.innerHTML = result.data
    .map(
      (item) => `
            <tr>
                <td>
                    <strong>
                        ${escapeHTML(item.platform)}
                    </strong>
                </td>
                <td>
                    <a
                        href="${escapeAttribute(item.url)}"
                        target="_blank"
                        rel="noopener">
                        ${escapeHTML(item.url)}
                    </a>
                </td>
                <td>
                    <i class="${escapeAttribute(item.icon)}"></i>
                </td>
                <td>
                    ${item.order || 0}
                </td>
                <td>
                    <button
                        class="action-btn edit-btn"
                        onclick='editSocial(${JSON.stringify(item)})'>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button
                        class="action-btn delete-btn"
                        onclick="deleteSocial('${item._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `,
    )
    .join("");
}
function getSocialMetaFromUrl(url) {
  const fallback = {
    platform: "Social Link",
    icon: "bi bi-link-45deg",
  };
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    const matches = [
      {
        domains: ["github.com"],
        platform: "GitHub",
        icon: "bi bi-github",
      },
      {
        domains: ["linkedin.com", "lnkd.in"],
        platform: "LinkedIn",
        icon: "bi bi-linkedin",
      },
      {
        domains: ["instagram.com"],
        platform: "Instagram",
        icon: "bi bi-instagram",
      },
      {
        domains: ["facebook.com", "fb.com"],
        platform: "Facebook",
        icon: "bi bi-facebook",
      },
      {
        domains: ["youtube.com", "youtu.be"],
        platform: "YouTube",
        icon: "bi bi-youtube",
      },
      {
        domains: ["x.com", "twitter.com"],
        platform: "X",
        icon: "bi bi-twitter-x",
      },
      {
        domains: ["t.me", "telegram.me"],
        platform: "Telegram",
        icon: "bi bi-telegram",
      },
      {
        domains: ["whatsapp.com", "wa.me"],
        platform: "WhatsApp",
        icon: "bi bi-whatsapp",
      },
      {
        domains: ["discord.com", "discord.gg"],
        platform: "Discord",
        icon: "bi bi-discord",
      },
      {
        domains: ["dribbble.com"],
        platform: "Dribbble",
        icon: "bi bi-dribbble",
      },
      {
        domains: ["behance.net"],
        platform: "Behance",
        icon: "bi bi-behance",
      },
    ];
    return (
      matches.find((item) => item.domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) ||
      fallback
    );
  } catch (error) {
    return fallback;
  }
}
function openSocialModal(item = null) {
  const editing = Boolean(item);
  showModal(
    editing ? "Edit Social Link" : "Add Social Link",
    `
        <form id="social-modal-form">
            <div class="mb-3">
                <label>Profile URL</label>
                <input
                    type="url"
                    name="url"
                    class="form-control"
                    placeholder="https://github.com/username"
                    required
                    value="${escapeAttribute(item?.url || "")}">
                <small class="form-text text-muted">
                    Platform name and logo will be detected automatically from the URL.
                </small>
            </div>
            <div class="mb-3">
                <label>Detected Platform</label>
                <input
                    name="platform"
                    class="form-control"
                    readonly
                    value="${escapeAttribute(item?.platform || "")}">
            </div>
            <div class="mb-3">
                <label>Automatic Logo</label>
                <div id="social-icon-preview" class="d-flex align-items-center gap-2 p-2 border rounded">
                    <i class="bi bi-link-45deg fs-4"></i>
                    <span>Logo will be detected from the profile URL.</span>
                </div>
            </div>
            <div class="mb-3">
                <label>Order</label>
                <input
                    type="number"
                    name="order"
                    class="form-control"
                    value="${item?.order || 0}">
            </div>
            <button
                class="btn btn-primary w-100"
                type="submit">
                Save Social Link
            </button>
        </form>
        `,
  );
  const form = document.getElementById("social-modal-form");
  const urlInput = form.elements.url;
  const platformInput = form.elements.platform;
  const iconPreview = document.getElementById("social-icon-preview");
  const updateDetectedPlatform = () => {
    const meta = getSocialMetaFromUrl(urlInput.value.trim());
    platformInput.value = urlInput.value.trim() ? meta.platform : "";
    form.dataset.detectedIcon = meta.icon;
    if (iconPreview) {
      iconPreview.innerHTML = urlInput.value.trim()
        ? `<i class="${escapeAttribute(meta.icon)} fs-4"></i><span>${escapeHTML(meta.platform)}</span>`
        : `<i class="bi bi-link-45deg fs-4"></i><span>Logo will be detected from the profile URL.</span>`;
    }
  };
  urlInput.addEventListener("input", updateDetectedPlatform);
  updateDetectedPlatform();
  document.getElementById("social-modal-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const detected = getSocialMetaFromUrl(data.url);
    data.platform = detected.platform;
    data.icon = detected.icon;
    data.order = Number(data.order || 0);
    try {
      await apiRequest(editing ? `${API}/social-links/${item._id}` : `${API}/social-links`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      event.target.reset();
      closeModal();
      showToast(editing ? "Social link updated successfully." : "Social link added successfully.");
      await loadSocialLinks();
    } catch (error) {
      showToast(error.message, true);
    }
  });
}
function editSocial(item) {
  openSocialModal(item);
}
async function deleteSocial(id) {
  if (!confirm("Delete this social link?")) {
    return;
  }
  try {
    await apiRequest(`${API}/social-links/${id}`, {
      method: "DELETE",
    });
    showToast("Social link deleted successfully.");
    await loadSocialLinks();
  } catch (error) {
    showToast(error.message, true);
  }
}
// CONTACT MESSAGES\r

async function loadContacts() {
  const result = await apiRequest(`${API}/contacts`);
  const table = document.getElementById("contacts-table");
  if (!result.data.length) {
    table.innerHTML = emptyRow(6);
    return;
  }
  table.innerHTML = result.data
    .map(
      (contact) => `
            <tr>
                <td>
                    <strong>
                        ${escapeHTML(contact.name)}
                    </strong>
                </td>
                <td>
                    ${escapeHTML(contact.email)}
                </td>
                <td>
                    ${escapeHTML(contact.subject)}
                </td>
                <td class="message-cell">
                    ${escapeHTML(contact.message)}
                </td>
                <td>
                    ${contact.createdAt ? new Date(contact.createdAt).toLocaleString() : "-"}
                </td>
                <td>
                    <button
                        class="action-btn delete-btn"
                        onclick="deleteContact('${contact._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `,
    )
    .join("");
}
async function deleteContact(id) {
  if (!confirm("Delete this message?")) {
    return;
  }
  try {
    await apiRequest(`${API}/contacts/${id}`, {
      method: "DELETE",
    });
    showToast("Message deleted successfully.");
    await loadContacts();
    await loadDashboard();
  } catch (error) {
    showToast(error.message, true);
  }
}
// MODAL\r

function showModal(title, content) {
  const container = document.getElementById("modal-container");
  container.innerHTML = `
        <div
            id="admin-modal-backdrop"
            class="modal-backdrop-custom">
            <div class="admin-modal">
                <div class="admin-modal-header">
                    <h3>
                        ${escapeHTML(title)}
                    </h3>
                    <button
                        type="button"
                        class="close-modal"
                        onclick="closeModal()">
                        &times;
                    </button>
                </div>
                ${content}
            </div>
        </div>
    `;
  const backdrop = document.getElementById("admin-modal-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        closeModal();
      }
    });
  }
}
function closeModal() {
  const container = document.getElementById("modal-container");
  if (container) {
    container.innerHTML = "";
  }
}
// TOAST

function showToast(message, error = false) {
  const container = document.getElementById("toast-container");
  if (!container) {
    return;
  }
  const toast = document.createElement("div");
  toast.className = `toast-custom ${error ? "toast-error" : ""}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
// HELPERS

function emptyRow(columns) {
  return `
        <tr>
            <td
                colspan="${columns}"
                class="text-center py-4 text-muted">
                No records found.
            </td>
        </tr>
    `;
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
// ADMIN LOGIN

function setupLogin() {
  const form = document.getElementById("login-form");
  if (!form) {
    return;
  }
  const usernameInput = document.getElementById("login-username");
  const passwordInput = document.getElementById("login-password");
  const errorBox = document.getElementById("login-error");
  const button = form.querySelector('button[type="submit"]');
  if (!usernameInput || !passwordInput || !errorBox) {
    return;
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorBox.textContent = "";
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) {
      errorBox.textContent = "Username and password are required.";
      return;
    }
    try {
      if (button) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = "Logging in...";
      }
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid username or password.");
      }
      // Confirm session exists

      const sessionResponse = await fetch("/api/admin/me", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!sessionResponse.ok) {
        throw new Error("Login succeeded, but the admin session could not be created.");
      }
      window.location.replace("/admin");
    } catch (error) {
      console.error("Login error:", error);
      errorBox.textContent = error.message || "Unable to connect to server.";
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = button.dataset.originalText || "Login";
      }
    }
  });
}
// CHECK ADMIN SESSION

async function checkAdminSession() {
  try {
    const response = await fetch("/api/admin/me", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok || !data.success || !data.authenticated) {
      window.location.replace("/admin/login");
      return false;
    }
    updateAdminProfile(data.admin);
    return true;
  } catch (error) {
    console.error("Session check error:", error);
    window.location.replace("/admin/login");
    return false;
  }
}
// ADMIN PROFILE

function updateAdminProfile(admin = null) {
  if (!admin) {
    return;
  }
  const username = admin.username || "Administrator";
  const email = admin.email || "";
  const usernameElement = document.getElementById("admin-username");
  const emailElement = document.getElementById("admin-email");
  const avatarElement = document.getElementById("admin-avatar");
  if (usernameElement) {
    usernameElement.textContent = username;
  }
  if (emailElement) {
    emailElement.textContent = email || "Administrator";
  }
  if (avatarElement) {
    avatarElement.textContent = username.charAt(0).toUpperCase();
  }
}
// LOGOUT

function setupLogout() {
  const button = document.getElementById("logout-btn");
  if (!button) {
    return;
  }
  if (button.dataset.logoutBound === "true") {
    return;
  }
  button.dataset.logoutBound = "true";
  button.addEventListener("click", logoutAdmin);
}
async function logoutAdmin(event) {
  if (event) {
    event.preventDefault();
  }
  const button = document.getElementById("logout-btn");
  try {
    if (button) {
      button.disabled = true;
      button.innerHTML = '<i class="bi bi-hourglass-split"></i><span>Logging out...</span>';
    }
    const response = await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Logout failed.");
    }
    window.location.replace("/admin/login");
  } catch (error) {
    console.error("Logout error:", error);
    alert(error.message || "Logout failed.");
    if (button) {
      button.disabled = false;
      button.innerHTML = '<i class="bi bi-box-arrow-right"></i><span>Logout</span>';
    }
  }
}
// ADMIN SETUP\r

function setupAdminSetup() {
  const form = document.getElementById("setup-form");
  if (!form) {
    return;
  }
  const usernameInput = document.getElementById("setup-username");
  const emailInput = document.getElementById("setup-email");
  const passwordInput = document.getElementById("setup-password");
  const confirmPasswordInput = document.getElementById("setup-confirm-password");
  const errorBox = document.getElementById("setup-error");
  const button = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorBox.textContent = "";
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    if (!username || !email || !password || !confirmPassword) {
      errorBox.textContent = "Please fill in all fields.";
      return;
    }
    if (password.length < 8) {
      errorBox.textContent = "Password must contain at least 8 characters.";
      return;
    }
    if (password !== confirmPassword) {
      errorBox.textContent = "Passwords do not match.";
      return;
    }
    try {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = "Creating...";
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create admin account.");
      }
      alert("Admin account created successfully. Please login.");
      window.location.replace("/admin/login");
    } catch (error) {
      console.error("Admin setup error:", error);
      errorBox.textContent = error.message || "Unable to connect to server.";
    } finally {
      button.disabled = false;
      button.textContent = button.dataset.originalText || "Create Account";
    }
  });
}
