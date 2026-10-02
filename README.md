# FolioOne — MongoDB Portfolio Website

A full-stack personal portfolio website based on the FolioOne HTML template, extended with a Node.js/Express backend, MongoDB Atlas database, secure Admin Dashboard, contact form storage, dynamic portfolio/project management, and project screenshot preview generation.

> **Academic Project:** Advanced Web Development Assignment 2  
> **Semester:** 5th  
> **Academic Year:** 2026–27  
> **Course:** Advanced Web Development in PHP  
> **Course Code:** 2010043347

---

## 1. Project Overview

This project converts a static portfolio template into a database-driven portfolio website.

The public website keeps the original FolioOne visual design while its content is loaded dynamically from MongoDB through REST APIs.

### Main features

- Responsive FolioOne portfolio design
- Node.js + Express backend
- MongoDB Atlas database
- Database-driven Home page
- Database-driven About page
- Database-driven Resume page
- Database-driven Services page
- Database-driven Portfolio page
- Dynamic Portfolio Details page
- Dynamic Service Details page
- Contact form with MongoDB storage
- Admin authentication
- Admin dashboard
- CRUD operations for portfolio content
- Project image URL preview
- Automatic project website screenshot generation using Puppeteer
- Social links management
- Education and experience management
- Skills and statistics management
- Testimonials management
- Session-based Admin login
- Render deployment support

---

# 2. Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap
- Bootstrap Icons
- AOS
- GLightbox
- Swiper
- Isotope
- PureCounter

## Backend

- Node.js
- Express.js
- Express Session
- bcryptjs
- REST API

## Database

- MongoDB
- MongoDB Atlas
- Mongoose

## Other

- Puppeteer
- Git
- GitHub
- Render

---

# 3. Project Structure

```text
FolioOne-MongoDB-Assignment/
│
├── admin/
│   ├── index.html
│   ├── login.html
│   ├── setup.html
│   ├── assets/
│   └── ...
│
├── models/
│   ├── About.js
│   ├── Contact.js
│   ├── Education.js
│   ├── Experience.js
│   ├── Home.js
│   ├── Project.js
│   ├── Service.js
│   ├── Skill.js
│   ├── SocialLink.js
│   └── ...
│
├── public/
│   ├── index.html
│   ├── about.html
│   ├── resume.html
│   ├── services.html
│   ├── service-details.html
│   ├── portfolio.html
│   ├── portfolio-details.html
│   ├── contact.html
│   │
│   ├── assets/
│   │   ├── css/
│   │   ├── img/
│   │   ├── js/
│   │   └── vendor/
│   │
│   └── generated/
│       └── projects/
│
├── server.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── README.md
└── seed.js
```

> `node_modules/` and `.env` should not be uploaded to GitHub. They are created/configured locally.

---

# 4. Requirements for Local Installation

A professor/evaluator can run the project on another computer by installing:

### Required software

1. Node.js 18 or newer
2. npm (installed with Node.js)
3. Git (optional, only needed when cloning from GitHub)
4. A MongoDB Atlas account/database, or another MongoDB connection that is compatible with the application

Node.js can be downloaded from:

https://nodejs.org/

---

# 5. Download the Project

## Option A — Clone from GitHub

Open PowerShell/Command Prompt and run:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Then enter the project folder:

```bash
cd FolioOne-MongoDB-Assignment
```

If the GitHub repository uses a different folder name, enter that folder instead.

## Option B — Download ZIP

Download the repository ZIP from GitHub and extract it.

Open the extracted project folder in VS Code.

---

# 6. Install Dependencies

Open a terminal inside the project root.

Make sure the terminal is located in the folder containing:

```text
server.js
package.json
```

Run:

```bash
npm install
```

This installs all dependencies listed in `package.json`, including:

- Express
- Mongoose
- Express Session
- bcryptjs
- dotenv
- Puppeteer
- Other required packages

---

# 7. MongoDB Atlas Setup

The website uses MongoDB as its database.

## Step 1 — Create a MongoDB Atlas account

Go to:

https://www.mongodb.com/atlas

Create or sign in to a MongoDB Atlas account.

## Step 2 — Create a MongoDB deployment

