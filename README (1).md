# 🤖 CareerConnect AI

### AI-Powered Interview Preparation, Resume Intelligence & Industry Experience Platform

> CareerConnect AI is a full-stack AI-powered career platform that brings resume analysis, job-description intelligence, personalized interview preparation, voice-based mock interviews, resume tools, and real-world interview experiences into one unified ecosystem.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3FCF8E?logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/TypeScript-Enabled-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Jest-Tested-C21325?logo=jest&logoColor=white" alt="Jest"/>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 📌 Overview

Preparing for technical interviews is often a fragmented process.

Candidates typically use different platforms for:

- Resume analysis
- Job description analysis
- Interview questions
- Mock interviews
- Voice practice
- Interview experiences
- Resume creation
- Professional networking

**CareerConnect AI** brings these workflows together into a single AI-powered career preparation platform.

The platform is designed around the following preparation lifecycle:

```text
Resume / Profile
       │
       ▼
Resume & Job Description Analysis
       │
       ▼
Skill / Role Understanding
       │
       ▼
AI Interview Preparation
       │
       ▼
Voice-Based Mock Interview
       │
       ▼
Interview History & Progress
       │
       ▼
Real Interview Experiences
       │
       ▼
Better Interview Preparation
```

---

# 🎯 Vision

CareerConnect AI aims to make interview preparation:

- 🎯 **Personalized**
- 🤖 **AI-Assisted**
- 🎙️ **Interactive**
- 📊 **Data-Driven**
- 🌐 **Connected to Real-World Experiences**
- 🚀 **Practical and Accessible**

Instead of simply generating generic interview questions, the platform focuses on understanding the candidate, their resume, their target role, and the requirements of the job.

---

# ✨ Features

## 🧠 1. AI-Powered Interview Preparation

CareerConnect AI uses AI-powered workflows to generate interview preparation content based on the candidate's profile and target role.

### Features

- AI-generated technical questions
- Behavioral interview questions
- Role-specific interview questions
- Job-description-aware preparation
- Personalized interview sessions
- Structured interview workflows
- Multiple interview preparation stages

---

## 📄 2. Resume Intelligence

The platform can process resumes and extract useful information that can be used during interview preparation.

### Capabilities

- Resume upload
- PDF resume parsing
- Resume information extraction
- Resume analysis
- Skill identification
- Job-description comparison
- Resume-based interview preparation

### Resume Processing Flow

```text
             Resume
                │
                ▼
        ┌───────────────┐
        │ PDF Parsing   │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │ Data Extract  │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │ AI Analysis   │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │ Skill / Role  │
        │ Understanding │
        └───────────────┘
```

---

# 🎙️ 3. Voice-Based Mock Interviews

One of the major capabilities of CareerConnect AI is its voice-based interview experience.

The platform integrates voice technology to provide a more realistic and conversational interview environment.

### Features

- Voice-based interaction
- Conversational interview flow
- AI-driven questioning
- Interview-style user interface
- Real-time voice interaction
- Mock interview simulation

### Voice Architecture

```text
Candidate
    │
    │ Voice
    ▼
┌───────────────┐
│ VAPI          │
│ Voice Layer   │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ AI Interview  │
│ Engine        │
└───────┬───────┘
        │
        ▼
 AI Generated
 Response
```

---

# 🤖 4. AI & LLM Integration

CareerConnect AI integrates multiple AI technologies to support different application workflows.

### AI Technologies

- OpenAI SDK
- OpenRouter
- Google Gemini
- LangChain
- LangChain Community
- Hugging Face Transformers
- Sentence Transformers

The architecture allows AI-powered functionality to be integrated into resume analysis, question generation, interview workflows, and other career-related features.

---

# 👤 5. Authentication & User Management

The application uses **Supabase Authentication** for user management and session handling.

### Includes

- User registration
- User login
- Session management
- Protected routes
- Server-side authentication
- User-specific application data

```text
User
 │
 ▼
Authentication
 │
 ▼
Supabase Auth
 │
 ▼
Session
 │
 ▼
Protected Application
```

---

# 📚 6. Interview Experience Pool

