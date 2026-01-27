# 🤖 AI Interview Questioner Platform

**CareerConnect AI** - An intelligent AI-powered interview preparation and practice platform built with Next.js that helps job seekers prepare for technical, behavioral, and experience-based interviews.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [API Routes](#-api-routes)
- [Database](#-database)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**AI Interview Questioner** is a comprehensive interview preparation platform that leverages AI to generate customized interview questions based on job descriptions, roles, and interview types. The platform uses advanced AI models (via OpenRouter) to create realistic interview scenarios and helps candidates practice their responses in a structured environment.

### Key Highlights

- 🎯 **AI-Powered Question Generation** - Automatically generates relevant interview questions based on job role and description
- 👤 **Google OAuth Authentication** - Secure user authentication using Supabase
- 📊 **Multi-Type Interviews** - Support for Technical, Behavioral, Experience, and Problem-Solving interviews
- 📅 **Interview Scheduling** - Schedule and manage your interview practice sessions
- 📈 **Interview History** - Track all your past interview sessions
- 🎨 **Modern UI/UX** - Built with Radix UI components and styled with TailwindCSS
- 📱 **Responsive Design** - Works seamlessly across desktop, tablet, and mobile devices

---

## ✨ Features

### 🔐 Authentication
- **Google Sign-In** - Secure authentication via Supabase
- Session management and user persistence

### 🎯 Interview Management
- **Custom Interview Creation** - Create interviews with specific job titles and descriptions
- **Interview Type Selection** - Choose from multiple interview formats:
  - 💻 Technical
  - 🧠 Behavioral
  - 📋 Experience
  - 🧩 Problem Solving
- **Flexible Duration** - Set interview duration (15, 30, 45, or 60 minutes)
- **Dynamic Question Generation** - AI generates questions tailored to your inputs

### 📊 Dashboard Features
- **Welcome Container** - Personalized greeting and overview
- **Quick Access Options** - Easy navigation to all features
- **Interview History** - View and track all previous interview sessions
- **ATS Tracker** - Application tracking system for job applications

### 🔗 Interview Links
- **Shareable Links** - Generate unique links for each interview session
- **Session IDs** - Dynamic routing for interview management

---

## 🛠 Tech Stack

### Frontend
- **[Next.js 16.0.3](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.0](https://react.dev/)** - UI library
- **[TypeScript 5.9.3](https://www.typescriptlang.org/)** - Type saf    ety
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Backend & Services
- **[OpenRouter SDK](https://openrouter.ai/)** - AI model access (LLaMA 3.3 70B)
- **[Supabase](https://supabase.com/)** - Authentication and database
- **[Axios](https://axios-http.com/)** - HTTP client
- **[Vapi AI](https://vapi.ai/)** - Voice AI integration

### AI Model
- **Meta LLaMA 3.3 70B Instruct** - Free tier model via OpenRouter

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** or **yarn** or **pnpm**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-interview.git
   cd ai-interview
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # OpenRouter API Configuration
   OPEN_ROUTER_API_KEY=your_openrouter_api_key_here

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
ai-interview/
├── app/
│   ├── (main)/                    # Main application routes
│   │   └── dashboard/             # Dashboard with interview management
│   │       ├── CreateButton/      # Interview creation flow
│   │       │   ├── _components/   # Form components for interview setup
│   │       │   └── page.tsx       # Multi-step interview creation
│   │       └── _components/       # Dashboard components
│   ├── api/                       # API routes
│   │   └── aimodel/              # AI question generation endpoint
│   │       └── route.jsx         # POST handler for questions
│   ├── auth/                      # Authentication pages
│   │   └── page.jsx              # Google OAuth login
│   ├── interview/                 # Interview session routes
│   │   ├── [interview_id]/       # Dynamic interview pages
│   │   └── _components/          # Interview UI components
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Home page
│   └── provider.jsx              # Context providers
├── components/
│   └── ui/                       # Reusable UI components (Radix)
│       ├── button.jsx
│       ├── dialog.jsx
│       ├── progress.jsx
│       ├── select.jsx
│       └── ...
├── context/                      # React context providers
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
├── public/                       # Static assets
│   ├── logo.png
│   ├── interview.png
│   ├── login.png
│   └── meeting.png
├── services/
│   ├── Constant.jsx              # Application constants & prompts
│   └── supabaseClient.js         # Supabase client configuration
├── .env.local                    # Environment variables (not in git)
├── .gitignore
├── next.config.mjs               # Next.js configuration
├── package.json
├── postcss.config.mjs
├── tailwind.config.js            # TailwindCSS configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 💡 Usage

### 1. **Sign In**
- Navigate to the authentication page
- Click "Sign in with Google"
- Authorize the application

### 2. **Create an Interview**
- Go to Dashboard
- Click on "Schedule Interview" or the create button
- Fill in the interview details:
  - **Job Title** (e.g., "Frontend Developer")
  - **Job Description** (paste the job posting)
  - **Interview Duration** (15/30/45/60 minutes)
  - **Interview Type** (Technical/Behavioral/Experience/Problem Solving)
- Click **Next** to generate questions

### 3. **AI Question Generation**
- The system sends your inputs to the AI model
- AI analyzes the job description and requirements
- Questions are generated based on:
  - Job responsibilities
  - Required skills
  - Interview type
  - Duration (number of questions adjusted accordingly)

### 4. **Practice Interview**
- View generated questions
- Generate a unique interview link
- Share the link or start practicing
- Access the interview via the dynamic route

### 5. **Track History**
- View all past interviews in the Dashboard
- Review previous questions and sessions
- Track your progress over time

---

## 🔌 API Routes

### `/api/aimodel` - POST

Generates AI interview questions based on job details.

**Request Body:**
```json
{
  "jobPosition": "Frontend Developer",
  "jobDescription": "We are looking for a skilled frontend developer...",
  "duration": "30",
  "type": ["Technical", "Behavioral"]
}
```

**Response:**
```json
{
  "role": "assistant",
  "content": "{\"interviewQuestions\": [{\"question\": \"...\", \"type\": \"Technical\"}, ...]}"
}
```

**AI Model Used:** `meta-llama/llama-3.3-70b-instruct:free`

**Prompt Template:**
- Located in `services/Constant.jsx` as `QUESTION_PROMPT`
- Dynamically replaces placeholders:
  - `{{jobTitle}}`
  - `{{jobDescription}}`
  - `{{duration}}`
  - `{{type}}`

---

## 🗄 Database

### Supabase Integration

The application uses **Supabase** for:
- ✅ **Authentication** - Google OAuth provider
- ✅ **Database** - PostgreSQL for storing:
  - User profiles
  - Interview sessions
  - Generated questions
  - Interview history

### Client Setup
Located in `services/supabaseClient.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

---

## 🌐 Deployment

### Deploy on Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `OPEN_ROUTER_API_KEY`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_KEY`
   - Click **Deploy**

3. **Configure Supabase**
   - Add your Vercel deployment URL to Supabase auth settings
   - Update redirect URLs for OAuth

### Alternative Platforms
- **Netlify**
- **Railway**
- **AWS Amplify**
- **DigitalOcean App Platform**

---

## 🎨 Customization

### Modify Interview Types
Edit `services/Constant.jsx`:
```javascript
export const InterviewType = [
  { title: 'Technical', icon: CodeIcon },
  { title: 'Behaviour', icon: User2Icon },
  { title: 'Experience', icon: BriefcaseBusiness },
  { title: 'Problem Solving', icon: Puzzle }
  // Add your custom types here
]
```

### Customize AI Prompt
Modify `QUESTION_PROMPT` in `services/Constant.jsx` to change how questions are generated.

### Update Sidebar Options
Edit `SideBarOptions` in `services/Constant.jsx`:
```javascript
export const SideBarOptions = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Schedule Interview", icon: Calendar, path: "/schedule-interview" },
  // Add more options
]
```

---

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `OPEN_ROUTER_API_KEY` | API key from OpenRouter.ai | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_KEY` | Supabase anonymous/public key | ✅ Yes |

### Getting API Keys

**OpenRouter:**
1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Navigate to API Keys
4. Create a new key

**Supabase:**
1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy the Project URL and anon/public key

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

---

## 📝 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [OpenRouter](https://openrouter.ai/) - AI model access
- [Radix UI](https://www.radix-ui.com/) - UI component primitives
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Icon library
- [Meta AI](https://ai.meta.com/) - LLaMA 3.3 model

---

## 📧 Support

For support, questions, or feedback:
- Open an issue on GitHub
- Contact: your.email@example.com

---

## 🗺 Roadmap

- [ ] Voice-based interview practice (Vapi integration)
- [ ] Real-time feedback on answers
- [ ] Interview performance analytics
- [ ] Multi-language support
- [ ] PDF export of interview questions
- [ ] Mock interview recording and playback
- [ ] Community question bank
- [ ] Interview tips and resources

---

**Made with ❤️ by [Your Name]**