Create a MongoDB Atlas project/deployment.

## Step 3 — Create a database user

Go to:

```text
Database Access
```

Create a database user with a username and password.

Keep these credentials private.

## Step 4 — Configure Network Access

Go to:

```text
Network Access
```

Add an IP address that is allowed to connect to the database.

For a simple academic setup, Atlas may be configured to allow access from all IP addresses:

```text
0.0.0.0/0
```

However, this is less restrictive. For production use, restrict access to trusted IP ranges whenever possible.

## Step 5 — Get the MongoDB connection string

In MongoDB Atlas choose:

```text
Connect
→ Drivers
→ Node.js
```

Copy the connection string.

It will have a structure similar to:

```text
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

Do not publish a real password or complete connection string in GitHub.

---

# 8. Create the `.env` File

The project uses environment variables for sensitive configuration.

In the project root, create a file named:

```text
.env
```

Use the structure:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE?retryWrites=true&w=majority
PORT=5000
SESSION_SECRET=YOUR_LONG_RANDOM_SESSION_SECRET
NODE_ENV=development
```

Replace the placeholder values with the actual MongoDB credentials.

### Example

```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
PORT=5000
SESSION_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
```

**Do not use this example as a real password.**

---

# 9. Important Security Rule

Never upload the real `.env` file to GitHub.

The repository should contain:

```text
.env.example
```

but not:

```text
.env
```

The `.gitignore` file should contain:

```text
.env
node_modules/
```

The professor should create their own `.env` file on the computer where they are testing the project.

---

# 10. Start the Website Locally

After:

```bash
npm install
```

and after creating `.env`, run:

```bash
npm start
```

The server should start on the configured port.

Normally the local website will be available at:

```text
http://localhost:5000/
```

Open this address in a browser.

---

# 11. Local Website Pages

After starting the server, the following pages can be tested:

```text
http://localhost:5000/
http://localhost:5000/about.html
http://localhost:5000/resume.html
http://localhost:5000/services.html
http://localhost:5000/service-details.html
http://localhost:5000/portfolio.html
http://localhost:5000/portfolio-details.html
http://localhost:5000/contact.html
```

The pages load their database-driven content through the Express API.

---

# 12. Admin Dashboard Setup

The project contains an Admin Dashboard.

Open:

```text
http://localhost:5000/admin/setup
```

Use the setup page to create the initial administrator account if the database does not already contain an administrator.

After setup, use:

```text
http://localhost:5000/admin/login
```

to log in.

The Admin Dashboard is available at:

```text
http://localhost:5000/admin
```

---

# 13. Admin Dashboard Features

The Admin Dashboard allows the website owner to manage portfolio information without manually editing the public HTML pages.

Depending on the configured database data, the dashboard can manage:

### Home

- Name
- Greeting
- Title
- Description
- Profile image
- Resume link
- Floating information cards

### About

- Section title
- Section description
- Eyebrow
- Headline
- Lead
- Body
- Profile image
- Resume link
- Location
- Email
- Phone
- Quote

### Skills

- Skill name
- Category
- Percentage
- Display order

### Resume

- Education
- Experience
- Institution/company
- Location
- Dates
- Descriptions
- Display order

### Services

- Service title
- Description
- Icon
- Display order

### Portfolio

- Project title
- Category
- Description
- Project image
- Technologies
- Project URL
- GitHub URL
- Featured status
- Display order

### Social Links

- Platform
- URL
- Icon
- Display order

### About extras

- Skill cards
- Journey/timeline
- Fun facts
- Statistics
- Testimonials

---

# 14. Contact Form

The Contact page contains a contact form.

When a visitor submits the form:

```text
Visitor
   ↓
Contact Form
   ↓
Express API
   ↓
MongoDB
   ↓
Contact message stored
```

The contact information can then be viewed/managed through the application's database functionality.

This demonstrates database insertion through a website form.

---

# 15. Portfolio Project Screenshot Feature

The Admin Dashboard contains a project preview feature.

When adding/editing a project, the administrator can:

1. Enter a Project URL.
2. Click **Generate Preview**.
3. Puppeteer opens the website.
4. A screenshot is generated.
5. The screenshot is saved under:

```text
public/generated/projects/
```

