require("dotenv").config();
// =====================================================
// DNS
// =====================================================

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// =====================================================
// IMPORTS
// =====================================================

const path = require("path");
const express = require("express");
const fs = require("fs");
const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
// =====================================================
// MODELS
// =====================================================

const Admin = require("./models/Admin");
const Contact = require("./models/Contact");
const Home = require("./models/Home");
const About = require("./models/About");
const Service = require("./models/Service");
const Skill = require("./models/Skill");
const Education = require("./models/Education");
const Experience = require("./models/Experience");
const Project = require("./models/Project");
const SocialLink = require("./models/SocialLink");
const AboutSkillCard = require("./models/AboutSkillCard");
const AboutJourney = require("./models/AboutJourney");
const AboutFact = require("./models/AboutFact");
const Stat = require("./models/Stat");
const Testimonial = require("./models/Testimonial");
// =====================================================
// APP
// =====================================================

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
// =====================================================
// ENVIRONMENT VALIDATION
// =====================================================

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is missing from .env");
  process.exit(1);
}
if (!SESSION_SECRET) {
  console.error("ERROR: SESSION_SECRET is missing from .env");
  process.exit(1);
}
// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
// =====================================================
// SESSION
// =====================================================

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 4,
    },
  }),
);
// =====================================================
// STATIC FILES
// =====================================================
// Public website

app.use(express.static(path.join(__dirname, "public")));
// Admin CSS / JS

app.use("/admin/assets", express.static(path.join(__dirname, "admin", "assets")));
// =====================================================
// ADMIN AUTH MIDDLEWARE
// =====================================================

function requireAdmin(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: "Authentication required.",
  });
}
// =====================================================
// HEALTH
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    adminAuthenticated: Boolean(req.session && req.session.adminId),
  });
});
// =====================================================
// ADMIN SETUP PAGE
// =====================================================

app.get("/admin/setup", async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.redirect("/admin/login");
    }
    res.sendFile(path.join(__dirname, "admin", "setup.html"));
  } catch (error) {
    console.error("Admin setup page error:", error.message);
    res.status(500).send("Unable to load admin setup.");
  }
});
// =====================================================
// CREATE FIRST ADMIN
// =====================================================

app.post("/api/admin/setup", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    if (username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must contain at least 3 characters.",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }
    // Only one admin account

    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin account already exists.",
      });
    }
    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await Admin.create({
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
    });
    res.status(201).json({
      success: true,
      message: "Admin account created successfully.",
      adminId: admin._id,
    });
  } catch (error) {
    console.error("Admin setup error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to create admin account.",
    });
  }
});
// =====================================================
// ADMIN LOGIN PAGE
// =====================================================

app.get("/admin/login", (req, res) => {
  if (req.session && req.session.adminId) {
    return res.redirect("/admin");
  }
  res.sendFile(path.join(__dirname, "admin", "login.html"));
});
// =====================================================
// ADMIN LOGIN API
// =====================================================

app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }
    const admin = await Admin.findOne({
      username: username.trim(),
    });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }
    const passwordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }
    // =================================================
    // CREATE SESSION
    // =================================================

    req.session.adminId = admin._id.toString();
    req.session.adminUsername = admin.username;
    req.session.adminEmail = admin.email;
    // IMPORTANT:
    // Explicitly save the session before responding.
    // This prevents the login/session race condition.

    req.session.save((error) => {
      if (error) {
        console.error("Session save error:", error);
        return res.status(500).json({
          success: false,
          message: "Unable to create admin session.",
        });
      }
      return res.json({
        success: true,
        message: "Login successful.",
      });
    });
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
});
// =====================================================
// ADMIN SESSION CHECK
// =====================================================

app.get("/api/admin/me", async (req, res) => {
  try {
    if (!req.session || !req.session.adminId) {
      return res.json({
        success: false,
        authenticated: false,
      });
    }
    const admin = await Admin.findById(req.session.adminId).select("_id username email");
    if (!admin) {
      req.session.destroy(() => {});
      return res.json({
        success: false,
        authenticated: false,
      });
    }
    res.json({
      success: true,
      authenticated: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin session error:", error.message);
    res.status(500).json({
      success: false,
      authenticated: false,
    });
  }
});
// =====================================================
// ADMIN LOGOUT
// =====================================================

app.post("/api/admin/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error);
      return res.status(500).json({
        success: false,
        message: "Logout failed.",
      });
    }
    res.clearCookie("connect.sid");
    res.json({
      success: true,
      message: "Logged out successfully.",
    });
  });
});
// =====================================================
// ADMIN DASHBOARD PAGE
// =====================================================

app.get("/admin", (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.redirect("/admin/login");
  }
  res.sendFile(path.join(__dirname, "admin", "index.html"));
});
// =====================================================
// ADMIN INDEX.HTML REDIRECT
// =====================================================

app.get("/admin/index.html", (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.redirect("/admin/login");
  }
  res.redirect("/admin");
});
// =====================================================
// HOME
// =====================================================