CareerConnect AI goes beyond AI-generated questions by introducing an **Interview Experience Pool**.

The concept allows candidates to learn from real-world interview experiences shared by other candidates and professionals.

### Experience Data Can Include

- Company
- Job role
- Interview rounds
- Questions asked
- Technical topics
- Behavioral questions
- Candidate experiences
- Preparation approaches

### Experience Sharing Model

```text
       Aspirants
           │
           ▼
┌─────────────────────┐
│ Interview Experience│
│        Pool         │
└──────────┬──────────┘
           │
           ▼
    Real Experiences
           │
           ▼
   Better Preparation
```

---

# 📊 7. Interview History

The platform maintains interview-related information so users can revisit their preparation journey.

Users can use their history to:

- Review previous sessions
- Revisit interview preparation
- Track completed interviews
- Analyze their preparation journey
- Maintain a history of interview activities

---

# 📝 8. Resume Builder

CareerConnect AI includes resume-building functionality to help candidates create and manage their professional profiles.

### Features

- Resume creation
- Resume editing
- Structured resume information
- Resume workflows
- PDF-oriented resume generation

---

# 🔐 9. Security

Security has been considered at both application and deployment levels.

### Application Security

The project includes:

- Authentication middleware
- Protected routes
- API rate limiting
- Environment-based secrets
- Security response headers
- Session validation

### Security Headers

The application configures headers such as:

```text
X-Content-Type-Options
X-Frame-Options
Referrer-Policy
Permissions-Policy
X-XSS-Protection
```

### Rate Limiting

Sensitive API routes can be protected using route-specific rate limiting.

Examples include:

```text
Authentication APIs
AI APIs
Resume Analysis APIs
Experience Verification APIs
Email APIs
```

Rate-limited requests return:

```text
HTTP 429 Too Many Requests
```

---

# 🐳 10. Dockerized Deployment

The project includes Docker support for production-style deployment.

The Docker configuration supports:

- Multi-stage builds
- Next.js standalone output
- Production dependencies
- Non-root runtime user
- Docker Compose

### Container Architecture

```text
             Docker
                │
        ┌───────▼────────┐
        │ Next.js Server │
        └───────┬────────┘
                │
        ┌───────▼────────┐
        │ Supabase       │
        │ Database/Auth  │
        └────────────────┘
```

---

# 🏗️ Architecture

CareerConnect AI follows a modern full-stack architecture centered around Next.js.