6. The generated image path can be stored with the project.

A direct project image URL can also be entered manually.

### Important

The website URL used for screenshot generation must be publicly accessible to the server.

A local address such as:

```text
http://localhost:3000
```

may not work when screenshot generation is running on a remote server.

---

# 16. API Architecture

The Express server provides API endpoints for the frontend and Admin Dashboard.

The API base path is:

```text
/api
```

Examples include:

```text
GET    /api/home
GET    /api/about
GET    /api/skills
GET    /api/services
GET    /api/projects
GET    /api/social-links
GET    /api/education
GET    /api/experience
GET    /api/stats
GET    /api/testimonials
POST   /api/contact
```

Admin-protected endpoints are used for creating, updating and deleting database records.

The exact available endpoints are implemented in `server.js`.

---

# 17. Database-Driven Website Flow

The general architecture is:

```text
                 MongoDB Atlas
                      ▲
                      │
                      │ Mongoose
                      │
                Node.js / Express
                      ▲
                      │
                 REST API
                      ▲
                      │
        ┌─────────────┴─────────────┐
        │                           │
 Public Website                Admin Dashboard
        │                           │
        ▼                           ▼
   HTML/CSS/JS                CRUD Operations
```

For example:

```text
Admin changes project
        ↓
PUT /api/projects/:id
        ↓
MongoDB
        ↓
Portfolio page requests projects
        ↓
GET /api/projects
        ↓
Project appears on public website
```

---

# 18. Database Collections

The application uses MongoDB/Mongoose models for the website's database-driven content.

Typical collections include:

- Home
- About
- Services
- Skills
- Education
- Experience
- Projects
- Social Links
- Contact Messages
- Statistics
- Testimonials
- About Skill Cards
- About Journey
- About Facts
- Admin users

The exact MongoDB collection names are generated/used by the Mongoose models in the `models/` directory.

---

# 19. Optional Seed Data

If the project includes `seed.js`, it can be used to insert the project's initial sample data.

Before running a seed script, inspect the file and confirm that the `.env` connection is configured correctly.

If the included script supports it, run:

```bash
node seed.js
```

Only run the seed process when you intend to create/reset the initial project data.

> Do not run a seed script repeatedly on a database containing important production data unless the script is designed to safely update existing records.

---

# 20. Troubleshooting

## Problem: `Cannot find module`

Make sure dependencies are installed:

```bash
npm install
```

Then start:

```bash
npm start
```

## Problem: MongoDB connection error

Check:

1. `MONGODB_URI` exists in `.env`.
2. MongoDB username is correct.
3. MongoDB password is correct.
4. Atlas Network Access allows the current IP/server.
5. The MongoDB deployment is running.

## Problem: Admin login does not work

Open:

```text
http://localhost:5000/admin/setup
```

and make sure an administrator account has been created.

Then use:

```text
http://localhost:5000/admin/login
```

## Problem: Port already in use

Change the local port in `.env`:

```env
PORT=5001
```

Then restart:

```bash
npm start
```

Open:

```text
http://localhost:5001/
```

## Problem: Project screenshot generation fails

Check:

- Project URL is valid.
- URL uses `http://` or `https://`.
- Website is publicly accessible.
- Puppeteer dependencies installed correctly.

Run:

```bash
npm install
```

again if necessary.

---

# 21. Deployment

The project can be deployed as a Node.js web service on a platform such as Render.

## Render settings

Create a **Web Service** connected to the GitHub repository.

Use:

```text
Build Command:
npm install
```

and:

```text
Start Command:
node server.js
```

The application listens on the port supplied by the hosting platform.

## Production environment variables

Configure these in the hosting provider instead of uploading `.env`:

```text
MONGODB_URI
SESSION_SECRET
NODE_ENV=production
```

Do not put database credentials directly into source code.

---

# 22. Live Database Architecture

When deployed, the system works as:

```text
User Browser
     ↓
Live Render Website
     ↓
Node.js + Express
     ↓
MongoDB Atlas
```

For example, when a user submits the contact form:

```text
Live Contact Form
       ↓
POST /api/contact
       ↓
Express Server
       ↓
MongoDB Atlas
       ↓
Contact document
```

