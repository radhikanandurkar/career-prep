require('dotenv').config();
const mongoose = require('mongoose');
const RoleSkillProfile = require('./models/RoleSkillProfile');
const Company = require('./models/Company');
const Job = require('./models/Job');
const AptitudeQuestion = require('./models/AptitudeQuestion');
const CodingProblem = require('./models/CodingProblem');
const InterviewQuestion = require('./models/InterviewQuestion');
const EmergingSkill = require('./models/EmergingSkill');
const ProjectRecommendation = require('./models/ProjectRecommendation');
const CertificationRecommendation = require('./models/CertificationRecommendation');

const seedData = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerprep');
    console.log(`Connected to MongoDB for seeding: ${conn.connection.host}`);

    // Drop collections to clear stale indexes and data
    try {
      await mongoose.connection.db.dropDatabase();
      console.log('Cleaned and refreshed careerprep database.');
    } catch (dropErr) {
      console.log('Database clean note:', dropErr.message);
    }

    // 1. Career Roles & Skill Profiles
    const roles = [
      {
        title: 'Full Stack Developer',
        category: 'Software Engineering',
        description: 'Engineers who build end-to-end web applications covering user interface, server logic, database integration, and cloud deployment.',
        averageSalaryRange: '₹8 LPA - ₹18 LPA',
        industryDemand: 'Very High',
        requiredSkills: [
          { name: 'JavaScript', requiredLevel: 'Advanced', weight: 9, category: 'Frontend', importance: 'Must-have' },
          { name: 'React', requiredLevel: 'Intermediate', weight: 8, category: 'Frontend', importance: 'Must-have' },
          { name: 'Node.js', requiredLevel: 'Intermediate', weight: 8, category: 'Backend', importance: 'Must-have' },
          { name: 'Express.js', requiredLevel: 'Intermediate', weight: 7, category: 'Backend', importance: 'Must-have' },
          { name: 'MongoDB', requiredLevel: 'Intermediate', weight: 7, category: 'Database', importance: 'Must-have' },
          { name: 'REST APIs', requiredLevel: 'Advanced', weight: 8, category: 'Backend', importance: 'Must-have' },
          { name: 'HTML5 & CSS3', requiredLevel: 'Advanced', weight: 7, category: 'Frontend', importance: 'Must-have' },
          { name: 'Git & GitHub', requiredLevel: 'Intermediate', weight: 7, category: 'Tools & DevOps', importance: 'Must-have' },
          { name: 'Data Structures & Algorithms', requiredLevel: 'Intermediate', weight: 8, category: 'Computer Science', importance: 'Must-have' },
          { name: 'SQL / PostgreSQL', requiredLevel: 'Beginner', weight: 5, category: 'Database', importance: 'Important' },
          { name: 'Docker', requiredLevel: 'Beginner', weight: 5, category: 'Tools & DevOps', importance: 'Nice-to-have' },
        ],
        preferredSkills: ['TypeScript', 'Next.js', 'Redis', 'AWS / Cloud Basics', 'CI/CD Pipelines'],
        recommendedLearningPath: [
          'Modern JavaScript (ES6+), Asynchronous Programming & DOM',
          'Responsive Web Development with Tailwind CSS and React Component Architecture',
          'Backend API Design with Express.js, Authentication (JWT), and Mongoose ODM',
          'Full Stack Integration, Database Optimization & Error Handling',
          'Deployment on Cloud Platforms, Git Workflows, and Placement Preparation',
        ],
        recommendedProjects: [
          {
            title: 'E-Commerce Marketplace with Payment Gateway',
            difficulty: 'Intermediate',
            description: 'Full-stack store with cart, user authentication, inventory management, and Stripe integration.',
            skills: ['React', 'Node.js', 'Express.js', 'MongoDB'],
          },
          {
            title: 'Real-Time Collaborative Project Management Tool',
            difficulty: 'Advanced',
            description: 'Kanban boards with real-time updates via WebSockets, task assignments, and activity logs.',
            skills: ['React', 'Node.js', 'WebSockets', 'MongoDB'],
          },
        ],
        roadmapPhases: [
          {
            phaseNumber: 1,
            phaseName: 'Phase 1 – Foundation',
            description: 'Master core languages, browser mechanics, styling, and JavaScript primitives.',
            topics: [
              { id: 'fs-1', title: 'HTML5 Semantic Markup & Modern CSS Flexbox/Grid', description: 'Responsive layouts, modern CSS styling patterns, accessibility basics.', skills: ['HTML5 & CSS3'] },
              { id: 'fs-2', title: 'Core JavaScript & ES6+ Features', description: 'Closures, Event Loop, Promises, Async/Await, Array Methods.', skills: ['JavaScript'] },
              { id: 'fs-3', title: 'Version Control with Git & GitHub', description: 'Branching strategies, merge requests, remotes, collaborative git flows.', skills: ['Git & GitHub'] },
            ],
          },
          {
            phaseNumber: 2,
            phaseName: 'Phase 2 – Modern Frontend Development',
            description: 'Develop rich component-driven single page applications.',
            topics: [
              { id: 'fs-4', title: 'React Core, Hooks & State Management', description: 'useState, useEffect, useMemo, custom hooks, component life cycles.', skills: ['React'] },
              { id: 'fs-5', title: 'Client-Side Routing & REST API Consumption', description: 'React Router v6/v7, Axios interceptors, handling async states and errors.', skills: ['React', 'REST APIs'] },
              { id: 'fs-6', title: 'Component Styling & Responsive UI Design', description: 'Tailwind CSS, reusable UI atomic design, mobile-first design principles.', skills: ['HTML5 & CSS3'] },
            ],
          },
          {
            phaseNumber: 3,
            phaseName: 'Phase 3 – Backend & Database Engineering',
            description: 'Build secure, scalable RESTful services and relational/document databases.',
            topics: [
              { id: 'fs-7', title: 'Node.js Runtime & Express Server Architecture', description: 'Routing, middleware chains, controller-service pattern, environment management.', skills: ['Node.js', 'Express.js'] },
              { id: 'fs-8', title: 'MongoDB Schema Design & Mongoose Modeling', description: 'Schema validation, indexing, aggregation pipelines, relationships.', skills: ['MongoDB'] },
              { id: 'fs-9', title: 'Authentication, Authorization & Security', description: 'JWT tokens, bcrypt password hashing, input sanitization, CORS.', skills: ['REST APIs', 'Node.js'] },
            ],
          },
          {
            phaseNumber: 4,
            phaseName: 'Phase 4 – Production Projects & DevOps',
            description: 'Ship complete capstone applications with containerization and cloud hosting.',
            topics: [
              { id: 'fs-10', title: 'Full Stack Capstone Application', description: 'Integrate frontend with backend, implement pagination, search, filter, and error boundaries.', skills: ['React', 'Node.js', 'MongoDB'] },
              { id: 'fs-11', title: 'Containerization & Cloud Deployment', description: 'Dockerizing Node and React apps, environment configuration, cloud deployment.', skills: ['Docker', 'Tools & DevOps'] },
            ],
          },
          {
            phaseNumber: 5,
            phaseName: 'Phase 5 – Placement & Industry Readiness',
            description: 'Crack campus placement drives through DSA, Aptitude, Mock Interviews, and Resume polish.',
            topics: [
              { id: 'fs-12', title: 'Data Structures & Algorithms Problem Solving', description: 'Arrays, Strings, HashMaps, Trees, Two Pointers, dynamic programming essentials.', skills: ['Data Structures & Algorithms'] },
              { id: 'fs-13', title: 'System Design Basics & Placement Mock Interviews', description: 'Client-server architecture, database indexing, REST vs GraphQL, behavioral questions.', skills: ['REST APIs', 'Interview Prep'] },
            ],
          },
        ],
      },
      {
        title: 'Frontend Developer',
        category: 'Software Engineering',
        description: 'Specialists focused on creating intuitive, high-performance, and visually appealing web interfaces.',
        averageSalaryRange: '₹7 LPA - ₹15 LPA',
        industryDemand: 'High',
        requiredSkills: [
          { name: 'JavaScript', requiredLevel: 'Advanced', weight: 9, category: 'Frontend', importance: 'Must-have' },
          { name: 'React', requiredLevel: 'Advanced', weight: 9, category: 'Frontend', importance: 'Must-have' },
          { name: 'HTML5 & CSS3', requiredLevel: 'Advanced', weight: 8, category: 'Frontend', importance: 'Must-have' },
          { name: 'TypeScript', requiredLevel: 'Intermediate', weight: 7, category: 'Frontend', importance: 'Must-have' },
          { name: 'Tailwind CSS', requiredLevel: 'Intermediate', weight: 7, category: 'Frontend', importance: 'Must-have' },
          { name: 'REST APIs', requiredLevel: 'Intermediate', weight: 7, category: 'Frontend', importance: 'Must-have' },
          { name: 'Git & GitHub', requiredLevel: 'Intermediate', weight: 6, category: 'Tools', importance: 'Must-have' },
          { name: 'Web Performance Optimization', requiredLevel: 'Intermediate', weight: 6, category: 'Frontend', importance: 'Important' },
        ],
        preferredSkills: ['Next.js', 'Redux Toolkit', 'Testing (Jest/Playwright)', 'Figma to Code'],
        recommendedLearningPath: [
          'Advanced JavaScript & Browser Internals',
          'React Deep Dive (Virtual DOM, Hooks, Performance)',
          'TypeScript for Enterprise Frontend Codebases',
          'Responsive Design & State Management Systems',
        ],
        recommendedProjects: [
          { title: 'Interactive Analytics Dashboard', difficulty: 'Intermediate', description: 'Rich dashboard with interactive charts, dark mode, filter widgets, and responsive layout.', skills: ['React', 'TypeScript', 'Tailwind CSS'] },
          { title: 'SaaS Landing Page with Animation', difficulty: 'Beginner', description: 'Pixel-perfect responsive landing page with micro-interactions and accessibility compliance.', skills: ['HTML5 & CSS3', 'JavaScript'] },
        ],
        roadmapPhases: [
          {
            phaseNumber: 1,
            phaseName: 'Phase 1 – Core Web Languages',
            description: 'Semantic HTML, modern CSS layouts, and vanilla JS mechanics.',
            topics: [
              { id: 'fe-1', title: 'HTML5 Semantics & Responsive CSS Grid/Flexbox', description: 'Layouts, responsive typography, media queries.', skills: ['HTML5 & CSS3'] },
              { id: 'fe-2', title: 'JavaScript Engine, DOM & Events', description: 'DOM manipulation, Event delegation, async handling.', skills: ['JavaScript'] },
            ],
          },
          {
            phaseNumber: 2,
            phaseName: 'Phase 2 – React Ecosystem',
            description: 'Master React state, hooks, routing, and component lifecycles.',
            topics: [
              { id: 'fe-3', title: 'React Fundamentals & Component Architecture', description: 'JSX, Props, state, unidirectional data flow.', skills: ['React'] },
              { id: 'fe-4', title: 'Hooks & Modern State Management', description: 'useEffect, useContext, useReducer, state libraries.', skills: ['React'] },
            ],
          },
          {
            phaseNumber: 3,
            phaseName: 'Phase 3 – TypeScript & Styling Frameworks',
            description: 'Type safety and rapid enterprise UI styling.',
            topics: [
              { id: 'fe-5', title: 'TypeScript for React Applications', description: 'Types, Interfaces, Generics, Typing Props and Events.', skills: ['TypeScript'] },
              { id: 'fe-6', title: 'Utility-First Styling with Tailwind CSS', description: 'Building design systems with reusable Tailwind utility patterns.', skills: ['Tailwind CSS'] },
            ],
          },
          {
            phaseNumber: 4,
            phaseName: 'Phase 4 – Advanced Optimization & Testing',
            description: 'Code splitting, memoization, lighthouse audits, and unit testing.',
            topics: [
              { id: 'fe-7', title: 'Performance Optimization & Lighthouse', description: 'Lazy loading, code splitting, memoization, bundle analysis.', skills: ['Web Performance Optimization'] },
            ],
          },
          {
            phaseNumber: 5,
            phaseName: 'Phase 5 – Placement Readiness',
            description: 'Frontend machine coding rounds, DOM questions, and behavioral interview prep.',
            topics: [
              { id: 'fe-8', title: 'Machine Coding Round Preparation', description: 'Live coding components like autocomplete, pagination, modal, carousel under 45 mins.', skills: ['JavaScript', 'React'] },
            ],
          },
        ],
      },
      {
        title: 'Backend Developer',
        category: 'Software Engineering',
        description: 'Engineers who design scalable server architectures, write secure APIs, manage databases, and optimize performance.',
        averageSalaryRange: '₹8.5 LPA - ₹18 LPA',
        industryDemand: 'Very High',
        requiredSkills: [
          { name: 'Node.js', requiredLevel: 'Advanced', weight: 9, category: 'Backend', importance: 'Must-have' },
          { name: 'Express.js', requiredLevel: 'Advanced', weight: 8, category: 'Backend', importance: 'Must-have' },
          { name: 'SQL / PostgreSQL', requiredLevel: 'Intermediate', weight: 8, category: 'Database', importance: 'Must-have' },
          { name: 'MongoDB', requiredLevel: 'Intermediate', weight: 8, category: 'Database', importance: 'Must-have' },
          { name: 'REST APIs', requiredLevel: 'Advanced', weight: 9, category: 'Backend', importance: 'Must-have' },
          { name: 'Data Structures & Algorithms', requiredLevel: 'Advanced', weight: 8, category: 'Computer Science', importance: 'Must-have' },
          { name: 'System Design Basics', requiredLevel: 'Intermediate', weight: 7, category: 'Architecture', importance: 'Important' },
          { name: 'Docker', requiredLevel: 'Intermediate', weight: 6, category: 'DevOps', importance: 'Important' },
        ],
        preferredSkills: ['Redis', 'Microservices', 'Kafka / RabbitMQ', 'GraphQL', 'AWS EC2 / S3'],
        recommendedLearningPath: [
          'Server Runtimes, Event-Driven I/O & Concurrency',
          'Relational and NoSQL Database Design, Indexing & Transactions',
          'API Security, Rate Limiting & Authentication',
          'Distributed Systems & Caching with Redis',
        ],
        recommendedProjects: [
          { title: 'Scalable URL Shortener with Analytics & Caching', difficulty: 'Intermediate', description: 'High-throughput URL shortener with Redis caching and PostgreSQL persistence.', skills: ['Node.js', 'PostgreSQL', 'Redis'] },
          { title: 'Role-Based Authentication & Authorization Microservice', difficulty: 'Intermediate', description: 'JWT authentication service with refresh token rotation and role-based permissions.', skills: ['Node.js', 'Express.js', 'MongoDB'] },
        ],
        roadmapPhases: [
          {
            phaseNumber: 1,
            phaseName: 'Phase 1 – Programming & Computer Science Core',
            description: 'Foundational programming, OS concepts, networking fundamentals.',
            topics: [
              { id: 'be-1', title: 'HTTP/HTTPS, TCP/IP, and Network Protocols', description: 'Status codes, headers, DNS, REST architectural constraints.', skills: ['REST APIs'] },
              { id: 'be-2', title: 'Data Structures & Algorithmic Complexity', description: 'Time/space complexity, sorting, hashing, trees.', skills: ['Data Structures & Algorithms'] },
            ],
          },
          {
            phaseNumber: 2,
            phaseName: 'Phase 2 – Server Architecture & APIs',
            description: 'Building production-grade Express/Node services.',
            topics: [
              { id: 'be-3', title: 'Node.js Event Loop & Asynchronous I/O', description: 'Streams, buffers, worker threads, clustering.', skills: ['Node.js'] },
              { id: 'be-4', title: 'RESTful API Engineering & Middleware', description: 'Error handling, validation, logging, rate limiting.', skills: ['Express.js', 'REST APIs'] },
            ],
          },
          {
            phaseNumber: 3,
            phaseName: 'Phase 3 – Databases & Data Modeling',
            description: 'Relational vs Document stores, indexing, transactions, and ORMs.',
            topics: [
              { id: 'be-5', title: 'Relational Database Design with SQL/PostgreSQL', description: 'Joins, normalization, indexing, query optimization, ACID transactions.', skills: ['SQL / PostgreSQL'] },
              { id: 'be-6', title: 'NoSQL Databases with MongoDB', description: 'Document models, aggregation pipeline, replica sets.', skills: ['MongoDB'] },
            ],
          },
          {
            phaseNumber: 4,
            phaseName: 'Phase 4 – Scalability & System Architecture',
            description: 'Caching, containers, background jobs, and microservices.',
            topics: [
              { id: 'be-7', title: 'Caching Strategies with Redis', description: 'Cache-aside pattern, session stores, pub/sub messaging.', skills: ['System Design Basics'] },
              { id: 'be-8', title: 'Docker Containerization & Environments', description: 'Dockerfiles, docker-compose, multi-stage builds.', skills: ['Docker'] },
            ],
          },
          {
            phaseNumber: 5,
            phaseName: 'Phase 5 – System Design & Placement Interviews',
            description: 'High-level system design, concurrency, database sharding, and interview drill.',
            topics: [
              { id: 'be-9', title: 'Low Level & High Level System Design', description: 'Designing Twitter feed, WhatsApp messaging, load balancing, CDNs.', skills: ['System Design Basics'] },
            ],
          },
        ],
      },
      {
        title: 'Data Analyst',
        category: 'Data & AI',
        description: 'Professionals who inspect, clean, transform, and model data to discover useful insights and support business decision-making.',
        averageSalaryRange: '₹6.5 LPA - ₹13 LPA',
        industryDemand: 'High',
        requiredSkills: [
          { name: 'SQL', requiredLevel: 'Advanced', weight: 9, category: 'Database', importance: 'Must-have' },
          { name: 'Python', requiredLevel: 'Intermediate', weight: 8, category: 'Programming', importance: 'Must-have' },
          { name: 'Excel / Spreadsheets', requiredLevel: 'Advanced', weight: 7, category: 'Analysis', importance: 'Must-have' },
          { name: 'Power BI / Tableau', requiredLevel: 'Intermediate', weight: 8, category: 'Visualization', importance: 'Must-have' },
          { name: 'Pandas & NumPy', requiredLevel: 'Intermediate', weight: 8, category: 'Data Analysis', importance: 'Must-have' },
          { name: 'Data Cleaning & Preprocessing', requiredLevel: 'Intermediate', weight: 7, category: 'Data Analysis', importance: 'Must-have' },
          { name: 'Statistical Analysis', requiredLevel: 'Intermediate', weight: 7, category: 'Mathematics', importance: 'Important' },
        ],
        preferredSkills: ['R', 'A/B Testing', 'BigQuery', 'Data Storytelling'],
        recommendedLearningPath: [
          'Advanced SQL Queries, Window Functions & CTEs',
          'Data Manipulation with Python (Pandas, NumPy)',
          'Business Intelligence Dashboards with Power BI',
          'Exploratory Data Analysis and Business Storytelling',
        ],
        recommendedProjects: [
          { title: 'Customer Churn Analysis Dashboard', difficulty: 'Intermediate', description: 'Interactive dashboard identifying key churn drivers with actionable recommendations.', skills: ['Python', 'SQL', 'Power BI / Tableau'] },
          { title: 'E-Commerce Sales Performance & Forecasting', difficulty: 'Intermediate', description: 'Cleaned raw transaction logs, identified seasonal revenue trends, and created KPIs.', skills: ['Python', 'Pandas & NumPy', 'SQL'] },
        ],
        roadmapPhases: [
          {
            phaseNumber: 1,
            phaseName: 'Phase 1 – Spreadsheets & Core Statistics',
            description: 'Descriptive stats, data cleaning, advanced Excel formulas.',
            topics: [
              { id: 'da-1', title: 'Statistical Thinking & Excel Mastery', description: 'Probability, hypothesis testing, pivot tables, VLOOKUP/XLOOKUP.', skills: ['Excel / Spreadsheets', 'Statistical Analysis'] },
            ],
          },
          {
            phaseNumber: 2,
            phaseName: 'Phase 2 – SQL & Relational Analytics',
            description: 'Write complex SQL queries for business intelligence.',
            topics: [
              { id: 'da-2', title: 'Advanced SQL Querying', description: 'Window functions, CTEs, subqueries, aggregations.', skills: ['SQL'] },
            ],
          },
          {
            phaseNumber: 3,
            phaseName: 'Phase 3 – Python for Data Analysis',
            description: 'Extracting and cleaning data with Pandas and NumPy.',
            topics: [
              { id: 'da-3', title: 'Data Wrangling with Pandas & NumPy', description: 'Handling missing values, grouping, merging datasets.', skills: ['Python', 'Pandas & NumPy', 'Data Cleaning & Preprocessing'] },
            ],
          },
          {
            phaseNumber: 4,
            phaseName: 'Phase 4 – BI Dashboards & Storytelling',
            description: 'Power BI or Tableau visualization suites.',
            topics: [
              { id: 'da-4', title: 'Interactive BI Dashboards', description: 'DAX expressions, data modeling, visual storytelling.', skills: ['Power BI / Tableau'] },
            ],
          },
          {
            phaseNumber: 5,
            phaseName: 'Phase 5 – Case Studies & Placement Prep',
            description: 'Business case interviews and metric definition rounds.',
            topics: [
              { id: 'da-5', title: 'Business Case Studies & Metrics', description: 'Churn, CAC, LTV, conversion funnels, SQL interview coding.', skills: ['SQL', 'Statistical Analysis'] },
            ],
          },
        ],
      },
      {
        title: 'AI/ML Engineer',
        category: 'Data & AI',
        description: 'Engineers who build, train, evaluate, and deploy machine learning and deep learning models into production software systems.',
        averageSalaryRange: '₹9 LPA - ₹20 LPA',
        industryDemand: 'Critical',
        requiredSkills: [
          { name: 'Python', requiredLevel: 'Advanced', weight: 9, category: 'Programming', importance: 'Must-have' },
          { name: 'Machine Learning Algorithms', requiredLevel: 'Intermediate', weight: 9, category: 'Machine Learning', importance: 'Must-have' },
          { name: 'PyTorch / TensorFlow', requiredLevel: 'Intermediate', weight: 8, category: 'Deep Learning', importance: 'Must-have' },
          { name: 'Scikit-Learn', requiredLevel: 'Intermediate', weight: 8, category: 'Machine Learning', importance: 'Must-have' },
          { name: 'Linear Algebra & Calculus', requiredLevel: 'Intermediate', weight: 7, category: 'Mathematics', importance: 'Must-have' },
          { name: 'Data Preprocessing & Feature Engineering', requiredLevel: 'Intermediate', weight: 8, category: 'Data Analysis', importance: 'Must-have' },
          { name: 'Model Deployment / FastAPI', requiredLevel: 'Intermediate', weight: 7, category: 'Engineering', importance: 'Important' },
          { name: 'Git & GitHub', requiredLevel: 'Intermediate', weight: 6, category: 'Tools', importance: 'Important' },
        ],
        preferredSkills: ['Large Language Models (LLMs)', 'LangChain / LlamaIndex', 'MLflow / MLOps', 'Docker', 'Hugging Face'],
        recommendedLearningPath: [
          'Mathematics for Machine Learning (Linear Algebra, Calculus, Probability)',
          'Classical ML Algorithms with Scikit-Learn',
          'Deep Learning & Neural Networks with PyTorch',
          'NLP, Transformers & Generative AI Systems',
          'Deploying ML Models as REST APIs with Docker & FastAPI',
        ],
        recommendedProjects: [
          { title: 'Intelligent Resume Parser & Ranking Engine', difficulty: 'Advanced', description: 'NLP-based model that extracts skills and ranks candidates against job descriptions.', skills: ['Python', 'PyTorch / TensorFlow', 'Scikit-Learn'] },
          { title: 'End-to-End Image Classification API with FastAPI', difficulty: 'Intermediate', description: 'Convolutional neural network deployed as a scalable Dockerized microservice.', skills: ['Python', 'PyTorch / TensorFlow', 'Model Deployment / FastAPI'] },
        ],
        roadmapPhases: [
          {
            phaseNumber: 1,
            phaseName: 'Phase 1 – Mathematical Foundations & Python',
            description: 'Calculus, vectors, matrices, probability, and advanced Python.',
            topics: [
              { id: 'ml-1', title: 'Math for ML & Scientific Python', description: 'Matrix operations, partial derivatives, NumPy vectorization.', skills: ['Python', 'Linear Algebra & Calculus'] },
            ],
          },
          {
            phaseNumber: 2,
            phaseName: 'Phase 2 – Classical Machine Learning',
            description: 'Regression, Classification, Clustering, Decision Trees, Ensemble Models.',
            topics: [
              { id: 'ml-2', title: 'Supervised & Unsupervised Learning with Scikit-Learn', description: 'Cross-validation, bias-variance tradeoff, hyperparameter tuning.', skills: ['Machine Learning Algorithms', 'Scikit-Learn'] },
            ],
          },
          {
            phaseNumber: 3,
            phaseName: 'Phase 3 – Deep Learning & Neural Networks',
            description: 'Feedforward networks, CNNs, RNNs, and PyTorch.',
            topics: [
              { id: 'ml-3', title: 'PyTorch Deep Learning Architecture', description: 'Backpropagation, custom loss functions, transfer learning.', skills: ['PyTorch / TensorFlow'] },
            ],
          },
          {
            phaseNumber: 4,
            phaseName: 'Phase 4 – LLMs & Generative AI',
            description: 'Transformer architecture, embeddings, and prompt engineering.',
            topics: [
              { id: 'ml-4', title: 'Transformers & LLM Application Development', description: 'Hugging Face models, vector databases, RAG architecture.', skills: ['Machine Learning Algorithms'] },
            ],
          },
          {
            phaseNumber: 5,
            phaseName: 'Phase 5 – MLOps & Production Deployment',
            description: 'Deploying models as microservices with FastAPI and Docker.',
            topics: [
              { id: 'ml-5', title: 'API Serving & ML Model Monitoring', description: 'FastAPI endpoints, containerization, latency optimization.', skills: ['Model Deployment / FastAPI', 'Docker'] },
            ],
          },
        ],
      },
      {
        title: 'Cloud Engineer',
        category: 'Cloud & Security',
        description: 'Professionals who design, provision, configure, and maintain scalable cloud infrastructure and CI/CD pipelines.',
        averageSalaryRange: '₹8 LPA - ₹17 LPA',
        industryDemand: 'Very High',
        requiredSkills: [
          { name: 'Linux Fundamentals', requiredLevel: 'Advanced', weight: 8, category: 'Operating Systems', importance: 'Must-have' },
          { name: 'AWS / Cloud Fundamentals', requiredLevel: 'Intermediate', weight: 9, category: 'Cloud', importance: 'Must-have' },
          { name: 'Docker', requiredLevel: 'Intermediate', weight: 8, category: 'DevOps', importance: 'Must-have' },
          { name: 'Networking Basics', requiredLevel: 'Intermediate', weight: 7, category: 'Computer Science', importance: 'Must-have' },
          { name: 'CI/CD Pipelines (GitHub Actions)', requiredLevel: 'Intermediate', weight: 7, category: 'DevOps', importance: 'Must-have' },
          { name: 'Bash Scripting', requiredLevel: 'Intermediate', weight: 7, category: 'Scripting', importance: 'Must-have' },
          { name: 'Infrastructure as Code (Terraform)', requiredLevel: 'Beginner', weight: 6, category: 'Cloud', importance: 'Important' },
        ],
        preferredSkills: ['Kubernetes', 'Terraform', 'Prometheus & Grafana', 'Python Scripting', 'Azure'],
        recommendedLearningPath: [
          'Linux Command Line, Permissions, and Shell Scripting',
          'Core Cloud Services: Compute (EC2), Storage (S3), Networking (VPC), IAM',
          'Containerization with Docker and Orchestration Basics',
          'Automated CI/CD Workflows with GitHub Actions',
        ],
        recommendedProjects: [
          { title: 'Automated Multi-Tier Cloud Deployment with Terraform', difficulty: 'Intermediate', description: 'Provisions VPC, subnets, EC2 instances, and RDS databases using Infrastructure as Code.', skills: ['AWS / Cloud Fundamentals', 'Infrastructure as Code (Terraform)'] },
          { title: 'Zero-Downtime CI/CD Pipeline for Web Services', difficulty: 'Intermediate', description: 'Automated test and deployment pipeline pushing Docker images to cloud registries.', skills: ['Docker', 'CI/CD Pipelines (GitHub Actions)'] },
        ],
        roadmapPhases: [
          {
            phaseNumber: 1,
            phaseName: 'Phase 1 – Systems & Networking Foundations',
            description: 'Linux systems administration and computer networking.',
            topics: [
              { id: 'cl-1', title: 'Linux Administration & Shell Scripting', description: 'Process management, file permissions, cron jobs, bash scripting.', skills: ['Linux Fundamentals', 'Bash Scripting'] },
              { id: 'cl-2', title: 'Computer Networking (DNS, VPC, Subnets)', description: 'CIDR blocks, routing tables, security groups, firewalls.', skills: ['Networking Basics'] },
            ],
          },
          {
            phaseNumber: 2,
            phaseName: 'Phase 2 – Cloud Service Providers (AWS)',
            description: 'Core compute, storage, security, and identity on AWS.',
            topics: [
              { id: 'cl-3', title: 'AWS Core Services (EC2, S3, IAM, VPC)', description: 'Identity access management, role policies, object storage, virtual servers.', skills: ['AWS / Cloud Fundamentals'] },
            ],
          },
          {
            phaseNumber: 3,
            phaseName: 'Phase 3 – Containers & Orchestration',
            description: 'Docker image packaging, volumes, and networks.',
            topics: [
              { id: 'cl-4', title: 'Containerization with Docker', description: 'Writing optimal Dockerfiles, container networking, persistent storage.', skills: ['Docker'] },
            ],
          },
          {
            phaseNumber: 4,
            phaseName: 'Phase 4 – DevOps & Automation',
            description: 'CI/CD automation pipelines and infrastructure as code.',
            topics: [
              { id: 'cl-5', title: 'CI/CD with GitHub Actions & Terraform', description: 'Automating build, test, and cloud provisioning.', skills: ['CI/CD Pipelines (GitHub Actions)', 'Infrastructure as Code (Terraform)'] },
            ],
          },
          {
            phaseNumber: 5,
            phaseName: 'Phase 5 – Reliability & Placement Prep',
            description: 'High availability, fault tolerance, monitoring, and scenario questions.',
            topics: [
              { id: 'cl-6', title: 'Cloud Architecture & Placement Scenarios', description: 'Load balancing, autoscaling, Disaster recovery drills.', skills: ['AWS / Cloud Fundamentals'] },
            ],
          },
        ],
      },
      {
        title: 'Cybersecurity Analyst',
        category: 'Cloud & Security',
        description: 'Information security analysts who safeguard computer networks, assess vulnerabilities, and respond to cyber incidents.',
        averageSalaryRange: '₹7.5 LPA - ₹16 LPA',
        industryDemand: 'Critical',
        requiredSkills: [
          { name: 'Network Security Fundamentals', requiredLevel: 'Advanced', weight: 9, category: 'Security', importance: 'Must-have' },
          { name: 'Linux Fundamentals', requiredLevel: 'Intermediate', weight: 8, category: 'Operating Systems', importance: 'Must-have' },
          { name: 'Vulnerability Assessment (Nmap/Wireshark)', requiredLevel: 'Intermediate', weight: 8, category: 'Security', importance: 'Must-have' },
          { name: 'OWASP Top 10 Web Vulnerabilities', requiredLevel: 'Intermediate', weight: 8, category: 'Security', importance: 'Must-have' },
          { name: 'Cryptography Basics', requiredLevel: 'Intermediate', weight: 7, category: 'Security', importance: 'Must-have' },
          { name: 'Python for Security Scripting', requiredLevel: 'Beginner', weight: 6, category: 'Programming', importance: 'Important' },
        ],
        preferredSkills: ['SIEM (Splunk/Elastic)', 'Burp Suite', 'Ethical Hacking', 'Incident Response'],
        recommendedLearningPath: [
          'TCP/IP Protocols, Firewalls & Network Packet Analysis',
          'OWASP Web Security Testing and Vulnerability Scanning',
          'Symmetric/Asymmetric Encryption and Hashing Standards',
          'Security Operations, Log Analysis & Incident Handling',
        ],
        recommendedProjects: [
          { title: 'Automated Network Port Scanner & Vulnerability Auditing Tool', difficulty: 'Intermediate', description: 'Python script auditing open ports and flag potential CVE vulnerabilities.', skills: ['Network Security Fundamentals', 'Vulnerability Assessment (Nmap/Wireshark)'] },
          { title: 'Web Application Security Audit Report (OWASP Top 10)', difficulty: 'Intermediate', description: 'Complete security assessment identifying SQLi, XSS, and broken access control in test apps.', skills: ['OWASP Top 10 Web Vulnerabilities'] },
        ],
        roadmapPhases: [
          {
            phaseNumber: 1,
            phaseName: 'Phase 1 – Network & OS Fundamentals',
            description: 'Packets, protocols, sockets, and Linux permissions.',
            topics: [
              { id: 'sec-1', title: 'Packet Analysis with Wireshark & TCP/IP', description: 'Inspecting HTTP, DNS, TCP handshakes, TLS certificates.', skills: ['Network Security Fundamentals'] },
            ],
          },
          {
            phaseNumber: 2,
            phaseName: 'Phase 2 – Web Security & OWASP Top 10',
            description: 'SQL Injection, Cross-Site Scripting, CSRF, and authentication flaws.',
            topics: [
              { id: 'sec-2', title: 'OWASP Vulnerability Identification & Remediation', description: 'Exploiting and remediating common web security vulnerabilities.', skills: ['OWASP Top 10 Web Vulnerabilities'] },
            ],
          },
          {
            phaseNumber: 3,
            phaseName: 'Phase 3 – Cryptography & Identity',
            description: 'Public key infrastructure, hashing, and access control.',
            topics: [
              { id: 'sec-3', title: 'Encryption, Hashing & Digital Signatures', description: 'AES, RSA, SHA-256, HMAC, certificates, MFA.', skills: ['Cryptography Basics'] },
            ],
          },
          {
            phaseNumber: 4,
            phaseName: 'Phase 4 – Defensive Security & SIEM',
            description: 'Log inspection, threat hunting, and security incident response.',
            topics: [
              { id: 'sec-4', title: 'Security Monitoring & Threat Detection', description: 'Analyzing syslog, detecting brute-force, incident reporting.', skills: ['Vulnerability Assessment (Nmap/Wireshark)'] },
            ],
          },
          {
            phaseNumber: 5,
            phaseName: 'Phase 5 – Placement Readiness',
            description: 'Technical security questions, capture the flag (CTF) review, and scenario drills.',
            topics: [
              { id: 'sec-5', title: 'Cybersecurity Interview Preparation', description: 'Security design questions, incident management walk-throughs.', skills: ['Network Security Fundamentals'] },
            ],
          },
        ],
      },
      {
        title: 'UI/UX Designer',
        category: 'Product & Design',
        description: 'Designers who create user-centric digital experiences, conduct UX research, design wireframes, and craft interactive Figma prototypes.',
        averageSalaryRange: '₹6 LPA - ₹14 LPA',
        industryDemand: 'High',
        requiredSkills: [
          { name: 'Figma', requiredLevel: 'Advanced', weight: 9, category: 'Design Tools', importance: 'Must-have' },
          { name: 'Wireframing & Prototyping', requiredLevel: 'Advanced', weight: 8, category: 'Design Process', importance: 'Must-have' },
          { name: 'User Research & Personas', requiredLevel: 'Intermediate', weight: 8, category: 'Research', importance: 'Must-have' },
          { name: 'Design Systems & Component Libraries', requiredLevel: 'Intermediate', weight: 8, category: 'Design Systems', importance: 'Must-have' },
          { name: 'HTML & CSS Basics', requiredLevel: 'Beginner', weight: 6, category: 'Frontend Basics', importance: 'Important' },
          { name: 'Information Architecture', requiredLevel: 'Intermediate', weight: 7, category: 'UX Strategy', importance: 'Important' },
        ],
        preferredSkills: ['Micro-interactions', 'Usability Testing', 'Design Tokens', 'Accessibility (WCAG)'],
        recommendedLearningPath: [
          'Design Principles (Hierarchy, Typography, Color Theory, Spacing)',
          'Figma Mastery (Auto-layout, Components, Variants, Interactive Prototypes)',
          'UX Research Methodologies and User Journey Mapping',
          'Building Scalable Design Systems and Dev Handoff',
        ],
        recommendedProjects: [
          { title: 'End-to-End Mobile Banking App Redesign Case Study', difficulty: 'Intermediate', description: 'Complete UX case study with user interviews, journey maps, wireframes, and hi-fi Figma prototype.', skills: ['Figma', 'Wireframing & Prototyping', 'User Research & Personas'] },
          { title: 'Design System for a Multi-Platform SaaS Tool', difficulty: 'Intermediate', description: 'Created typography scales, color palettes, accessible interactive components, and token specs.', skills: ['Figma', 'Design Systems & Component Libraries'] },
        ],
        roadmapPhases: [
          {
            phaseNumber: 1,
            phaseName: 'Phase 1 – Visual Design & Principles',
            description: 'Typography, grid systems, visual hierarchy, color theory.',
            topics: [
              { id: 'ui-1', title: 'Visual Foundations & UI Layouts', description: 'Color harmony, contrast ratios, modular 8pt grid, typography.', skills: ['Figma'] },
            ],
          },
          {
            phaseNumber: 2,
            phaseName: 'Phase 2 – Figma Tools & Auto-Layout',
            description: 'Auto-layout, variants, components, constraints.',
            topics: [
              { id: 'ui-2', title: 'Figma Component Systems & Auto-Layout', description: 'Mastering responsive auto-layout, nested variants, interactive components.', skills: ['Figma', 'Wireframing & Prototyping'] },
            ],
          },
          {
            phaseNumber: 3,
            phaseName: 'Phase 3 – UX Research & User Journeys',
            description: 'Conducting interviews, creating user personas, mapping empathy.',
            topics: [
              { id: 'ui-3', title: 'UX Discovery & Information Architecture', description: 'Site maps, card sorting, wireframing low-fidelity flows.', skills: ['User Research & Personas', 'Information Architecture'] },
            ],
          },
          {
            phaseNumber: 4,
            phaseName: 'Phase 4 – Design Systems & Prototypes',
            description: 'Scalable design systems and high-fidelity clickable prototypes.',
            topics: [
              { id: 'ui-4', title: 'Interactive Prototyping & Design Tokens', description: 'Micro-interactions, smart animate, design tokens for dev handoff.', skills: ['Design Systems & Component Libraries'] },
            ],
          },
          {
            phaseNumber: 5,
            phaseName: 'Phase 5 – Portfolio & Placement Prep',
            description: 'Crafting deep UX case studies and presentation readiness.',
            topics: [
              { id: 'ui-5', title: 'Portfolio Case Study Defense & Interview Prep', description: 'Presenting research rationales, answering design critique questions.', skills: ['User Research & Personas'] },
            ],
          },
        ],
      },
      {
        title: 'Software Engineer',
        category: 'Software Engineering',
        description: 'Core software engineers adept at computational problem-solving, algorithms, object-oriented design, and reliable software delivery.',
        averageSalaryRange: '₹9 LPA - ₹20 LPA',
        industryDemand: 'Critical',
        requiredSkills: [
          { name: 'Data Structures & Algorithms', requiredLevel: 'Advanced', weight: 10, category: 'Computer Science', importance: 'Must-have' },
          { name: 'C++ or Java', requiredLevel: 'Advanced', weight: 9, category: 'Programming', importance: 'Must-have' },
          { name: 'Object-Oriented Programming (OOP)', requiredLevel: 'Advanced', weight: 8, category: 'Software Design', importance: 'Must-have' },
          { name: 'Database Management Systems (DBMS)', requiredLevel: 'Intermediate', weight: 8, category: 'Database', importance: 'Must-have' },
          { name: 'Operating Systems & Concurrency', requiredLevel: 'Intermediate', weight: 8, category: 'Computer Science', importance: 'Must-have' },
          { name: 'Computer Networks', requiredLevel: 'Intermediate', weight: 7, category: 'Computer Science', importance: 'Must-have' },
          { name: 'Git & GitHub', requiredLevel: 'Intermediate', weight: 7, category: 'Tools', importance: 'Must-have' },
        ],
        preferredSkills: ['System Design (LLD/HLD)', 'Design Patterns', 'Unit Testing', 'Linux Commands'],
        recommendedLearningPath: [
          'Mastering C++ STL or Java Collections Framework',
          'Data Structures: Arrays, Strings, Trees, Graphs, Heaps, Hash Tables',
          'Algorithmic Patterns: Dynamic Programming, Greedy, Backtracking, Divide & Conquer',
          'Core CS Subjects: OS (Deadlocks, Paging, Threads), DBMS (SQL, Normalization, ACID), Networks',
          'Object-Oriented Design and SOLID Principles',
        ],
        recommendedProjects: [
          { title: 'Multi-Threaded In-Memory Key-Value Database', difficulty: 'Advanced', description: 'Fast thread-safe key-value store with LRU eviction and persistence to disk.', skills: ['C++ or Java', 'Operating Systems & Concurrency'] },
          { title: 'Distributed Task Scheduler with Concurrency Controls', difficulty: 'Advanced', description: 'Worker pool handling asynchronous priority jobs with mutex locks and retry queues.', skills: ['Data Structures & Algorithms', 'Object-Oriented Programming (OOP)'] },
        ],
        roadmapPhases: [
          {
            phaseNumber: 1,
            phaseName: 'Phase 1 – Programming Language & STL/Collections',
            description: 'Pointers, memory management, templates/generics, standard libraries.',
            topics: [
              { id: 'se-1', title: 'C++ STL / Java Collections Mastery', description: 'Vectors, unordered_maps, priority_queues, iterators, memory allocation.', skills: ['C++ or Java'] },
            ],
          },
          {
            phaseNumber: 2,
            phaseName: 'Phase 2 – Core Data Structures',
            description: 'Arrays, Strings, Linked Lists, Stacks, Queues, Binary Trees.',
            topics: [
              { id: 'se-2', title: 'Linear Data Structures & Trees', description: 'Two pointers, sliding window, tree traversals, BST validation.', skills: ['Data Structures & Algorithms'] },
            ],
          },
          {
            phaseNumber: 3,
            phaseName: 'Phase 3 – Advanced Algorithms & Graph Theory',
            description: 'DFS/BFS, Dijkstra, Dynamic Programming, Backtracking.',
            topics: [
              { id: 'se-3', title: 'Graphs & Dynamic Programming Patterns', description: 'Topological sort, memoization, knapsack variations, shortest paths.', skills: ['Data Structures & Algorithms'] },
            ],
          },
          {
            phaseNumber: 4,
            phaseName: 'Phase 4 – Core Computer Science Subjects',
            description: 'OS, DBMS, Computer Networks, and Object-Oriented Design.',
            topics: [
              { id: 'se-4', title: 'OS, DBMS & Computer Networks Interview Drill', description: 'Virtual memory, semaphores, indexing, transactions, 3-way handshake.', skills: ['Operating Systems & Concurrency', 'Database Management Systems (DBMS)', 'Computer Networks'] },
            ],
          },
          {
            phaseNumber: 5,
            phaseName: 'Phase 5 – Low Level Design & Mock Placements',
            description: 'SOLID principles, design patterns, and timed coding competitions.',
            topics: [
              { id: 'se-5', title: 'Object-Oriented Design (LLD) & Placement Mock Tests', description: 'Designing parking lot, elevator system, chess game using SOLID patterns.', skills: ['Object-Oriented Programming (OOP)'] },
            ],
          },
        ],
      },
    ];

    const insertedRoles = await RoleSkillProfile.insertMany(roles);
    console.log(`Inserted ${insertedRoles.length} career role benchmarks.`);

    // 2. Companies
    const companies = [
      {
        name: 'Microsoft',
        industry: 'Cloud Computing, Software & AI',
        location: 'Hyderabad / Bangalore, India',
        website: 'https://microsoft.com',
        tier: 'Global Tech Leader',
        hiringStatus: 'Actively Hiring',
        description: 'Global technology powerhouse developing enterprise software, Azure cloud platforms, Windows OS, and cutting-edge OpenAI integrations.',
      },
      {
        name: 'Google',
        industry: 'Search, Cloud, AI & Hardware',
        location: 'Bangalore / Hyderabad / Pune, India',
        website: 'https://google.com',
        tier: 'Global Tech Leader',
        hiringStatus: 'Actively Hiring',
        description: 'World-renowned technology company specializing in internet-related services, cloud infrastructure, AI models (Gemini), and software engineering.',
      },
      {
        name: 'Amazon',
        industry: 'E-commerce, Cloud Services (AWS), AI',
        location: 'Hyderabad / Bangalore / Chennai, India',
        website: 'https://amazon.jobs',
        tier: 'Global Tech Leader',
        hiringStatus: 'Upcoming Campus Drive',
        description: 'Global leader in cloud computing (AWS), e-commerce fulfillment, logistics, and scalable distributed systems engineering.',
      },
      {
        name: 'Razorpay',
        industry: 'FinTech, Payments & Banking Infrastructure',
        location: 'Bangalore, India',
        website: 'https://razorpay.com',
        tier: 'High-Growth Startup',
        hiringStatus: 'Actively Hiring',
        description: 'Leading Indian financial technology company providing full-stack payment gateways and automated corporate banking APIs.',
      },
      {
        name: 'Swiggy',
        industry: 'On-Demand Delivery & Logistics',
        location: 'Bangalore, India',
        website: 'https://swiggy.com',
        tier: 'High-Growth Startup',
        hiringStatus: 'Actively Hiring',
        description: 'Top hyper-local food and grocery delivery platform processing millions of high-throughput real-time logistics events daily.',
      },
      {
        name: 'Tata Consultancy Services (TCS)',
        industry: 'IT Consulting, Enterprise Solutions & Cloud',
        location: 'Pan India (Mumbai / Pune / Chennai / Bangalore)',
        website: 'https://tcs.com',
        tier: 'Service / Enterprise',
        hiringStatus: 'Upcoming Campus Drive',
        description: 'One of the largest global IT consulting firms hiring thousands of engineering graduates for digital engineering and cloud transformations.',
      },
      {
        name: 'Infosys',
        industry: 'Next-Generation Digital Services & Consulting',
        location: 'Bangalore / Pune / Hyderabad / Mysore',
        website: 'https://infosys.com',
        tier: 'Service / Enterprise',
        hiringStatus: 'Open Applications',
        description: 'Global leader in consulting, engineering, and digital services helping global enterprises innovate with AI and cloud technologies.',
      },
      {
        name: 'Cisco Systems',
        industry: 'Computer Networking, Cybersecurity & Cloud',
        location: 'Bangalore, India',
        website: 'https://cisco.com',
        tier: 'Global Tech Leader',
        hiringStatus: 'Actively Hiring',
        description: 'Worldwide technology leader transforming computer networks, zero-trust cybersecurity, and enterprise routing infrastructure.',
      },
    ];

    const insertedCompanies = await Company.insertMany(companies);
    console.log(`Inserted ${insertedCompanies.length} companies.`);

    const compMap = new Map();
    insertedCompanies.forEach((c) => compMap.set(c.name, c._id));

    // 3. Jobs
    const jobs = [
      {
        company: compMap.get('Microsoft'),
        companyName: 'Microsoft',
        title: 'Software Development Engineer - I (Full Stack)',
        roleCategory: 'Full Stack Developer',
        location: 'Hyderabad, India',
        workMode: 'Hybrid',
        experience: 'Fresher / 0-1 Years',
        eligibility: 'B.Tech / B.E. / M.Tech in CS/IT/ECE (CGPA >= 7.5)',
        salaryRange: '₹14 LPA - ₹22 LPA',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'REST APIs', 'Data Structures & Algorithms', 'Git & GitHub'],
        preferredSkills: ['TypeScript', 'Azure', 'Docker'],
        description: 'Join Microsoft Teams and Azure web portal engineering teams building mission-critical collaborative experiences.',
        deadline: '30 October 2026',
        applyUrl: 'https://careers.microsoft.com',
      },
      {
        company: compMap.get('Google'),
        companyName: 'Google',
        title: 'Software Engineer - University Graduate',
        roleCategory: 'Software Engineer',
        location: 'Bangalore, India',
        workMode: 'Hybrid',
        experience: 'Fresher (Graduating 2026/2027)',
        eligibility: 'B.Tech / B.E. / Dual Degree in CS or related technical field',
        salaryRange: '₹18 LPA - ₹28 LPA',
        requiredSkills: ['Data Structures & Algorithms', 'C++ or Java', 'Object-Oriented Programming (OOP)', 'Operating Systems & Concurrency', 'Database Management Systems (DBMS)'],
        preferredSkills: ['System Design Basics', 'Distributed Systems'],
        description: 'Work on core Google search indexers, distributed storage, Android runtime, and cloud services.',
        deadline: '15 November 2026',
        applyUrl: 'https://careers.google.com',
      },
      {
        company: compMap.get('Razorpay'),
        companyName: 'Razorpay',
        title: 'Associate Backend Engineer',
        roleCategory: 'Backend Developer',
        location: 'Bangalore, India',
        workMode: 'On-site',
        experience: 'Fresher / 0-1 Years',
        eligibility: 'B.Tech / B.E. (No active backlogs, Min 65%)',
        salaryRange: '₹12 LPA - ₹18 LPA',
        requiredSkills: ['Node.js', 'Express.js', 'SQL / PostgreSQL', 'REST APIs', 'Data Structures & Algorithms', 'MongoDB'],
        preferredSkills: ['Redis', 'Kafka', 'Docker'],
        description: 'Build reliable financial settlement engines and low-latency webhook delivery systems processing millions of transactions.',
        deadline: '20 October 2026',
        applyUrl: 'https://razorpay.com/jobs',
      },
      {
        company: compMap.get('Swiggy'),
        companyName: 'Swiggy',
        title: 'Frontend Engineer - I',
        roleCategory: 'Frontend Developer',
        location: 'Bangalore, India',
        workMode: 'Hybrid',
        experience: 'Fresher / 0-2 Years',
        eligibility: 'B.Tech / BCA / MCA with strong Javascript skills',
        salaryRange: '₹11 LPA - ₹16 LPA',
        requiredSkills: ['JavaScript', 'React', 'HTML5 & CSS3', 'Tailwind CSS', 'REST APIs', 'Git & GitHub'],
        preferredSkills: ['Next.js', 'Web Performance Optimization'],
        description: 'Craft consumer-facing web experiences, order tracking interfaces, and vendor management dashboards.',
        deadline: '10 November 2026',
        applyUrl: 'https://careers.swiggy.com',
      },
      {
        company: compMap.get('Amazon'),
        companyName: 'Amazon',
        title: 'Cloud Support Associate / Cloud Engineer',
        roleCategory: 'Cloud Engineer',
        location: 'Hyderabad, India',
        workMode: 'Hybrid',
        experience: 'Fresher / 0-1 Years',
        eligibility: 'B.Tech (CS/IT/ECE/EE) with 60%+ throughout academics',
        salaryRange: '₹10 LPA - ₹15 LPA',
        requiredSkills: ['Linux Fundamentals', 'AWS / Cloud Fundamentals', 'Networking Basics', 'Docker', 'Bash Scripting'],
        preferredSkills: ['Python Scripting', 'CI/CD Pipelines (GitHub Actions)'],
        description: 'Architect, support, and automate cloud infrastructure deployments on Amazon Web Services.',
        deadline: '05 November 2026',
        applyUrl: 'https://amazon.jobs',
      },
      {
        company: compMap.get('Cisco Systems'),
        companyName: 'Cisco Systems',
        title: 'Associate Cybersecurity Engineer',
        roleCategory: 'Cybersecurity Analyst',
        location: 'Bangalore, India',
        workMode: 'Hybrid',
        experience: 'Fresher / 0-1 Years',
        eligibility: 'B.Tech / M.Tech in CS/Information Security',
        salaryRange: '₹12 LPA - ₹17 LPA',
        requiredSkills: ['Network Security Fundamentals', 'Linux Fundamentals', 'Vulnerability Assessment (Nmap/Wireshark)', 'OWASP Top 10 Web Vulnerabilities', 'Cryptography Basics'],
        preferredSkills: ['Python for Security Scripting', 'SIEM (Splunk/Elastic)'],
        description: 'Protect cloud perimeter infrastructure, analyze network traffic anomalies, and perform penetration tests on enterprise firmware.',
        deadline: '12 November 2026',
        applyUrl: 'https://jobs.cisco.com',
      },
      {
        company: compMap.get('Tata Consultancy Services (TCS)'),
        companyName: 'Tata Consultancy Services (TCS)',
        title: 'Digital Systems Engineer / Data Analyst',
        roleCategory: 'Data Analyst',
        location: 'Pan India (Pune / Bangalore / Mumbai)',
        workMode: 'On-site',
        experience: 'Fresher (Batch 2026)',
        eligibility: 'B.Tech / B.E. / MCA with Min 60% in X, XII & Graduation',
        salaryRange: '₹7 LPA - ₹9 LPA',
        requiredSkills: ['SQL', 'Python', 'Excel / Spreadsheets', 'Power BI / Tableau', 'Pandas & NumPy'],
        preferredSkills: ['Statistical Analysis', 'Data Cleaning & Preprocessing'],
        description: 'Analyze enterprise datasets, build management KPI dashboards, and streamline data ingestion pipelines for global retail clients.',
        deadline: 'Open till campus drive',
        applyUrl: 'https://nextstep.tcs.com',
      },
    ];

    const insertedJobs = await Job.insertMany(jobs);
    console.log(`Inserted ${insertedJobs.length} active jobs.`);

    // 4. Aptitude Questions
    const aptitudeQuestions = [
      // Quantitative
      {
        category: 'Quantitative Aptitude',
        topic: 'Time and Work',
        difficulty: 'Medium',
        question: 'A can complete a piece of work in 12 days and B can do the same work in 16 days. If they work together for 4 days, what fraction of the work remains unfinished?',
        options: ['7/12', '5/12', '1/3', '7/48'],
        correctAnswerIndex: 1,
        explanation: 'Work done by A in 1 day = 1/12. Work done by B in 1 day = 1/16. Together in 1 day = (1/12 + 1/16) = 7/48. In 4 days they complete 4 * (7/48) = 7/12 of the work. Remaining work = 1 - 7/12 = 5/12.',
      },
      {
        category: 'Quantitative Aptitude',
        topic: 'Speed, Time and Distance',
        difficulty: 'Medium',
        question: 'A train 150 meters long passes a telegraph pole in 10 seconds. How long will it take to cross a platform 200 meters long at the same speed?',
        options: ['13.3 seconds', '23.3 seconds', '20.0 seconds', '25.0 seconds'],
        correctAnswerIndex: 1,
        explanation: 'Speed of train = Distance / Time = 150m / 10s = 15 m/s. To cross platform, total distance = train length + platform length = 150 + 200 = 350m. Time = 350 / 15 = 23.33 seconds.',
      },
      {
        category: 'Quantitative Aptitude',
        topic: 'Percentages & Profit Loss',
        difficulty: 'Easy',
        question: 'If an item is sold for ₹840 at a profit of 20%, what was its original cost price?',
        options: ['₹680', '₹700', '₹720', '₹750'],
        correctAnswerIndex: 1,
        explanation: 'Selling Price = Cost Price * (1 + Profit%). 840 = CP * 1.20 => CP = 840 / 1.2 = ₹700.',
      },
      {
        category: 'Quantitative Aptitude',
        topic: 'Ratio and Proportion',
        difficulty: 'Easy',
        question: 'The ratio of two numbers is 3:5. If each number is increased by 10, the ratio becomes 5:7. What are the original numbers?',
        options: ['12 and 20', '15 and 25', '18 and 30', '21 and 35'],
        correctAnswerIndex: 1,
        explanation: 'Let numbers be 3x and 5x. (3x + 10)/(5x + 10) = 5/7 => 7(3x + 10) = 5(5x + 10) => 21x + 70 = 25x + 50 => 4x = 20 => x = 5. The numbers are 3*5 = 15 and 5*5 = 25.',
      },
      {
        category: 'Quantitative Aptitude',
        topic: 'Probability',
        difficulty: 'Medium',
        question: 'Two dice are thrown simultaneously. What is the probability of getting a sum of 8?',
        options: ['5/36', '1/6', '7/36', '1/9'],
        correctAnswerIndex: 0,
        explanation: 'Total outcomes = 6 * 6 = 36. Favorable pairs for sum = 8 are (2,6), (3,5), (4,4), (5,3), (6,2) = 5 outcomes. Probability = 5/36.',
      },

      // Logical Reasoning
      {
        category: 'Logical Reasoning',
        topic: 'Series & Patterns',
        difficulty: 'Easy',
        question: 'What is the next number in the sequence: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '44', '48'],
        correctAnswerIndex: 1,
        explanation: 'Differences between consecutive numbers: +4, +6, +8, +10. The next difference is +12. 30 + 12 = 42. (Alternatively, n*(n+1): 1*2, 2*3, 3*4, 4*5, 5*6, 6*7 = 42).',
      },
      {
        category: 'Logical Reasoning',
        topic: 'Blood Relations',
        difficulty: 'Medium',
        question: 'Pointing to a photograph, Rahul said, "She is the daughter of my grandfather\'s only son." How is the girl in the photograph related to Rahul?',
        options: ['Mother', 'Aunt', 'Sister', 'Cousin'],
        correctAnswerIndex: 2,
        explanation: 'Rahul\'s grandfather\'s only son is Rahul\'s father. The daughter of Rahul\'s father is Rahul\'s sister.',
      },
      {
        category: 'Logical Reasoning',
        topic: 'Coding-Decoding',
        difficulty: 'Easy',
        question: 'In a certain code language, "ROSE" is written as "TQUG". How is "BLUE" written in that same code?',
        options: ['DNWG', 'DOWG', 'CMVF', 'DNVG'],
        correctAnswerIndex: 0,
        explanation: 'Each letter is shifted forward by 2 positions: R+2=T, O+2=Q, S+2=U, E+2=G. For BLUE: B+2=D, L+2=N, U+2=W, E+2=G => DNWG.',
      },
      {
        category: 'Logical Reasoning',
        topic: 'Direction Sense',
        difficulty: 'Medium',
        question: 'A person walks 5 km North, turns right and walks 4 km, then turns right again and walks 5 km. In which direction and how far is he from his starting point?',
        options: ['4 km East', '4 km West', '5 km North', '9 km East'],
        correctAnswerIndex: 0,
        explanation: 'North 5km (+y: 5), Right/East 4km (+x: 4), Right/South 5km (-y: 5). Net position: (x=4, y=0). He is 4 km East from the starting point.',
      },
      {
        category: 'Logical Reasoning',
        topic: 'Syllogism',
        difficulty: 'Medium',
        question: 'Statements: All cars are vehicles. All vehicles are machines. Conclusion I: All cars are machines. Conclusion II: Some machines are cars.',
        options: ['Only conclusion I follows', 'Only conclusion II follows', 'Neither follows', 'Both conclusion I and II follow'],
        correctAnswerIndex: 3,
        explanation: 'Since all cars are vehicles and all vehicles are machines, cars is a subset of machines (Conclusion I is true). Since the set of machines contains cars, some machines are cars (Conclusion II is also true). Both follow.',
      },

      // Verbal Ability
      {
        category: 'Verbal Ability',
        topic: 'Sentence Correction',
        difficulty: 'Easy',
        question: 'Identify the grammatically correct sentence:',
        options: [
          'Neither the manager nor the engineers was present at the site.',
          'Neither the manager nor the engineers were present at the site.',
          'Neither the manager or the engineers was present at the site.',
          'Neither the manager nor the engineers is present at the site.',
        ],
        correctAnswerIndex: 1,
        explanation: 'With "neither...nor", the verb agrees with the subject closest to it. "The engineers" is plural, so the plural verb "were" is grammatically correct.',
      },
      {
        category: 'Verbal Ability',
        topic: 'Synonyms & Vocabulary',
        difficulty: 'Medium',
        question: 'Choose the word that is closest in meaning to "PRAGMATIC":',
        options: ['Theoretical', 'Practical', 'Idealistic', 'Impulsive'],
        correctAnswerIndex: 1,
        explanation: 'Pragmatic means dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations. Synonym: Practical.',
      },
      {
        category: 'Verbal Ability',
        topic: 'Antonyms',
        difficulty: 'Easy',
        question: 'Choose the word that is most opposite in meaning to "CANDID":',
        options: ['Frank', 'Deceptive', 'Blunt', 'Honest'],
        correctAnswerIndex: 1,
        explanation: 'Candid means truthful and straightforward. Deceptive means giving an appearance or impression different from the true one, making it the antonym.',
      },
      {
        category: 'Verbal Ability',
        topic: 'Idioms and Phrases',
        difficulty: 'Medium',
        question: 'What is the meaning of the idiom "Burning the midnight oil"?',
        options: [
          'Wasting resources carelessly',
          'Working or studying late into the night',
          'Causing an accidental fire',
          'Arriving late for an interview',
        ],
        correctAnswerIndex: 1,
        explanation: 'To "burn the midnight oil" means to read, study, or work late into the night.',
      },
      {
        category: 'Verbal Ability',
        topic: 'Reading Comprehension & Logic',
        difficulty: 'Medium',
        question: 'Choose the correct preposition: "The engineering team has been working on this feature ______ last Monday."',
        options: ['for', 'since', 'from', 'during'],
        correctAnswerIndex: 1,
        explanation: 'We use "since" with a specific point in time (last Monday) with the present perfect continuous tense.',
      },
    ];

    const insertedAptitude = await AptitudeQuestion.insertMany(aptitudeQuestions);
    console.log(`Inserted ${insertedAptitude.length} aptitude questions.`);

    // 5. Coding Problems
    const codingProblems = [
      {
        title: 'Two Sum',
        category: 'Arrays',
        difficulty: 'Easy',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        inputFormat: 'Line 1: Comma-separated array of integers. Line 2: Integer target value.',
        outputFormat: 'Array of two indices [i, j].',
        constraints: '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9',
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0, 1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
          },
          {
            input: 'nums = [3,2,4], target = 6',
            output: '[1, 2]',
            explanation: 'nums[1] + nums[2] == 2 + 4 == 6.',
          },
        ],
        tags: ['Array', 'Hash Table', 'Campus Placements'],
        starterTemplates: {
          javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
          python: 'def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []',
        },
        testCases: [
          { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' },
          { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]' },
        ],
      },
      {
        title: 'Maximum Subarray (Kadane\'s Algorithm)',
        category: 'Arrays',
        difficulty: 'Medium',
        description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.',
        inputFormat: 'An array of positive and negative integers.',
        outputFormat: 'Maximum contiguous sum integer.',
        constraints: '1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4',
        examples: [
          {
            input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
            output: '6',
            explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
          },
        ],
        tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
        starterTemplates: {
          javascript: 'function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let currentSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}',
          python: 'def max_sub_array(nums):\n    max_sum = current_sum = nums[0]\n    for num in nums[1:]:\n        current_sum = max(num, current_sum + num)\n        max_sum = max(max_sum, current_sum)\n    return max_sum',
        },
        testCases: [
          { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
          { input: '[5,4,-1,7,8]', expectedOutput: '23' },
        ],
      },
      {
        title: 'Valid Palindrome',
        category: 'Strings',
        difficulty: 'Easy',
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Return true if it is a palindrome, or false otherwise.',
        inputFormat: 'A string s containing alphanumeric and special characters.',
        outputFormat: 'Boolean (true or false).',
        constraints: '1 <= s.length <= 2 * 10^5',
        examples: [
          {
            input: 's = "A man, a plan, a canal: Panama"',
            output: 'true',
            explanation: '"amanaplanacanalpanama" is a palindrome.',
          },
          {
            input: 's = "race a car"',
            output: 'false',
            explanation: '"raceacar" is not a palindrome.',
          },
        ],
        tags: ['Two Pointers', 'String'],
        starterTemplates: {
          javascript: 'function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}',
          python: 'def is_palindrome(s: str) -> bool:\n    clean = [c.lower() for c in s if c.isalnum()]\n    return clean == clean[::-1]',
        },
        testCases: [
          { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
          { input: '"race a car"', expectedOutput: 'false' },
        ],
      },
      {
        title: 'Binary Search',
        category: 'Searching',
        difficulty: 'Easy',
        description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1 in O(log n) runtime complexity.',
        inputFormat: 'Sorted array nums and target integer.',
        outputFormat: 'Index integer or -1.',
        constraints: '1 <= nums.length <= 10^4, all integers in nums are unique and sorted.',
        examples: [
          {
            input: 'nums = [-1,0,3,5,9,12], target = 9',
            output: '4',
            explanation: '9 exists in nums and its index is 4.',
          },
        ],
        tags: ['Binary Search', 'Array'],
        starterTemplates: {
          javascript: 'function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
          python: 'def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return -1',
        },
        testCases: [
          { input: '[-1,0,3,5,9,12], 9', expectedOutput: '4' },
          { input: '[-1,0,3,5,9,12], 2', expectedOutput: '-1' },
        ],
      },
      {
        title: 'Sort Colors (Dutch National Flag)',
        category: 'Sorting',
        difficulty: 'Medium',
        description: 'Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red (0), white (1), and blue (2). Do this in one pass with O(1) extra space.',
        inputFormat: 'Array containing integers 0, 1, and 2.',
        outputFormat: 'Sorted array in-place.',
        constraints: '1 <= nums.length <= 300, nums[i] is either 0, 1, or 2.',
        examples: [
          {
            input: 'nums = [2,0,2,1,1,0]',
            output: '[0,0,1,1,2,2]',
            explanation: 'Sorted in non-decreasing order.',
          },
        ],
        tags: ['Array', 'Two Pointers', 'Sorting'],
        starterTemplates: {
          javascript: 'function sortColors(nums) {\n  let low = 0, mid = 0, high = nums.length - 1;\n  while (mid <= high) {\n    if (nums[mid] === 0) {\n      [nums[low], nums[mid]] = [nums[mid], nums[low]];\n      low++; mid++;\n    } else if (nums[mid] === 1) {\n      mid++;\n    } else {\n      [nums[mid], nums[high]] = [nums[high], nums[mid]];\n      high--;\n    }\n  }\n  return nums;\n}',
          python: 'def sort_colors(nums):\n    low, mid, high = 0, 0, len(nums) - 1\n    while mid <= high:\n        if nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low += 1; mid += 1\n        elif nums[mid] == 1:\n            mid += 1\n        else:\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high -= 1\n    return nums',
        },
        testCases: [
          { input: '[2,0,2,1,1,0]', expectedOutput: '[0,0,1,1,2,2]' },
        ],
      },
      {
        title: 'Reverse Linked List',
        category: 'Linked Lists',
        difficulty: 'Easy',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list\'s head.',
        inputFormat: 'head = [1,2,3,4,5]',
        outputFormat: '[5,4,3,2,1]',
        constraints: 'The number of nodes in the list is the range [0, 5000].',
        examples: [
          {
            input: 'head = [1,2,3,4,5]',
            output: '[5,4,3,2,1]',
            explanation: 'All pointer directions reversed.',
          },
        ],
        tags: ['Linked List', 'Recursion'],
        starterTemplates: {
          javascript: 'function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}',
          python: 'def reverse_list(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev',
        },
        testCases: [
          { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
        ],
      },
      {
        title: 'Climbing Stairs',
        category: 'Basic Algorithms',
        difficulty: 'Easy',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        inputFormat: 'Integer n representing steps.',
        outputFormat: 'Total distinct combinations integer.',
        constraints: '1 <= n <= 45',
        examples: [
          {
            input: 'n = 3',
            output: '3',
            explanation: 'There are three ways: 1+1+1, 1+2, 2+1.',
          },
        ],
        tags: ['Dynamic Programming', 'Math', 'Memoization'],
        starterTemplates: {
          javascript: 'function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const cur = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = cur;\n  }\n  return prev1;\n}',
          python: 'def climb_stairs(n: int) -> int:\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b',
        },
        testCases: [
          { input: '3', expectedOutput: '3' },
          { input: '4', expectedOutput: '5' },
        ],
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        category: 'Strings',
        difficulty: 'Medium',
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        inputFormat: 'A string s.',
        outputFormat: 'Integer length of substring.',
        constraints: '0 <= s.length <= 5 * 10^4',
        examples: [
          {
            input: 's = "abcabcbb"',
            output: '3',
            explanation: 'The answer is "abc", with the length of 3.',
          },
        ],
        tags: ['Hash Table', 'String', 'Sliding Window'],
        starterTemplates: {
          javascript: 'function lengthOfLongestSubstring(s) {\n  const seen = new Map();\n  let maxLen = 0, left = 0;\n  for (let right = 0; right < s.length; right++) {\n    if (seen.has(s[right]) && seen.get(s[right]) >= left) {\n      left = seen.get(s[right]) + 1;\n    }\n    seen.set(s[right], right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}',
          python: 'def length_of_longest_substring(s: str) -> int:\n    seen = {}\n    max_len = left = 0\n    for right, char in enumerate(s):\n        if char in seen and seen[char] >= left:\n            left = seen[char] + 1\n        seen[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len',
        },
        testCases: [
          { input: '"abcabcbb"', expectedOutput: '3' },
          { input: '"bbbbb"', expectedOutput: '1' },
        ],
      },
    ];

    const insertedProblems = await CodingProblem.insertMany(codingProblems);
    console.log(`Inserted ${insertedProblems.length} coding practice problems.`);

    // 6. Interview Questions
    const interviewQuestions = [
      // HR Questions
      {
        category: 'HR',
        question: 'Tell me about yourself and why you chose your branch/career path.',
        roleCategory: 'Campus HR Rounds',
        difficulty: 'Easy',
        frequency: 'Frequently Asked',
        keyPoints: [
          'Brief elevator pitch: name, college, branch, and graduation year.',
          'Passion spark: what initially inspired your interest in coding/technology.',
          'Key projects or technologies you have mastered.',
          'Why this company and role aligns with your long-term aspirations.',
        ],
        sampleAnswer: 'Good morning/afternoon. I am in my pre-final year pursuing Computer Science Engineering. Over the past three years, I developed a strong foundation in full-stack development and algorithms. Recently, I built a collaborative task management web application with React and Node.js. What excites me about your company is your engineering culture and focus on high-scale systems, which aligns directly with my goal of becoming a reliable software engineer.',
      },
      {
        category: 'HR',
        question: 'Where do you see yourself in the next 3 to 5 years?',
        roleCategory: 'HR Rounds',
        difficulty: 'Medium',
        frequency: 'Frequently Asked',
        keyPoints: [
          'Focus on skill depth and domain mastery rather than rigid job titles.',
          'Demonstrate commitment to continuous learning and team contribution.',
          'Show desire to take ownership of complex software modules and mentor juniors.',
        ],
        sampleAnswer: 'In the next 3 to 5 years, I see myself growing from an entry-level engineer into an autonomous contributor who deeply understands system architecture and business goals. I want to build robust software systems, contribute to cross-functional initiatives, and earn the trust to mentor newer joiners.',
      },
      {
        category: 'HR',
        question: 'What are your greatest strengths and areas of improvement?',
        roleCategory: 'HR Rounds',
        difficulty: 'Easy',
        frequency: 'Must Prepare',
        keyPoints: [
          'Choose a genuine technical or collaborative strength backed by an example.',
          'For weakness, pick a non-fatal trait that you are actively improving.',
          'Mention concrete steps you take to address the improvement area.',
        ],
        sampleAnswer: 'My greatest strength is my systematic problem-solving persistence; when debugging complex backend race conditions, I systematically inspect logs and write reproduction tests. An area I am improving is delegating tasks in hackathons—previously I tried to do everything myself, but now I use Kanban boards and task assignments to communicate earlier.',
      },

      // Technical Questions
      {
        category: 'Technical',
        question: 'Explain the difference between SQL and NoSQL databases. When would you choose one over the other?',
        roleCategory: 'Software Engineering / Backend',
        difficulty: 'Medium',
        frequency: 'Frequently Asked',
        keyPoints: [
          'SQL: Structured schema, ACID compliance, relational joins, vertical scaling (PostgreSQL, MySQL).',
          'NoSQL: Flexible schema (documents, key-value), horizontal scaling, eventual consistency (MongoDB, Redis).',
          'Selection criteria: Financial/Transactional needs SQL; High-velocity unstructured telemetry/catalogs fit NoSQL.',
        ],
        sampleAnswer: 'SQL databases are relational and enforce predefined schemas with strict ACID properties, making them ideal for systems requiring consistency like payment workflows. NoSQL databases, such as MongoDB, store flexible JSON documents and scale horizontally across clusters, which is optimal for rapid iteration, hierarchical data, and high-throughput write workloads.',
      },
      {
        category: 'Technical',
        question: 'What happens behind the scenes from the moment you type a URL into a browser and press Enter?',
        roleCategory: 'Full Stack & Web Engineering',
        difficulty: 'Medium',
        frequency: 'Must Prepare',
        keyPoints: [
          'DNS resolution: browser cache -> OS cache -> resolver -> root/TLD/authoritative nameservers.',
          'TCP 3-way handshake (SYN, SYN-ACK, ACK) and TLS negotiation.',
          'HTTP request dispatched to server or CDN reverse proxy.',
          'Server processing, database lookup, response headers (200 OK) + HTML payload.',
          'Browser parsing: DOM tree, CSSOM tree, Render tree, Layout/Reflow, and Paint.',
        ],
        sampleAnswer: 'First, the browser checks DNS caches to resolve the hostname into an IP address. Next, it establishes a TCP connection with a 3-way handshake, followed by TLS encryption. An HTTP GET request is sent to the server. The server processes the request and sends back HTML, CSS, and JS. The browser constructs the DOM and CSSOM trees, computes the layout, and paints pixels on screen.',
      },
      {
        category: 'Technical',
        question: 'What are the SOLID principles in Object-Oriented Software Design?',
        roleCategory: 'Core Software Engineering',
        difficulty: 'Hard',
        frequency: 'Frequently Asked',
        keyPoints: [
          'S: Single Responsibility Principle (A class should have only one reason to change).',
          'O: Open/Closed Principle (Open for extension, closed for modification).',
          'L: Liskov Substitution Principle (Subclasses must be substitutable for base classes).',
          'I: Interface Segregation Principle (Clients should not be forced to depend on unused interfaces).',
          'D: Dependency Inversion Principle (Depend on abstractions, not concretions).',
        ],
        sampleAnswer: 'SOLID principles guide maintainable software design. Single Responsibility ensures modular classes. Open/Closed allows adding features through inheritance or composition without modifying working code. Liskov ensures child classes preserve parent contracts. Interface Segregation promotes small, focused interfaces. Dependency Inversion decouples high-level business logic from low-level implementations using interfaces.',
      },
      {
        category: 'Technical',
        question: 'What is the Event Loop in JavaScript and how does Node.js handle asynchronous non-blocking I/O?',
        roleCategory: 'Full Stack / Node.js',
        difficulty: 'Medium',
        frequency: 'Frequently Asked',
        keyPoints: [
          'Single-threaded execution with a Call Stack.',
          'libuv thread pool for background asynchronous tasks (fs, crypto, network).',
          'Task queues: Microtask queue (Promises, process.nextTick) and Macrotask queue (setTimeout, setImmediate).',
          'Event Loop constantly checks if the call stack is empty before pushing queued callbacks.',
        ],
        sampleAnswer: 'JavaScript executes on a single main thread with one call stack. When an asynchronous operation like an API request or file read is initiated, Node.js delegates it to the libuv thread pool or OS kernel. Once completed, the callback is pushed to a task queue. When the call stack becomes empty, the Event loop dequeues microtasks (Promises) first, then macrotasks (timers), enabling non-blocking execution.',
      },

      // Behavioral Questions
      {
        category: 'Behavioral',
        question: 'Describe a situation where you had a disagreement with a team member during a college project. How did you resolve it?',
        roleCategory: 'Behavioral / STAR Method',
        difficulty: 'Medium',
        frequency: 'Must Prepare',
        keyPoints: [
          'Situation: Brief context of the group project and deadline.',
          'Task: The conflicting views (e.g. choice of tech stack or architecture).',
          'Action: How you actively listened, set up an objective prototype comparison, and prioritized team goals.',
          'Result: The successful completion and strengthened interpersonal dynamic.',
        ],
        sampleAnswer: 'During our 3rd-year capstone project, our teammate wanted to use Firebase while I advocated for Express with MongoDB to learn custom authentication. Instead of arguing, we listed our evaluation criteria: deadline, learning goals, and query flexibility. We agreed that since our course required understanding backend database schemas, Express/MongoDB was the better choice, but we used Firebase for quick file storage. We delivered on time and scored the highest grade in the department.',
      },
      {
        category: 'Behavioral',
        question: 'Tell me about a time when you failed to meet a target or made a critical mistake in your code. What did you learn?',
        roleCategory: 'Behavioral / STAR Method',
        difficulty: 'Medium',
        frequency: 'Common',
        keyPoints: [
          'Own the mistake without blaming others or making excuses.',
          'Explain immediate containment or rollback actions taken.',
          'Highlight systemic safeguards put in place to prevent recurrence (e.g. unit tests, linting, code reviews).',
        ],
        sampleAnswer: 'During an open-source contribution, I pushed a commit that accidentally broke test suites for other contributors due to a missing environment variable fallback. Rather than ignoring it, I immediately replied to the PR, reverted the breaking commit, and added default fallback values along with a pre-commit hook that ran automated tests locally before push. It taught me to always verify test suites locally before pushing.',
      },
    ];

    const insertedInterview = await InterviewQuestion.insertMany(interviewQuestions);
    console.log(`Inserted ${insertedInterview.length} interview prep questions.`);

    // 7. Emerging Skills
    const emergingSkills = [
      {
        title: 'Generative AI & LLM Engineering',
        category: 'Artificial Intelligence',
        demandIndicator: 'Critical Demand',
        growthRate: '+65% YoY Postings',
        description: 'Building applications powered by Large Language Models, embeddings, Retrieval-Augmented Generation (RAG), and agentic workflows.',
        whyItMatters: 'Every major tech enterprise is integrating generative AI into developer tools, customer portals, and internal workflows. Engineers who understand context windows, prompt tuning, vector search, and model evaluation stand out significantly.',
        relatedRoles: ['AI/ML Engineer', 'Full Stack Developer', 'Software Engineer'],
        recommendedLearningActions: [
          'Learn OpenAI & Gemini API integration with Python or Node.js',
          'Build a RAG pipeline using LangChain or LlamaIndex and a vector database (Chroma/Pinecone)',
          'Study prompt engineering patterns: few-shot, chain-of-thought, and structured JSON output',
        ],
        keyTools: ['Gemini API', 'LangChain', 'LlamaIndex', 'ChromaDB', 'Hugging Face'],
      },
      {
        title: 'Cloud Computing & Serverless Architecture',
        category: 'Cloud & Infrastructure',
        demandIndicator: 'Critical Demand',
        growthRate: '+38% YoY Postings',
        description: 'Designing distributed applications deployed on AWS, Azure, or GCP leveraging microservices, containers, and serverless compute.',
        whyItMatters: 'Over 90% of enterprises host their infrastructure on the cloud. Industry expectations now require fresh graduates to understand compute instances, cloud security, object storage, and deployment pipelines.',
        relatedRoles: ['Cloud Engineer', 'Backend Developer', 'DevOps Specialist'],
        recommendedLearningActions: [
          'Obtain foundational knowledge of AWS EC2, S3, RDS, and IAM roles',
          'Deploy a full-stack containerized application to AWS ECS or Azure Container Apps',
          'Learn basic Infrastructure as Code using Terraform syntax',
        ],
        keyTools: ['AWS', 'Docker', 'Terraform', 'Kubernetes', 'Cloudflare'],
      },
      {
        title: 'Cybersecurity & Application Hardening',
        category: 'Security',
        demandIndicator: 'Critical Demand',
        growthRate: '+42% YoY Postings',
        description: 'Securing web applications, managing secrets, auditing API vulnerabilities, and implementing zero-trust network principles.',
        whyItMatters: 'With escalating data breaches and compliance mandates, companies cannot afford insecure code. Understanding OWASP Top 10 vulnerabilities, JWT security, and input sanitization is essential for all developers.',
        relatedRoles: ['Cybersecurity Analyst', 'Backend Developer', 'Cloud Engineer'],
        recommendedLearningActions: [
          'Practice identifying OWASP Top 10 vulnerabilities on Juice Shop or PortSwigger Web Security Academy',
          'Implement secure session management, rate limiting, and helmet headers in backend servers',
          'Study cryptographic primitives (symmetric vs asymmetric encryption, salting)',
        ],
        keyTools: ['Wireshark', 'Nmap', 'Burp Suite', 'OWASP ZAP', 'Splunk'],
      },
      {
        title: 'Data Analytics & Business Intelligence',
        category: 'Data Science',
        demandIndicator: 'High Demand',
        growthRate: '+32% YoY Postings',
        description: 'Transforming messy business logs into clean dashboards, metric definitions, and predictive insights using SQL and BI visualization tools.',
        whyItMatters: 'Organizations require continuous data-driven decision making. Product managers and engineers alike must interpret metrics, A/B test results, and user funnel drop-offs.',
        relatedRoles: ['Data Analyst', 'Data Scientist', 'Product Analyst'],
        recommendedLearningActions: [
          'Master window functions, CTEs, and complex joins in PostgreSQL or MySQL',
          'Create interactive dashboards in Power BI or Tableau using realistic retail or SaaS datasets',
          'Learn exploratory data analysis using Python Pandas, Seaborn, and Matplotlib',
        ],
        keyTools: ['SQL', 'Power BI', 'Tableau', 'Pandas', 'Excel'],
      },
      {
        title: 'Machine Learning & Predictive Modeling',
        category: 'Artificial Intelligence',
        demandIndicator: 'Very High',
        growthRate: '+45% YoY Postings',
        description: 'Developing mathematical and statistical models that learn from training data to predict trends, classify signals, and automate workflows.',
        whyItMatters: 'Machine learning powers recommendation systems, fraud detection, predictive maintenance, and search ranking across all leading digital platforms.',
        relatedRoles: ['AI/ML Engineer', 'Data Scientist', 'Software Engineer'],
        recommendedLearningActions: [
          'Review linear algebra, multivariate calculus, and hypothesis testing',
          'Train regression, decision forest, and clustering models using Scikit-Learn',
          'Build and train custom neural networks in PyTorch for classification problems',
        ],
        keyTools: ['Python', 'PyTorch', 'Scikit-Learn', 'TensorFlow', 'Jupyter'],
      },
      {
        title: 'DevOps & Continuous Integration (CI/CD)',
        category: 'DevOps',
        demandIndicator: 'Very High',
        growthRate: '+36% YoY Postings',
        description: 'Automating the software delivery lifecycle from code commit to automated testing, container packaging, and cloud release.',
        whyItMatters: 'Modern tech teams ship multiple code releases per day. Engineers who understand git workflows, automated test runners, and Dockerized environments make development faster and safer.',
        relatedRoles: ['DevOps Specialist', 'Full Stack Developer', 'Cloud Engineer'],
        recommendedLearningActions: [
          'Write multi-stage Dockerfiles that produce lightweight production images',
          'Build a GitHub Actions workflow that runs linter, unit tests, and automatic deployment on main merge',
          'Study basic Kubernetes pods, services, and ingress controllers',
        ],
        keyTools: ['GitHub Actions', 'Docker', 'Kubernetes', 'Linux', 'Prometheus'],
      },
      {
        title: 'Full Stack Web Development',
        category: 'Software Engineering',
        demandIndicator: 'Critical Demand',
        growthRate: '+40% YoY Postings',
        description: 'End-to-end development spanning reactive frontend user experiences, secure API gateways, database transactions, and cloud hosting.',
        whyItMatters: 'Full stack developers can prototype complete ideas from scratch and understand how frontend UI decisions impact backend database performance.',
        relatedRoles: ['Full Stack Developer', 'Frontend Developer', 'Backend Developer'],
        recommendedLearningActions: [
          'Build a complete project with React, Node.js, Express, and MongoDB or PostgreSQL',
          'Implement secure user authentication, role-based access control, and payment gateway integration',
          'Optimize web performance, lazy load modules, and deploy on modern hosting infrastructure',
        ],
        keyTools: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
      },
    ];

    const insertedEmerging = await EmergingSkill.insertMany(emergingSkills);
    console.log(`Inserted ${insertedEmerging.length} emerging skills.`);

    // 8. Project Recommendations
    const projectRecommendations = [
      {
        title: 'E-Commerce Marketplace with Role-Based Access Control',
        roleCategory: 'Software Engineering',
        difficulty: 'Intermediate',
        skillsLearned: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth'],
        description: 'A complete online shopping platform with customer cart, checkout, admin inventory management, product filtering, and order history.',
        expectedOutcome: 'Industry-ready portfolio project showcasing full stack CRUD, authentication security, and state management.',
        githubTemplateUrl: 'https://github.com',
        estimatedHours: 25,
      },
      {
        title: 'AI Resume Analyzer & Job Matcher Engine',
        roleCategory: 'Data & AI',
        difficulty: 'Advanced',
        skillsLearned: ['Python', 'NLP', 'Scikit-Learn', 'FastAPI', 'React'],
        description: 'Upload candidate resumes in PDF format, extract technical skills using NLP tokenization, and rank suitability against structured job descriptions.',
        expectedOutcome: 'Demonstrates practical NLP, vector similarity, and API microservice architecture.',
        githubTemplateUrl: 'https://github.com',
        estimatedHours: 35,
      },
      {
        title: 'Real-Time Chat & Collaboration Suite',
        roleCategory: 'Software Engineering',
        difficulty: 'Intermediate',
        skillsLearned: ['React', 'Node.js', 'WebSockets / Socket.io', 'MongoDB'],
        description: 'Multi-room messaging platform supporting instant message delivery, typing indicators, user online status, and message history.',
        expectedOutcome: 'Deep understanding of event-driven WebSockets and real-time state synchronization.',
        githubTemplateUrl: 'https://github.com',
        estimatedHours: 20,
      },
      {
        title: 'Cloud Infrastructure Automation with Terraform',
        roleCategory: 'Cloud & Security',
        difficulty: 'Intermediate',
        skillsLearned: ['AWS', 'Terraform', 'Linux', 'Docker'],
        description: 'Infrastructure as Code scripts provisioning a high-availability VPC, EC2 load balancer, and secure database subnet with automated rollback.',
        expectedOutcome: 'Production-grade DevOps portfolio demonstrating cloud architecture and reproducibility.',
        githubTemplateUrl: 'https://github.com',
        estimatedHours: 18,
      },
      {
        title: 'Interactive Sales Analytics & Executive Dashboard',
        roleCategory: 'Data & AI',
        difficulty: 'Beginner',
        skillsLearned: ['SQL', 'Power BI / Tableau', 'Excel', 'Pandas'],
        description: 'Cleaned raw CSV transaction records, extracted month-over-month growth KPIs, and built an interactive drill-down dashboard for stakeholders.',
        expectedOutcome: 'Showcases business intelligence, data wrangling, and metric presentation.',
        githubTemplateUrl: 'https://github.com',
        estimatedHours: 15,
      },
    ];

    const insertedProjects = await ProjectRecommendation.insertMany(projectRecommendations);
    console.log(`Inserted ${insertedProjects.length} project recommendations.`);

    // 9. Certification Recommendations
    const certificationRecommendations = [
      {
        title: 'AWS Certified Cloud Practitioner (CLF-C02)',
        roleCategory: 'Cloud & Security',
        provider: 'Amazon Web Services',
        skillsCovered: ['Cloud Computing', 'AWS Core Services', 'Security & Compliance', 'Cloud Economics'],
        description: 'Fundamental credential validating overall understanding of the AWS Cloud platform, global infrastructure, and security models.',
        difficulty: 'Foundational',
        estimatedCost: '$100 (Discounts for students available)',
        officialUrl: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
      },
      {
        title: 'Meta Front-End Developer Professional Certificate',
        roleCategory: 'Software Engineering',
        provider: 'Coursera / Meta',
        skillsCovered: ['React', 'JavaScript', 'HTML5 & CSS3', 'Version Control', 'UI/UX Principles'],
        description: 'Nine-course series developed by Meta engineers preparing students for entry-level front-end web development jobs.',
        difficulty: 'Associate',
        estimatedCost: 'Free audit / Financial Aid available',
        officialUrl: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
      },
      {
        title: 'Google Data Analytics Professional Certificate',
        roleCategory: 'Data & AI',
        provider: 'Google / Coursera',
        skillsCovered: ['SQL', 'Spreadsheets', 'Data Cleaning', 'Tableau', 'R Programming'],
        description: 'Rigorous curriculum teaching job-ready data analysis, analytical thinking, data storytelling, and database querying.',
        difficulty: 'Associate',
        estimatedCost: 'Free audit / Financial Aid available',
        officialUrl: 'https://www.coursera.org/professional-certificates/google-data-analytics',
      },
      {
        title: 'MongoDB Certified Associate Developer',
        roleCategory: 'Software Engineering',
        provider: 'MongoDB University',
        skillsCovered: ['MongoDB', 'Schema Design', 'Aggregation Pipelines', 'Node.js / Python Driver'],
        description: 'Validates skills required to build, maintain, and optimize modern applications backed by MongoDB databases.',
        difficulty: 'Associate',
        estimatedCost: 'Free learning / $150 exam (Student pack discounts)',
        officialUrl: 'https://learn.mongodb.com',
      },
      {
        title: 'CompTIA Security+ (SY0-701)',
        roleCategory: 'Cloud & Security',
        provider: 'CompTIA',
        skillsCovered: ['Network Security', 'Vulnerability Management', 'Cryptography', 'Threat Response'],
        description: 'Globally recognized baseline certification for cybersecurity practitioners proving hands-on security problem solving.',
        difficulty: 'Associate',
        estimatedCost: 'Academic student discount voucher',
        officialUrl: 'https://www.comptia.org/certifications/security',
      },
    ];

    const insertedCerts = await CertificationRecommendation.insertMany(certificationRecommendations);
    console.log(`Inserted ${insertedCerts.length} certification recommendations.`);

    console.log('Database seeded successfully with all reference and catalog data!');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
};

seedData();