```text
┌─────────────────────────────────────────────────────────┐
│                    CAREERCONNECT AI                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    FRONTEND                             │
│                                                         │
│              Next.js + React + Tailwind                 │
│                                                         │
│   ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│   │   Resume   │ │ Interview  │ │  Profile   │          │
│   │  Analysis  │ │     UI     │ │ Dashboard  │          │
│   └──────┬─────┘ └──────┬─────┘ └──────┬─────┘          │
│          │              │              │                │
├──────────┴──────────────┴──────────────┴────────────────┤
│                                                         │
│                APPLICATION LAYER                        │
│                                                         │
│                Next.js Server / APIs                    │
│                                                         │
│      ┌────────────┬────────────┬────────────┐           │
│      │ AI APIs    │  Resume    │    Auth    │           │
│      │            │ Processing │            │           │
│      └──────┬─────┴──────┬─────┴──────┬─────┘           │
│             │            │            │                 │
├─────────────┴────────────┴────────────┴─────────────────┤
│                                                         │
│                     SERVICES                            │
│                                                         │
│   OpenAI   OpenRouter   Gemini   VAPI   Hugging Face   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    SUPABASE                             │
│                                                         │
│             Authentication + Database                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| **Next.js** | Full-stack React framework |
| **React** | UI development |
| **Tailwind CSS** | Styling |
| **Radix UI** | Accessible UI components |
| **Lucide React** | Icons |
| **Heroicons** | Icons |
| **Redux Toolkit** | State management |
| **Sonner** | Notifications |

---

## Backend / Application Layer

| Technology | Purpose |
|---|---|
| **Next.js Server** | Application and backend layer |
| **API Routes** | Backend endpoints |
| **Node.js** | JavaScript runtime |
| **Axios** | HTTP communication |
| **Middleware** | Authentication, security and request processing |

---

## Database & Authentication

| Technology | Purpose |
|---|---|
| **Supabase** | Backend platform |
| **PostgreSQL** | Database |
| **Supabase Auth** | Authentication |
| **Supabase SSR** | Server-side authentication |

---

## AI / ML

| Technology | Purpose |
|---|---|
| **OpenAI SDK** | AI-powered workflows |
| **OpenRouter** | Multi-model AI access |
| **Google Gemini** | Generative AI |
| **LangChain** | AI application orchestration |
| **Transformers** | NLP / ML workflows |
| **Sentence Transformers** | Semantic processing |
| **Hugging Face** | AI/ML ecosystem |

---

## Voice

| Technology | Purpose |
|---|---|
| **VAPI Web SDK** | Voice-based AI interview interactions |

---

## Testing & Code Quality

| Technology | Purpose |
|---|---|
| **Jest** | Unit testing |
| **Testing Library** | Component testing |
| **ESLint** | Code quality |
| **Prettier** | Code formatting |

---

## DevOps

| Technology | Purpose |
|---|---|
| **Docker** | Containerization |
| **Docker Compose** | Container orchestration |
| **Git** | Version control |
| **GitHub** | Source control and collaboration |

---

# 📁 Project Structure

```text
AI-Interview-Questioner/
│
├── app/
│   ├── api/
│   │   ├── ...
│   │   └── ...
│   │
│   ├── auth/
│   ├── interview/
│   ├── resume-builder/
│   ├── resume-import/
│   ├── resume-parser/
│   ├── view-profile/
│   │
│   ├── layout.js
│   └── page.js
│
├── components/
│   └── Reusable UI Components
│
├── context/
│   └── Application Context
│
├── hooks/
│   └── Custom React Hooks
│
├── lib/
│   └── Shared Application Utilities
│
├── services/
│   └── External Service Integrations
│
├── utils/
│   └── Utility Functions
│
├── public/
│   └── Static Assets
│
├── middleware.js
├── next.config.mjs
├── Dockerfile
├── docker-compose.yml
├── jest.config.ts
├── requirements.txt
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js 20+
- npm
- Git
- Python 3.x
- Supabase account
- Required AI provider credentials
- VAPI account for voice features

For Docker deployment:

- Docker
- Docker Compose

---

# 📥 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/AnishkumarProjects05/AI-Interview-Questioner.git
```

```bash
cd AI-Interview-Questioner
```

---

## 2. Install Node Dependencies

```bash
npm install
```

---

## 3. Install Python Dependencies

If you are using the Python-based AI/ML functionality:

```bash
pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

NEXT_PUBLIC_VAPI_KEY=your_vapi_public_key

# Add the required AI provider credentials
# according to the enabled workflows.
```

> ⚠️ **Important:** Never commit `.env`, `.env.local`, API keys, Supabase service-role keys, passwords, or other secrets to GitHub.

---

# ▶️ Run Locally

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# 🐳 Docker Deployment

Build and start the application:

```bash
docker compose up --build
```

Then open:

```text
http://localhost:3000
```

To stop the containers:

```bash
docker compose down
```

---

# 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate test coverage:

```bash
npm run test:coverage
```

---

# 🔄 User Journey

```text
                    ┌───────────────┐
                    │     User      │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Authentication│
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Resume Upload │
                    │  / Creation   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Resume & Job  │
                    │   Analysis    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ AI Interview  │
                    │ Preparation   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Voice Mock    │
                    │  Interview    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Interview     │
                    │   History     │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Interview     │
                    │ Experience    │
                    │     Pool      │
                    └───────────────┘
```

---

# 🧠 Engineering Highlights

## Full-Stack Development

CareerConnect AI combines:

```text
Frontend
   +
Backend
   +
Database
   +
Authentication
   +
AI Services
   +
Voice Services
   +
Testing
   +
