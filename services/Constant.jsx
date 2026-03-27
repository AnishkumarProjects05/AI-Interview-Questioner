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

export const DISCUSSION_PROMPT = `You are the Lead Interviewer. You have received several sets of interview questions from different high-performance AI models for the following job role and description:

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

📝 Your Task:
1. Review all proposals.
2. Identify the most relevant, high-quality, and unique questions.
3. Remove any redundant or poorly phrased questions.
4. Synthesize these into a single, FINAL list of interview questions that best represents the collective intelligence of the group.
5. Ensure the final number of questions matches the duration:
   - 5 Minutes: 5 questions
   - 15 Minutes: 10 questions
   - 30 Minutes: 20 questions
   - 60 Minutes: 30 questions

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

🎯 Deliver the absolute best interview experience for the candidate.`
