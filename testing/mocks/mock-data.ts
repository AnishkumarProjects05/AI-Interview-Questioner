import type { Resume, ResumeProfile, ResumeWorkExperience, ResumeEducation, ResumeProject, ResumeSkills } from "@/lib/resume/redux/types";

export const mockProfile: ResumeProfile = {
  name: "Jane Doe",
  summary: "Experienced Full Stack Developer with a passion for building scalable web applications.",
  email: "jane.doe@example.com",
  phone: "+1 555-0199",
  location: "San Francisco, CA",
  url: "https://janedoe.dev",
  personalLinks: [
    { name: "GitHub", url: "https://github.com/janedoe" },
    { name: "LinkedIn", url: "https://linkedin.com/in/janedoe" }
  ],
};

export const mockWorkExperience: ResumeWorkExperience = {
  company: "Tech Innovators Inc",
  jobTitle: "Senior Frontend Engineer",
  date: "Jan 2022 - Present",
  descriptions: [
    "Spearheaded the migration of legacy UI to Next.js and React 19.",
    "Optimized bundle size by 35% using code-splitting and dynamic imports.",
    "Mentored junior developers and instituted automated testing standards."
  ],
};

export const mockEducation: ResumeEducation = {
  school: "University of California, Berkeley",
  degree: "B.S. in Computer Science",
  gpa: "3.85",
  date: "2017 - 2021",
  descriptions: ["Dean's Honor List", "President of Women in Computer Science Club"],
};

export const mockProject: ResumeProject = {
  project: "AI Code Reviewer",
  date: "2023",
  techStack: "TypeScript, Next.js, OpenAI API, TailwindCSS",
  descriptions: [
    "Developed an automated code critique tool that analyzes pull requests.",
    "Achieved 10,000+ active users within first three months."
  ],
};

export const mockSkills: ResumeSkills = {
  featuredSkills: [
    { skill: "React / Next.js", rating: 5 },
    { skill: "TypeScript", rating: 5 },
    { skill: "Node.js", rating: 4 },
    { skill: "TailwindCSS", rating: 5 },
    { skill: "PostgreSQL", rating: 4 },
    { skill: "GraphQL", rating: 3 }
  ],
  descriptions: ["Microservices architecture", "CI/CD automation", "Agile methodologies"],
};

export const mockResume: Resume = {
  profile: mockProfile,
  workExperiences: [mockWorkExperience],
  educations: [mockEducation],
  projects: [mockProject],
  skills: mockSkills,
  custom: {
    descriptions: ["Volunteer tutor at Code.org"]
  }
};

export const mockUser = {
  id: "user-12345",
  email: "candidate@interview.ai",
  name: "Candidate One",
  role: "software_engineer",
};

export const mockInterviewQuestions = [
  {
    id: 1,
    question: "How do you manage complex asynchronous state in Next.js applications?",
    category: "Architecture",
    difficulty: "Advanced",
  },
  {
    id: 2,
    question: "Explain the differences between Server and Client Components in React 19.",
    category: "React",
    difficulty: "Intermediate",
  }
];