app.get("/api/home", async (req, res) => {
  try {
    const data = await Home.findOne();
    res.json({
      success: true,
      data: data || null,
    });
  } catch (error) {
    console.error("Get home error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to load home data.",
    });
  }
});
app.put("/api/home", requireAdmin, async (req, res) => {
  try {
    let home = await Home.findOne();
    if (!home) {
      home = new Home({
        name: String(req.body.name || "").trim(),
        title: String(req.body.title || "").trim(),
      });
    }
    const allowedFields = [
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
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== null && String(req.body[field]).trim() !== "") {
        home[field] = String(req.body[field]).trim();
      }
    });
    await home.save();
    res.json({
      success: true,
      message: "Home information saved successfully.",
      data: home,
    });
  } catch (error) {
    console.error("Save home error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Unable to save home information.",
    });
  }
});
// =====================================================
// ABOUT
// =====================================================

app.get("/api/about", async (req, res) => {
  try {
    const data = await About.findOne();
    res.json({
      success: true,
      data: data || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to load about data.",
    });
  }
});
app.put("/api/about", requireAdmin, async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About();
    }
    const allowedFields = [
      "sectionTitle",
      "sectionDescription",
      "eyebrow",
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
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== null && String(req.body[field]).trim() !== "") {
        about[field] = String(req.body[field]).trim();
      }
    });
    await about.save();
    res.json({
      success: true,
      message: "About information saved successfully.",
      data: about,
    });
  } catch (error) {
    console.error("Save about error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Unable to save about information.",
    });
  }
});
// =====================================================
// SOCIAL LINK METADATA
// =====================================================

function getSocialMetaFromUrl(url) {
  const fallback = {
    platform: "Social Link",
    icon: "bi bi-link-45deg",
  };
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    const matches = [
      { domains: ["github.com"], platform: "GitHub", icon: "bi bi-github" },
      { domains: ["linkedin.com", "lnkd.in"], platform: "LinkedIn", icon: "bi bi-linkedin" },
      { domains: ["instagram.com"], platform: "Instagram", icon: "bi bi-instagram" },
      { domains: ["facebook.com", "fb.com"], platform: "Facebook", icon: "bi bi-facebook" },
      { domains: ["youtube.com", "youtu.be"], platform: "YouTube", icon: "bi bi-youtube" },
      { domains: ["x.com", "twitter.com"], platform: "X", icon: "bi bi-twitter-x" },
      { domains: ["t.me", "telegram.me"], platform: "Telegram", icon: "bi bi-telegram" },
      { domains: ["whatsapp.com", "wa.me"], platform: "WhatsApp", icon: "bi bi-whatsapp" },
      { domains: ["discord.com", "discord.gg"], platform: "Discord", icon: "bi bi-discord" },
      { domains: ["dribbble.com"], platform: "Dribbble", icon: "bi bi-dribbble" },
      { domains: ["behance.net"], platform: "Behance", icon: "bi bi-behance" },
    ];
    return (
      matches.find((item) => item.domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) ||
      fallback
    );
  } catch (error) {
    return fallback;
  }
}
// =====================================================
// GENERIC CRUD ROUTE FACTORY
// =====================================================

function createCrudRoutes(name, Model, endpoint) {
  // -----------------------------
  // GET
  // -----------------------------

  app.get(`/api/${endpoint}`, async (req, res) => {
    try {
      const data = await Model.find().sort({
        order: 1,
        createdAt: 1,
      });
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(`Get ${name} error:`, error.message);
      res.status(500).json({
        success: false,
        message: `Unable to load ${name}.`,
      });
    }
  });
  // -----------------------------
  // POST
  // -----------------------------

  app.post(`/api/${endpoint}`, requireAdmin, async (req, res) => {
    try {
      const data = await Model.create(req.body);
      res.status(201).json({
        success: true,
        message: `${name} added successfully.`,
        data,
      });
    } catch (error) {
      console.error(`Create ${name} error:`, error.message);
      res.status(400).json({
        success: false,
        message: error.message || `Unable to add ${name}.`,
      });
    }
  });
  // -----------------------------
  // PUT
  // -----------------------------

  app.put(`/api/${endpoint}/:id`, requireAdmin, async (req, res) => {
    try {
      const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!data) {
        return res.status(404).json({
          success: false,
          message: `${name} not found.`,
        });
      }
      res.json({
        success: true,
        message: `${name} updated successfully.`,
        data,
      });
    } catch (error) {
      console.error(`Update ${name} error:`, error.message);
      res.status(400).json({
        success: false,
        message: error.message || `Unable to update ${name}.`,
      });
    }
  });
  // -----------------------------
  // DELETE
  // -----------------------------

  app.delete(`/api/${endpoint}/:id`, requireAdmin, async (req, res) => {
    try {
      const data = await Model.findByIdAndDelete(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: `${name} not found.`,
        });
      }
      res.json({
        success: true,
        message: `${name} deleted successfully.`,
      });
    } catch (error) {
      console.error(`Delete ${name} error:`, error.message);
      res.status(500).json({
        success: false,
        message: `Unable to delete ${name}.`,
      });
    }
  });
}
// =====================================================
// CRUD ROUTES
// =====================================================

