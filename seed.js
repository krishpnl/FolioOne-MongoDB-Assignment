require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");
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
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is missing from .env");
  process.exit(1);
}
async function seedIfEmpty(Model, documents) {
  if ((await Model.countDocuments()) === 0 && documents.length) await Model.insertMany(documents);
}
async function run() {
  await mongoose.connect(uri);
  await seedIfEmpty(Home, [
    {
      name: "Krish Panchal",
      greeting: "Hello, I'm",
      title: "Web Development, React & UI Design",
      titlePrefix: "Creative",
      description: "Computer Engineering student building practical, responsive and user-focused web experiences.",
      profileImage: "assets/img/profile/file_0000000015f07207a97a76110b6a9389.png",
      resumeLink: "resume.html",
      card1Icon: "bi bi-palette",
      card1Title: "Design",
      card2Icon: "bi bi-code-slash",
      card2Title: "Code",
      card3Icon: "bi bi-lightbulb",
      card3Title: "Ideas",
    },
  ]);
  await seedIfEmpty(About, [
    {
      sectionTitle: "About",
      sectionDescription: "",
      eyebrow: "Hello there",
      headline:
        "Hi, I'm Krish — a driven Computer Engineering student building beautiful and functional web experiences",
      lead: "I completed my Diploma in Computer Engineering in 2025 with a CGPA of 8.97 and am currently pursuing my B.Tech in Computer Engineering.",
      body: "I enjoy creating responsive websites and practical web applications while continuously improving my skills in modern web technologies.",
      profileImage: "assets/img/profile/file_0000000015f07207a97a76110b6a9389.png",
      resumeLink: "resume.html",
      location: "",
      email: "",
      phone: "",
      quote: "Keep learning, keep building, and turn ideas into useful experiences.",
    },
  ]);
  await seedIfEmpty(AboutSkillCard, [
    {
      icon: "bi bi-palette",
      title: "UI/UX Design",
      description: "Designing clean and user-friendly interfaces.",
      order: 1,
    },
    {
      icon: "bi bi-code-slash",
      title: "Web Development",
      description: "Building responsive websites and web applications.",
      order: 2,
    },
    {
      icon: "bi bi-brush",
      title: "Digital Art",
      description: "Exploring visual design and creative digital work.",
      order: 3,
    },
    {
      icon: "bi bi-lightbulb",
      title: "Brand Strategy",
      description: "Turning ideas into clear and consistent digital experiences.",
      order: 4,
    },
  ]);
  await seedIfEmpty(AboutJourney, [
    {
      year: "2022",
      title: "Diploma Begins",
      description: "Started the Diploma in Computer Engineering journey.",
      order: 1,
    },
    {
      year: "2024",
      title: "OJT Training",
      description: "Completed practical on-job training and gained hands-on experience.",
      order: 2,
    },
    {
      year: "2025",
      title: "Diploma Completed",
      description: "Completed Diploma in Computer Engineering with a CGPA of 8.97.",
      order: 3,
    },
    {
      year: "Now",
      title: "B.Tech + Web Development",
      description: "Continuing B.Tech Computer Engineering while building practical web projects.",
      order: 4,
    },
  ]);
  await seedIfEmpty(AboutFact, [
    { icon: "bi bi-cpu", text: "Tech Enthusiast", order: 1 },
    { icon: "bi bi-controller", text: "Gaming", order: 2 },
    { icon: "bi bi-palette", text: "Digital Art", order: 3 },
    { icon: "bi bi-lightbulb", text: "Problem Solver", order: 4 },
  ]);
  await seedIfEmpty(Stat, [
    { value: 6, suffix: "+", label: "Projects Completed", order: 1 },
    { value: 1, suffix: "+", label: "Years of Practical Learning", order: 2 },
    { value: 0, suffix: "+", label: "Happy Clients", order: 3 },
  ]);
  await seedIfEmpty(Testimonial, []);
  await seedIfEmpty(Skill, [
    { name: "HTML", category: "Frontend", percentage: 90, order: 1 },
    { name: "CSS", category: "Frontend", percentage: 88, order: 2 },
    { name: "JavaScript", category: "Frontend", percentage: 80, order: 3 },
    { name: "Bootstrap", category: "Frontend", percentage: 85, order: 4 },
    { name: "React.js", category: "Frontend", percentage: 70, order: 5 },
    { name: "Python", category: "Programming", percentage: 65, order: 6 },
  ]);
  await seedIfEmpty(Education, [
    {
      degree: "B.Tech in Computer Engineering",
      institution: "Silver Oak University",
      location: "Ahmedabad",
      startYear: "2024",
      endYear: "Present",
      description: "Pursuing B.Tech in Computer Engineering.",
      order: 1,
    },
    {
      degree: "Diploma in Computer Engineering",
      institution: "Silver Oak University",
      location: "Ahmedabad",
      startYear: "2022",
      endYear: "2025",
      description: "Completed Diploma in Computer Engineering with a CGPA of 8.97.",
      order: 2,
    },
  ]);
  await seedIfEmpty(Experience, []);
  await seedIfEmpty(Service, [
    {
      title: "Web Development",
      description: "Building responsive and practical websites using modern frontend technologies.",
      icon: "bi bi-code-slash",
      order: 1,
    },
    {
      title: "UI/UX Design",
      description: "Creating clean, accessible and user-focused interface experiences.",
      icon: "bi bi-palette",
      order: 2,
    },
    {
      title: "Responsive Design",
      description: "Developing layouts that work smoothly across desktop, tablet and mobile devices.",
      icon: "bi bi-phone",
      order: 3,
    },
    {
      title: "Web Project Development",
      description: "Turning ideas into functional web projects with structured frontend and backend integration.",
      icon: "bi bi-window-stack",
      order: 4,
    },
  ]);
  await seedIfEmpty(Project, [
    {
      title: "Streakly",
      category: "Web",
      description: "A habit tracker web application for tracking daily habits and building consistency.",
      image: "",
      technologies: ["HTML", "CSS", "JavaScript"],
      projectUrl: "https://streaklly.netlify.app/",
      githubUrl: "",
      featured: true,
      order: 1,
    },
    {
      title: "RupeeTrack",
      category: "React",
      description: "A React-based personal money tracking project.",
      image: "",
      technologies: ["React.js", "JavaScript", "Bootstrap"],
      projectUrl: "",
      githubUrl: "",
      featured: true,
      order: 2,
    },
    {
      title: "HeritageX",
      category: "Web",
      description: "Smart Tourism and Cultural Heritage Discovery Platform for Ahmedabad heritage city.",
      image: "",
      technologies: ["HTML", "CSS", "JavaScript", "Bootstrap"],
      projectUrl: "",
      githubUrl: "https://github.com/krishpnl/HeritageX-PBL-Project",
      featured: true,
      order: 3,
    },
    {
      title: "AutoLux",
      category: "Web",
      description: "A responsive car website created using Bootstrap.",
      image: "",
      technologies: ["HTML", "CSS", "Bootstrap"],
      projectUrl: "",
      githubUrl: "",
      featured: false,
      order: 4,
    },
    {
      title: "Internship & Job Portal",
      category: "Web",
      description: "A web platform concept for internships and job opportunities.",
      image: "",
      technologies: ["HTML", "CSS", "JavaScript", "Bootstrap"],
      projectUrl: "",
      githubUrl: "",
      featured: false,
      order: 5,
    },
    {
      title: "Zero Plate Waste",
      category: "Web",
      description: "A food wastage reduction project focused on reducing plate waste.",
      image: "",
      technologies: ["HTML", "CSS", "JavaScript"],
      projectUrl: "",
      githubUrl: "",
      featured: false,
      order: 6,
    },
  ]);
  await seedIfEmpty(SocialLink, [
    { platform: "GitHub", url: "https://github.com/krishpnl", icon: "bi bi-github", order: 1 },
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/krishpanchal31", icon: "bi bi-linkedin", order: 2 },
  ]);
  console.log("Default portfolio data inserted only into collections that were empty.");
  await mongoose.disconnect();
}
run().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
