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

🧩 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
 question:'',
 type:'Technical/Behavioral/Experience/Problem Solving'
},{
...
}]

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`