This means the database is not stored only on the local computer. The deployed website communicates with the remote MongoDB Atlas database.

---

# 23. How a Professor Can Check the Project

There are two ways to evaluate the project.

## Method 1 — Check the Live Website

Open the submitted live URL.

Test:

```text
Home
About
Resume
Services
Portfolio
Portfolio Details
Contact
Admin Login
```

Test the contact form and verify that the website responds correctly.

## Method 2 — Run the Project on a Local Computer

### Step 1

Install Node.js 18 or newer.

### Step 2

Download or clone the GitHub repository.

### Step 3

Open the project folder in VS Code.

### Step 4

Open the terminal in the folder containing:

```text
server.js
package.json
```

### Step 5

Install dependencies:

```bash
npm install
```

### Step 6

Create:

```text
.env
```

in the project root.

### Step 7

Add a valid MongoDB connection string:

```env
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
SESSION_SECRET=YOUR_SESSION_SECRET
PORT=5000
NODE_ENV=development
```

### Step 8

Start the server:

```bash
npm start
```

### Step 9

Open:

```text
http://localhost:5000/
```

### Step 10

For Admin:

```text
http://localhost:5000/admin/setup
```

then:

```text
http://localhost:5000/admin/login
```

This allows the evaluator to run and inspect the complete project locally.

---

# 24. Important Note for Evaluators

The repository does not contain the real MongoDB password or production `.env` file for security reasons.

To run the project locally, the evaluator must configure their own MongoDB connection in `.env`, or use a database connection supplied separately by the project owner.

Never commit:

```text
.env
```

to a public GitHub repository.

---

# 25. GitHub Update Workflow

After modifying the project:

```bash
git status
```

Then:

```bash
git add .
```

Commit:

```bash
git commit -m "Update portfolio website"
```

Push:

```bash
git push origin main
```

If Render is connected to the repository with automatic deployment enabled, a new deployment can be triggered after the push.

---

# 26. Production Security Checklist

Before making the repository public:

- [X] `.env` is not committed
- [x] MongoDB password is not present in source code
- [x] `node_modules/` is ignored
- [x] Production `SESSION_SECRET` is stored as an environment variable
- [x] MongoDB Atlas database user uses a strong password
- [x] MongoDB Atlas Network Access is configured
- [x] Admin credentials are not hard-coded in public files
- [x] Live Admin login works
- [x] Contact form works
- [x] MongoDB connection works
- [x] Public pages load correctly
- [x] Portfolio project links work
- [x] Project preview feature works on the deployed server

---

# 27. Academic Assignment Mapping

The assignment asks for:

### 1. Website template

The project uses the FolioOne HTML/CSS/JS portfolio template.

### 2. Content modification

The original template content has been adapted for the portfolio and made database-driven.

### 3. Database connection

MongoDB Atlas is connected through Node.js, Express and Mongoose.

The contact form stores submitted information in MongoDB, and multiple website sections are also connected to database data.

### 4. Remote hosting

The application is designed to run as a Node.js web service on a remote hosting platform such as Render.

### 5. Live website link

The final deployed URL can be submitted as the website link for the assignment.

---

# 28. Final Verification Checklist

Before submission, verify:

```text
[ ] Website opens using the live URL
[ ] Home page works
[ ] About page works
[ ] Resume page works
[ ] Services page works
[ ] Service details works
[ ] Portfolio page works
[ ] Portfolio details works
[ ] Contact page works
[ ] Contact form stores data in MongoDB
[ ] Admin login works
[ ] Admin dashboard works
[ ] Admin changes appear on public pages
[ ] MongoDB Atlas connection works
[ ] Project preview works
[ ] No .env file is committed to GitHub
[ ] README contains local installation instructions
[ ] Live URL is ready for assignment submission
```

---

# 29. Author / Project

**Project:** FolioOne MongoDB Portfolio Website  
**Developer:** Krish Panchal  
**Program:** B.Tech Computer Engineering  
**Semester:** 5th  
**Academic Year:** 2026–27

---

## Original Template

The public-facing design is based on the FolioOne HTML portfolio template. The template's original design structure and assets have been extended with a Node.js/Express backend and MongoDB database functionality for this academic project.