Docker
```

into a single application.

---

## AI Integration

AI is integrated into practical career workflows rather than being implemented only as a generic chatbot.

```text
Resume
   │
   ▼
Resume Analysis
   │
   ▼
Role Understanding
   │
   ▼
Question Generation
   │
   ▼
Mock Interview
   │
   ▼
Voice Interaction
```

---

## API Architecture

The application uses server-side API workflows to communicate with:

- AI providers
- Authentication services
- Resume processing services
- Voice services
- Email workflows
- Application data services

---

## Authentication

Supabase authentication is integrated with application middleware to protect user-specific routes and workflows.

---

## Security

The project incorporates:

- Rate limiting
- Security headers
- Authentication middleware
- Environment-based configuration
- Protected API routes
- Non-root Docker execution

---

## Containerization

The production deployment can be packaged as a Docker container using a multi-stage build.

---

# 🎯 Problem Statement

Many students and job seekers face the same challenge:

> **They have access to many preparation resources, but those resources are disconnected.**

A typical preparation workflow might look like:

```text
Resume
   ↓
Platform A

Interview Questions
   ↓
Platform B

Mock Interview
   ↓
Platform C

Voice Practice
   ↓
Platform D

Interview Experiences
   ↓
Platform E
```

CareerConnect AI explores a unified approach:

```text
                  CareerConnect AI
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       Resume         AI Prep       Mock Interview
          │              │              │
          └──────────────┼──────────────┘
                         │
                  Voice Interview
                         │
                         ▼
               Interview Experience
```

---

# 💡 Why CareerConnect AI?

The project is built around a simple idea:

> **Interview preparation should be personalized, realistic, and connected to real-world hiring experiences.**

CareerConnect AI attempts to reduce the fragmentation between:

- Resume preparation
- Job-role understanding
- Interview practice
- AI assistance
- Voice-based simulation
- Interview history
- Real interview experiences

---

# 🗺️ Roadmap

Future development can include:

- [ ] AI-based interview performance scoring
- [ ] Adaptive interview difficulty
- [ ] Interview transcript analysis
- [ ] Communication analysis
- [ ] Automated skill-gap recommendations
- [ ] Company-specific interview preparation
- [ ] Personalized preparation roadmaps
- [ ] Coding interview environment
- [ ] Advanced behavioral analysis
- [ ] Interview analytics dashboard
- [ ] More professional-profile integrations
- [ ] Expanded candidate ↔ industry interaction

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

## Fork the Repository

Create your own fork from GitHub.

## Create a Feature Branch

```bash
git checkout -b feature/your-feature
```

## Make Your Changes

```bash
git add .
```

## Commit

```bash
git commit -m "feat: add your feature"
```

## Push

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

### Contribution Guidelines

When submitting a contribution:

- Keep the code clean and maintainable
- Follow the existing project structure
- Add tests where appropriate
- Document important changes
- Do not commit secrets or credentials
- Include screenshots for major UI changes

---

# 🐛 Issues & Feature Requests

If you discover a bug or have an idea for improvement, please open a GitHub Issue.

When reporting a bug, include:

1. Description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Environment information
6. Screenshots or logs when applicable

---

# 📜 License

No explicit open-source license is currently defined for this repository.

Please contact the repository owner before redistributing or using this project commercially.

---

# 👨‍💻 Author

## Anish Kumar R

**Computer Science Undergraduate | Backend & Full-Stack Developer | AI Enthusiast**

Interested in:

- Backend Engineering
- Full-Stack Development
- Artificial Intelligence
- System Design
- Scalable Software Systems

### 🔗 Links

- GitHub: https://github.com/AnishkumarProjects05
- Project Repository: https://github.com/AnishkumarProjects05/AI-Interview-Questioner

---

# ⭐ Support the Project

If you find **CareerConnect AI** useful or interesting:

⭐ Star the repository  
🐛 Report issues  
💡 Suggest improvements  
🤝 Contribute to the project

---

<p align="center">

## 🚀 CareerConnect AI

### Prepare Smarter. Practice Better. Interview With Confidence.

Built with ❤️ using **Next.js, React, Supabase, AI & Voice Technologies**.

</p>
