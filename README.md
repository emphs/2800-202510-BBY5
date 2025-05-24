# CivicFix

## 1. Project Title

**CivicFix**

## 2. Project Description (One Sentence Pitch)

CivicFix is a community-driven issue reporting web app that lets residents submit and vote on local civic issues to help authorities prioritize fixes.

## 3. Technologies Used

- **Frontend:** React (ES6, Hooks), Leaflet for mapping
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose) or PostgreSQL
- **Email Service:** SendGrid (nodemailer fallback)
- **Auth:** JSON Web Tokens (JWT)
- **Hosting & Deployment:** Vercel (frontend), Heroku or AWS (backend)
- **Other Tools:** Git, ESLint, Prettier, Postman, Jest/React Testing Library

## 4. Directory Structure (File Contents)

```bash
# From project root:
2800-202510-BBY5/
├─ .github/
│  └─ workflows/
│     └─ nightly_unit.yml
├─ civicfix_back_node/
│  ├─ api/
│  │  ├─ auth.js
│  │  ├─ index.js
│  │  ├─ issues.js
│  │  └─ users.js
│  ├─ bruno tests/
│  │  ├─ bruno_tests_my_issues/
│  │  │  ├─ bruno.json
│  │  │  ├─ Issue id-1.bru
│  │  │  ├─ Issue.bru
│  │  │  └─ User Issues.bru
│  │  ├─ CivixFix - Gen Description/
│  │  │  ├─ bruno.json
│  │  │  └─ gen-description STANLEY PARK.bru
│  │  └─ users/
│  │     └─ bruno.json
│  ├─ public/
│  │  └─ placeholder.png
│  ├─ routes/
│  │  └─ reports.js
│  ├─ .env
│  ├─ app.js
│  ├─ app.js.orig
│  ├─ ca.pem
│  ├─ db.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ tables.sql
│  └─ yarn.lock
├─ civicfix_front_react_js/
│  ├─ public/
│  │  ├─ logos/
│  │  │  ├─ civicfix_logo1.png
│  │  │  ├─ civicfix_logo2.png
│  │  │  ├─ civicfix_logo3.png
│  │  │  └─ civicfix_logo4.png
│  │  ├─ about_us.html
│  │  └─ vite.svg
│  ├─ src/
│  │  ├─ assets/
│  │  │  └─ react.svg
│  │  ├─ components/
│  │  │  ├─ styles/
│  │  │  │  └─ Nav.css
│  │  │  ├─ Footer.jsx
│  │  │  ├─ LocateButton.jsx
│  │  │  ├─ MapDisplay.jsx
│  │  │  └─ Nav.jsx
│  │  ├─ hooks/
│  │  │  ├─ useGeolocation.js
│  │  │  └─ useSocket.jsx
│  │  ├─ pages/
│  │  │  ├─ CreateIssue/
│  │  │  │  ├─ CreateIssue.css
│  │  │  │  └─ CreateIssue.jsx
│  │  │  ├─ AdminPage.jsx
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ IndexPage.jsx
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ MapPage.jsx
│  │  │  ├─ ProfilePage.jsx
│  │  │  ├─ ReportsPage.jsx
│  │  │  └─ SignupPage.jsx
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ App.test.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ MainMap.jsx
│  │  └─ router.jsx
│  ├─ .gitignore
│  ├─ app.js
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ jest.config.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  ├─ vite.config.js
│  ├─ vite.config.js.orig
│  └─ yarn.lock
├─ crates/
│  └─ openstreetmap_test/
│     └─ a.sh
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ README.md
└─ yarn.lock

```

> _Note: `passwords.txt` should contain admin/user login credentials and is not committed to the repo. Upload it separately to Dropbox in D2L._

## 5. Installation & Setup

1. **Prerequisites**

   - Node.js v16+ and npm
   - MongoDB (local or Atlas) or PostgreSQL
   - IDE (e.g., VS Code)
   - Git CLI

2. **Clone the Repo**

   ```bash
   git clone https://github.com/your-org/CivicFix.git
   cd CivicFix
   ```

3. **Backend Setup**

   ```bash
   cd server
   npm install
   cp ../.env.example .env
   # Edit .env with real values:
   # MONGODB_URI, PORT, JWT_SECRET, SENDGRID_API_KEY, EMAIL_SERVICE
   npm run dev
   ```

4. **Frontend Setup**

   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Edit .env with REACT_APP_MAPBOX_TOKEN or MAPBOX_TOKEN
   npm start
   ```

5. **Testing Plan**

View our full testing history and contribute:
[https://github.com/your-org/CivicFix/blob/main/server/tests/testing_plan.md](https://github.com/your-org/CivicFix/blob/main/server/tests/testing_plan.md)

## 6. How to Use (Features)

1. **Sign Up / Sign In:** Create an account or login with JWT-secured credentials.
2. **Report Issue:** Fill out title, description, category, and drop a pin on the map.
3. **Browse Map:** View all reports with interactive markers, clustered at zoomed out levels.
4. **Upvote / Downvote:** Click arrows on each report card to cast your vote.
5. **Filter & Search:** Use the sidebar to filter by category or search by street name.
6. **Issue Details:** Click a marker or list item to see full details, comments, and vote history.
7. **Edit / Delete:** Modify or remove your own reports (confirmation required).
8. **Notifications:** Receive email confirmation after successful report submission.

## 7. Credits, References & Licenses

- **Leaflet:** Open-source mapping library (BSD-2-Clause)
- **React:** UI library (MIT)
- **Express:** Web framework (MIT)
- **MongoDB:** NoSQL database (SSPL)
- **SendGrid:** Email API (proprietary)
- **Jest:** Testing framework (MIT)

## 8. AI & API Usage

- **ChatGPT (OpenAI API):** Generated initial README draft and sample test descriptions.
- **Mapbox API:** Provides custom map tiles and geocoding on the frontend.
- **SendGrid API:** Sends transactional confirmation emails via server-side integration.

## 9. Contact Information

- **Maintainer:** [yourname@organization.org](mailto:yourname@organization.org)
- **GitHub Issues:** [https://github.com/your-org/CivicFix/issues](https://github.com/your-org/CivicFix/issues)
- **Project Wiki:** [https://github.com/your-org/CivicFix/wiki](https://github.com/your-org/CivicFix/wiki)
