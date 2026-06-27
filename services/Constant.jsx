import { BriefcaseBusiness, Calendar, CodeIcon, DockIcon, LayoutDashboard, List, Puzzle, User, User2Icon, WalletCards } from "lucide-react";

export const SideBarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard"
  },

  {
    name: "Interview History",
    icon: List,
    path: "/all-interviews"
  },
  {
    name: "Resume-JD Analyzer",
    icon: DockIcon,
    path: "/resume-jd-analyzer"

  },
  {
    name: "Resume Builder",
    icon: DockIcon,
    path: "/resume-builder"
  },
  {
    name: "Resume Parser",
    icon: DockIcon,
    path: "/resume-parser"
  }
]

export const InterviewType = [
  {
    title: 'Technical',
    icon: CodeIcon
  },
  {
    title: 'Behaviour',
    icon: User2Icon
  },
  {
    title: 'Experience',
    icon: BriefcaseBusiness

  },
  {
    title: 'Problem Solving',
    icon: Puzzle
  }
]


export const QUESTION_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}

Job Description:{{jobDescription}}

Interview Duration: {{duration}}

Interview Type: {{type}}

📝 Your task:

Analyze the job description to identify key responsibilities, required skills, and expected experience.

Generate a list of interview questions depends on interview duration.
Follow these constraints for the number of questions:
- If Duration is 5 Minutes: Generate exactly 5 questions.
- If Duration is 15 Minutes: Generate exactly 10 questions.
- If Duration is 30 Minutes: Generate exactly 20 questions.
- If Duration is 60 Minutes: Generate exactly 30 questions.

Adjust the number and depth of questions to match the interview duration.

IMPORTANT: You must generate ONLY {{type}} questions. Do not include questions from other categories. Every single question in your response MUST have the type "{{type}}".

Ensure the questions match the tone and structure of a real-life {{type}} interview.

🧩 Format your response PRECISELY in JSON format.
Your entire response must be a single JSON object with a key "interviewQuestions" containing the array of questions.

Example format:
{
  "interviewQuestions": [
    {
      "question": "What is...",
      "type": "Technical"
    },
    ...
  ]
}

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`

export const DISCUSSION_PROMPT = `You are the Lead Interviewer and Quality Assurance Specialist. You have received four sets of proposed interview questions from different high-performance AI models for the following job role and description:

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}

Below are the proposals from the models:

---
PROPOSAL 1:
{{proposal1}}

---
PROPOSAL 2:
{{proposal2}}

---
PROPOSAL 3:
{{proposal3}}

---
PROPOSAL 4:
{{proposal4}}
---

📝 Your Task:
You are the final gatekeeper. Your job is to critically evaluate these proposed questions and synthesize the absolute best set.

1. CRITIQUE & FILTER: Review all proposed questions. Discard any questions that are:
   - Too generic (e.g., "Tell me about yourself" if the type is "Technical").
   - Off-topic for the specific Job Description.
   - Poorly phrased, confusing, or too easy for the expected seniority level.
   - NOT of the requested Interview Type ({{type}}).

2. SELECT & ENHANCE: Choose only the most effective, thought-provoking, and practical questions that truly assess the candidate's capabilities. You may combine ideas from different proposals or rephrase questions to make them more impactful and challenging.

3. FINALIZE: Synthesize your choices into a single, cohesive, FINAL list of interview questions.

4. DURATION CONSTRAINTS: Ensure the final number of questions perfectly matches the duration:
   - 5 Minutes: exactly 5 questions
   - 15 Minutes: exactly 10 questions
   - 30 Minutes: exactly 20 questions
   - 60 Minutes: exactly 30 questions

IMPORTANT: Your final list MUST contain ONLY {{type}} questions. Every single question in your final JSON MUST have the key "type" set to "{{type}}".

🧩 Format your response PRECISELY in JSON format.
Your entire response must be a single JSON object with a key "interviewQuestions" containing the array of questions.

Example format:
{
  "interviewQuestions": [
    {
      "question": "Describe a time when you...",
      "type": "{{type}}"
    }
  ]
}

🎯 Deliver an interview script that will accurately identify top-tier talent.`

export const RESUME_QUESTION_PROMPT = `You are an expert technical interviewer conducting a personalized candidate resume interview.
Based on the following inputs and the candidate's extracted resume details, generate a well-structured list of high-quality interview questions tailored directly to their background:

Target Position: {{jobTitle}}

Candidate Resume Content:
{{resumeContent}}

Interview Duration: {{duration}}

Interview Type: {{type}}

📝 Your task:
Analyze the candidate's resume to identify their specific projects, work experiences, technical skills, tools, and achievements.
Generate a list of interview questions that thoroughly evaluate their real-world experience, challenge their technical implementation details mentioned in the resume, and assess their capability for the {{jobTitle}} role.

Follow these constraints for the number of questions:
- If Duration is 5 Minutes: Generate exactly 5 questions.
- If Duration is 15 Minutes: Generate exactly 10 questions.
- If Duration is 30 Minutes: Generate exactly 20 questions.
- If Duration is 60 Minutes: Generate exactly 30 questions.

IMPORTANT: You must generate ONLY {{type}} questions. Every single question in your response MUST have the type "{{type}}".

🧩 Format your response PRECISELY in JSON format.
Your entire response must be a single JSON object with a key "interviewQuestions" containing the array of questions.

Example format:
{
  "interviewQuestions": [
    {
      "question": "In your resume, you mentioned building...",
      "type": "Technical"
    }
  ]
}

🎯 The goal is to conduct a deeply personalized interview probing the candidate's actual resume experience for a {{jobTitle}} role.`

export const RESUME_DISCUSSION_PROMPT = `You are the Lead Interviewer and Quality Assurance Specialist. You have received four sets of proposed resume-based interview questions from different high-performance AI models for the candidate applying for {{jobTitle}}.

Target Position: {{jobTitle}}
Candidate Resume Content:
{{resumeContent}}
Interview Duration: {{duration}}
Interview Type: {{type}}

Below are the proposals from the models:

---
PROPOSAL 1:
{{proposal1}}

---
PROPOSAL 2:
{{proposal2}}

---
PROPOSAL 3:
{{proposal3}}

---
PROPOSAL 4:
{{proposal4}}
---

📝 Your Task:
You are the final gatekeeper. Synthesize the absolute best set of resume-based interview questions. Ensure questions explicitly probe into the projects, accomplishments, and tech stack listed in the candidate's resume.

DURATION CONSTRAINTS:
- 5 Minutes: exactly 5 questions
- 15 Minutes: exactly 10 questions
- 30 Minutes: exactly 20 questions
- 60 Minutes: exactly 30 questions

IMPORTANT: Your final list MUST contain ONLY {{type}} questions. Every single question in your final JSON MUST have the key "type" set to "{{type}}".

🧩 Format your response PRECISELY in JSON format.
Your entire response must be a single JSON object with a key "interviewQuestions" containing the array of questions.

Example format:
{
  "interviewQuestions": [
    {
      "question": "Can you explain how you optimized...",
      "type": "{{type}}"
    }
  ]
}

🎯 Deliver an interview script that effectively validates the candidate's resume achievements.`

