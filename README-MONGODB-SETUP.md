# FolioOne MongoDB Assignment
This version keeps the original FolioOne public design and makes the portfolio content database-driven with Node.js, Express and MongoDB Atlas.
## Important course note
The assignment brief is for Advanced Web Development in PHP. This implementation uses Node.js/Express/MongoDB because MongoDB Atlas was selected. Confirm with your faculty that Node.js is accepted before final submission.
## Requirements
- Node.js 18+
- MongoDB Atlas account
- A MongoDB Atlas connection string
## Installation
1. Open this project folder in VS Code.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Put your MongoDB Atlas URI in `MONGODB_URI`.
5. Put a long random value in `SESSION_SECRET`.
6. Keep `.env` private. Never upload it to GitHub or submit it in your assignment ZIP.
## Start
Run:
`npm start`
Open:
- Website: http://localhost:5000
- Admin setup: http://localhost:5000/admin/setup
- Admin login: http://localhost:5000/admin/login
The first time, create one admin account at `/admin/setup`. After the account exists, use `/admin/login`.
## Optional default data
If your MongoDB collections are empty and you want starter portfolio content, run:
`npm run seed`
The seed script only inserts data into collections that are empty. It does not delete or overwrite existing documents.
## Database-managed sections
### Home
- Name
- Greeting
- Title prefix
- Typed title
- Description
- Profile image
- Resume link
- Three floating cards
### About
- Section content
- Quote
- About skill cards
- Journey timeline
- Fun facts
- Technical skills
- Statistics
- Testimonials
### Resume
- Education
- Skills
- Experience
### Services
- Services and service details
### Portfolio
- Projects
- Categories
- Technologies
- Project/GitHub URLs
### Social Links
- Platform is detected automatically from the URL
- Icon is detected automatically
### Contact
- Public contact form inserts messages into MongoDB
- Admin can view and delete messages
## Design rule
Do not replace the public HTML with a new design. The public pages remain based on the original FolioOne structure and CSS. Database functionality is added by data attributes and JavaScript rendering.
## Deployment
Before deployment:
1. Test every public page locally.
2. Test admin login and CRUD.
3. Test the contact form.
4. Create a production MongoDB Atlas user and network access rule.
5. Configure `MONGODB_URI`, `SESSION_SECRET` and `PORT` as hosting environment variables.
6. Deploy to a Node.js-compatible host.
7. Verify the live URL.
8. Submit the live URL through the assignment Google Form.
## Security
Never share your MongoDB password in chat, screenshots, GitHub, ZIP files or public repositories. If a database password was exposed, change it in MongoDB Atlas immediately.