createCrudRoutes("Service", Service, "services");
createCrudRoutes("Skill", Skill, "skills");
createCrudRoutes("Education", Education, "education");
createCrudRoutes("Experience", Experience, "experience");
createCrudRoutes("Project", Project, "projects");
createCrudRoutes("About Skill Card", AboutSkillCard, "about-skill-cards");
createCrudRoutes("About Journey", AboutJourney, "about-journey");
createCrudRoutes("About Fact", AboutFact, "about-facts");
createCrudRoutes("Stat", Stat, "stats");
createCrudRoutes("Testimonial", Testimonial, "testimonials");
// ==================================================
// PROJECT WEBSITE SCREENSHOT PREVIEW
// ==================================================

app.post("/api/projects/preview", requireAdmin, async (req, res) => {
  let browser;
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Project URL is required.",
      });
    }
    let websiteUrl;
    try {
      websiteUrl = new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid website URL.",
      });
    }
    if (!["http:", "https:"].includes(websiteUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Only HTTP and HTTPS URLs are supported.",
      });
    }
    const generatedDirectory = path.join(__dirname, "public", "generated", "projects");
    if (!fs.existsSync(generatedDirectory)) {
      fs.mkdirSync(generatedDirectory, {
        recursive: true,
      });
    }
    const fileName = `project-${Date.now()}.png`;
    const filePath = path.join(generatedDirectory, fileName);
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    // Force desktop browser viewport

    await page.setViewport({
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
    });
    // Open website

    await page.goto(websiteUrl.href, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    // Give images/fonts/animations time to load

    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Force the browser viewport size

    await page.evaluate(() => {
      window.scrollTo(0, 0);
      document.documentElement.style.width = "1440px";
      document.body.style.width = "1440px";
    });
    // Capture ONLY the visible 1440 x 900 viewport

    await page.screenshot({
      type: "png",
      path: filePath,
      clip: {
        x: 0,
        y: 0,
        width: 1440,
        height: 900,
      },
      fullPage: false,
    });
    await browser.close();
    browser = null;
    const imageUrl = `/generated/projects/${fileName}`;
    res.json({
      success: true,
      message: "Project preview generated successfully.",
      imageUrl,
    });
  } catch (error) {
    console.error("Project screenshot error:", error.message);
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
    res.status(500).json({
      success: false,
      message: "Unable to generate project preview.",
    });
  }
});
// =====================================================
// SOCIAL LINKS CRUD
// =====================================================

app.get("/api/social-links", async (req, res) => {
  try {
    const data = await SocialLink.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load social links." });
  }
});
app.post("/api/social-links", requireAdmin, async (req, res) => {
  try {
    if (!req.body.url) {
      return res.status(400).json({ success: false, message: "Profile URL is required." });
    }
    const meta = getSocialMetaFromUrl(req.body.url.trim());
    const data = await SocialLink.create({
      url: req.body.url.trim(),
      platform: meta.platform,
      icon: meta.icon,
      order: Number(req.body.order || 0),
    });
    res.status(201).json({ success: true, message: "Social link added successfully.", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Unable to add social link." });
  }
});
app.put("/api/social-links/:id", requireAdmin, async (req, res) => {
  try {
    if (!req.body.url) {
      return res.status(400).json({ success: false, message: "Profile URL is required." });
    }
    const meta = getSocialMetaFromUrl(req.body.url.trim());
    const data = await SocialLink.findByIdAndUpdate(
      req.params.id,
      {
        url: req.body.url.trim(),
        platform: meta.platform,
        icon: meta.icon,
        order: Number(req.body.order || 0),
      },
      { new: true, runValidators: true },
    );
    if (!data) {
      return res.status(404).json({ success: false, message: "Social link not found." });
    }
    res.json({ success: true, message: "Social link updated successfully.", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Unable to update social link." });
  }
});
app.delete("/api/social-links/:id", requireAdmin, async (req, res) => {
  try {
    const data = await SocialLink.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Social link not found." });
    }
    res.json({ success: true, message: "Social link deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to delete social link." });
  }
});
// =====================================================
// CONTACT FORM
// =====================================================
// Public:
// Anyone can submit a contact message.

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    res.status(201).json({
      success: true,
      message: "Your message has been saved successfully.",
      id: contact._id,
    });
  } catch (error) {
    console.error("Contact form error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to save your message. Please try again.",
    });
  }
});
// =====================================================
// CONTACT MESSAGES
// =====================================================
// IMPORTANT:
// Only logged-in admin can read messages.

app.get("/api/contacts", requireAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to load contact messages.",
    });
  }
});
// =====================================================
// DELETE CONTACT
// =====================================================

app.delete("/api/contacts/:id", requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }
    res.json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete contact error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to delete contact message.",
    });
  }
});
// =====================================================
// PUBLIC WEBSITE FALLBACK
// =====================================================
// Keep this route LAST.

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// =====================================================
// START SERVER
// =====================================================

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Atlas connected successfully.");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Admin login: http://localhost:${PORT}/admin/login`);
      console.log(`Admin setup: http://localhost:${PORT}/admin/setup`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
startServer();
