# CareerPrep – Bridging Skills & Industry Needs

> **College / Hackathon Project**
> Problem Statement: *"Challenges in aligning skill development programs with industry requirements and emerging job market demands."*

CareerPrep is a full-stack web application engineered to help engineering students diagnose skill gaps against real industry benchmarks, choose target career paths, prepare for campus placements, and systematically track career readiness.

---

## 🌟 Key Capabilities & Features

1. **Authentication & Authorization**
   - Real registration and login with bcrypt password hashing and JSON Web Tokens (JWT).
   - Strict authentication: No fake bypasses, demo logins, or hardcoded guest sessions.
   - Role-Based Access Control (RBAC) separating **Students** and **Administrators**.
   - Optional administrator creation via secure authorization code (`admin123`) or administrative CLI.

2. **Student Dashboard**
   - Real-time **Overall Career Readiness Index** (weighted gauge synthesizing skill match, coding progress, aptitude scores, interview preparation, and resume completeness).
   - Target Career Goal tracker (e.g., Full Stack Developer, AI/ML Engineer, Cloud Engineer).
   - Active Industry Skill Match percentage.
   - Skill Gap breakdown (Strong Skills, Skills to Improve, Missing Skills).
   - Actionable recommendations and module-by-module progress bars.

3. **Student Profile Management**
   - Editable academic details (Name, Branch, Academic Year, Graduation Batch).
   - Skills inventory with self-assessed proficiency levels (**Beginner**, **Intermediate**, **Advanced**) and domain categories.
   - Technical interests and professional executive summary.

4. **Career Goal Selection**
   - Selection from standardized industry roles: *Full Stack Developer, Frontend Developer, Backend Developer, Data Analyst, AI/ML Engineer, Cloud Engineer, Cybersecurity Analyst, UI/UX Designer, Software Engineer*.
   - In-depth specifications: benchmark required skills with proficiency expectations, preferred skills, recommended learning paths, capstone projects, and salary CTC indicators.

5. **AI Skill Gap Analysis (Core Engine)**
   - Deterministic, mathematical evaluation comparing student skill levels against industry required levels.
   - Categorization into **Strong Skills** (100% met), **Skills to Improve** (partial level gap), and **Missing Skills** (critical gap).
   - Priority-ranked learning actions for every gap with concrete recommendations.
   - Domain competency breakdown bars and comparative audit table.

6. **Personalized 5-Phase Career Roadmap**
   - Dynamically generated based on the student's selected career goal.
   - **Phase 1 – Foundation** (Languages, protocols, version control)
   - **Phase 2 – Development** (Frameworks, state management, REST APIs)
   - **Phase 3 – Advanced** (Databases, server architecture, cloud fundamentals)
   - **Phase 4 – Projects** (Production-grade capstone applications)
   - **Phase 5 – Placement Preparation** (Aptitude, DSA, mock interviews, resume)
   - Interactive topic checkboxes persisting progress directly to MongoDB.

7. **Job & Company Matching**
   - Real campus recruitment opportunities from top tech firms (*Microsoft, Google, Amazon, Razorpay, Swiggy, TCS, Cisco, etc.*).
   - Dynamic **Skill Match %** calculated uniquely for each student based on possessed vs required skills.
   - Filters by role, company name, skill keywords, and minimum match percentage.

8. **Emerging Skills Tracker**
   - Continuous monitoring of fast-changing market demands: *Generative AI & LLMs, Cloud Computing, Cybersecurity, Data Analytics, Machine Learning, DevOps, Full Stack Development*.
   - Explanations of why each skill matters to recruiters, related roles, and concrete learning actions.

9. **Aptitude Practice System**
   - Timed mock assessments across **Quantitative Aptitude**, **Logical Reasoning**, and **Verbal Ability**.
   - 10-minute countdown timer with auto-submit protection.
   - Question navigation palette, objective scoring, and full question-by-question review with step-by-step explanations.
   - Historical test attempts saved to MongoDB.

10. **Coding DSA Practice Module**
    - Curated problems in *Arrays, Strings, Searching, Sorting, Linked Lists, and Basic Algorithms*.
    - Interactive code editor supporting JavaScript and Python starter templates.
    - Test case validation simulation and "Mark as Solved" tracking.
    - Metrics tracking solved count, attempted count, and difficulty distribution.

11. **Interview Preparation**
    - Frequently asked questions categorized into **HR**, **Technical**, and **Behavioral (STAR method)**.
    - Key talking points and recruiter-grade sample model answers.
    - Student personal answer drafting textarea with persistent saving.

12. **Resume Builder & Scorer**
    - Interactive editor covering Personal Info, Education, Technical Skills, Projects, Experience, and Certifications.
    - Automated **Completeness Score (0-100%)** with section-by-section improvement suggestions.
    - Clean, professional resume view ready for browser printing or PDF export.

13. **Projects & Certifications Recommendations**
    - Mapped directly to target career goals and identified skill gaps.
    - Project cards with difficulty, skills learned, description, expected placement signal, and time estimates.
    - Recognized industry certifications (AWS, Meta, Google, MongoDB, CompTIA).

14. **Administrator Portal**
    - Secured with JWT and role check (`role === 'admin'`).
    - Institutional dashboard: total students, partner companies, job listings, question counts, and average cohort readiness.
    - Frequency ranking of the **most common skill gaps** across registered students.
    - Full CRUD management over Companies, Career Roles, Aptitude Questions, Coding Problems, Interview Questions, and Emerging Skills.
    - Student Directory for placement cell coordinators.

---

## 🛠 Technology Stack

- **Frontend**:
  - React 19 + Vite
  - React Router DOM v7
  - Tailwind CSS v4
  - Axios (with JWT interceptors)
  - Lucide React (clean, consistent iconography)
- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose ODM
  - JSON Web Tokens (`jsonwebtoken`)
  - Password hashing (`bcryptjs`)
  - CORS & Dotenv
- **Architecture**:
  - Clean separation: `models/`, `controllers/`, `routes/`, `middleware/`, `utils/`, `config/`.

---

## 📁 Project Directory Structure

```
careerprep/
├── package.json                   # Root orchestrator scripts
├── README.md                      # Complete documentation
│
├── server/                        # Express + MongoDB Backend
│   ├── .env                       # Environment variables
│   ├── package.json
│   ├── index.js                   # Server entry point & API route mounting
│   ├── seed.js                    # Reference catalog seeding script
│   ├── createAdmin.js             # Administrative CLI utility
│   ├── config/
│   │   └── db.js                  # MongoDB connection logic
│   ├── models/                    # Mongoose Data Models
│   │   ├── User.js
│   │   ├── RoleSkillProfile.js
│   │   ├── Company.js
│   │   ├── Job.js
│   │   ├── AptitudeQuestion.js
│   │   ├── AptitudeResult.js
│   │   ├── CodingProblem.js
│   │   ├── CodingProgress.js
│   │   ├── InterviewQuestion.js
│   │   ├── InterviewProgress.js
│   │   ├── EmergingSkill.js
│   │   ├── Resume.js
│   │   ├── RoadmapProgress.js
│   │   ├── ProjectRecommendation.js
│   │   └── CertificationRecommendation.js
│   ├── controllers/               # Business logic & API handlers
│   ├── routes/                    # REST API routes
│   ├── middleware/                # JWT protect, authorize, error handlers
│   └── utils/                     # Skill gap engine & JWT token generator
│
└── client/                        # React + Vite Frontend
    ├── package.json
    ├── vite.config.js             # Vite config with Tailwind & /api proxy
    ├── index.html                 # App HTML with Inter typography
    └── src/
        ├── index.css              # Tailwind v4 import & print stylesheet
        ├── main.jsx               # React DOM entry
        ├── App.jsx                # Route declarations & layouts
        ├── api/
        │   └── axios.js           # Axios instance with request/response interceptors
        ├── context/
        │   └── AuthContext.jsx    # Session state, login, register, profile sync
        ├── routes/
        │   └── ProtectedRoute.jsx # Role-based & authentication route guards
        ├── components/
        │   ├── common/            # Button, Card, Modal, ProgressBar, ReadinessGauge, etc.
        │   └── layout/            # PublicNavbar, PublicFooter, StudentLayout, AdminLayout
        └── pages/
            ├── public/            # Landing, About, Features, HowItWorks, Login, Register
            ├── student/           # Dashboard, Profile, Goal, SkillGap, Roadmap, Jobs, etc.
            └── admin/             # AdminDashboard, ManageCompanies, ManageRoles, etc.
```

---

## ⚙️ Environment Variables (`server/.env`)

Ensure the file `server/.env` is configured with:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/careerprep
JWT_SECRET=careerprep_super_secret_jwt_key_2026_secure
NODE_ENV=development
ADMIN_REGISTRATION_CODE=admin123
```

---

## 🚀 Setup & Execution Instructions

### Prerequisites
1. **Node.js** (v18+ recommended, verified on v24)
2. **MongoDB** running locally on port 27017 (or MongoDB Atlas connection string)

### 1. Install Dependencies
Run the following commands:

```bash
# In server directory:
cd server
npm install

# In client directory:
cd ../client
npm install
```

### 2. Seed Database with Reference Data
Populate realistic career roles, benchmark skills, company listings, jobs, questions, and problem catalogs:

```bash
cd server
npm run seed
```

*(Note: In accordance with instructions, this seeds only reference catalog data; no fake users or demo logins are created.)*

### 3. Start the Backend API Server
```bash
cd server
npm start
```
The server will run on: **`http://localhost:5000`**

### 4. Start the Frontend React Client
In a new terminal window:
```bash
cd client
npm run dev
```
The frontend will run on: **`http://localhost:5173`**

---

## 🎓 Recommended Presentation / Testing Flow

1. Open **`http://localhost:5173`** in your browser.
2. Review the **Landing Page**, **Why CareerPrep?** feature cards, **5-Step Visual**, and **Readiness Pillars**.
3. Click **"Get Started"** or navigate to **`/register`**.
4. Fill in the student registration form (e.g. *Rahul Sharma*, *rahul@college.edu*, *Computer Science*, graduation *2026*, skills: *JavaScript, React, Git*).
5. Upon registration, you are securely authenticated and redirected to the **Student Dashboard**.
6. Visit **Career Goal** and select **Full Stack Developer** (or another role) as your target career objective.
7. Navigate to **AI Skill Gap Analysis** to observe the real comparison between your profile skills and the benchmark requirements.
8. Open the **Personalized Career Roadmap** and check off topics in Phase 1 & 2 to persist progress in MongoDB.
9. Visit **Jobs & Companies** to observe your custom-calculated **Skill Match %** and review matching listings.
10. Explore **Aptitude Practice** to take a timed 10-minute quiz and review step-by-step solutions.
11. Practice a problem in **Coding Practice** and run test verification.
12. Review model answers and save personal answer notes in **Interview Preparation**.
13. Complete missing sections in **Resume Builder** and verify your completeness score.
14. View the consolidated **Progress Tracking** page to inspect your overall placement readiness index.
15. **Admin Access Testing**:
    - Register a new account at `/register` using the Admin Authorization code: `admin123`.
    - You will be granted `role: 'admin'` and routed to the **Administrator Console** (`/admin`).
    - Test viewing platform-wide statistics, the student directory, and managing partner companies or career roles.
