import {
  resumeSlice,
  changeProfile,
  changeWorkExperiences,
  changeEducations,
  changeProjects,
  changeSkills,
  addSectionInForm,
  deleteSectionInFormByIdx,
  moveSectionInForm,
  setResume,
  initialResumeState,
} from "@/lib/resume/redux/resumeSlice";
import { mockResume } from "@/testing/mocks/mock-data";

describe("resumeSlice", () => {
  const reducer = resumeSlice.reducer;

  it("returns the initial state by default", () => {
    expect(reducer(undefined, { type: "UNKNOWN" })).toEqual(initialResumeState);
  });

  describe("changeProfile", () => {
    it("updates individual profile fields", () => {
      let state = reducer(
        initialResumeState,
        changeProfile({ field: "name", value: "Alice Smith" })
      );
      state = reducer(
        state,
        changeProfile({ field: "email", value: "alice@example.com" })
      );

      expect(state.profile.name).toBe("Alice Smith");
      expect(state.profile.email).toBe("alice@example.com");
    });
  });

  describe("work experiences", () => {
    it("updates work experience details and descriptions", () => {
      let state = reducer(
        initialResumeState,
        changeWorkExperiences({ idx: 0, field: "company", value: "Acme Corp" })
      );
      state = reducer(
        state,
        changeWorkExperiences({ idx: 0, field: "jobTitle", value: "Frontend Lead" })
      );
      state = reducer(
        state,
        changeWorkExperiences({
          idx: 0,
          field: "descriptions",
          value: ["Built Next.js apps", "Mentored engineers"],
        })
      );

      expect(state.workExperiences[0].company).toBe("Acme Corp");
      expect(state.workExperiences[0].jobTitle).toBe("Frontend Lead");
      expect(state.workExperiences[0].descriptions).toEqual([
        "Built Next.js apps",
        "Mentored engineers",
      ]);
    });

    it("adds and deletes a work experience entry", () => {
      let state = reducer(
        initialResumeState,
        addSectionInForm({ form: "workExperiences" })
      );
      expect(state.workExperiences).toHaveLength(2);

      state = reducer(
        state,
        deleteSectionInFormByIdx({ form: "workExperiences", idx: 1 })
      );
      expect(state.workExperiences).toHaveLength(1);
    });

    it("moves work experience items up and down", () => {
      let state = reducer(
        initialResumeState,
        addSectionInForm({ form: "workExperiences" })
      );
      state = reducer(
        state,
        changeWorkExperiences({ idx: 0, field: "company", value: "First" })
      );
      state = reducer(
        state,
        changeWorkExperiences({ idx: 1, field: "company", value: "Second" })
      );

      // Move 0 down
      state = reducer(
        state,
        moveSectionInForm({ form: "workExperiences", idx: 0, direction: "down" })
      );
      expect(state.workExperiences[0].company).toBe("Second");
      expect(state.workExperiences[1].company).toBe("First");

      // Move 1 up
      state = reducer(
        state,
        moveSectionInForm({ form: "workExperiences", idx: 1, direction: "up" })
      );
      expect(state.workExperiences[0].company).toBe("First");
      expect(state.workExperiences[1].company).toBe("Second");
    });
  });

  describe("educations and projects", () => {
    it("updates education and project fields", () => {
      let state = reducer(
        initialResumeState,
        changeEducations({ idx: 0, field: "school", value: "MIT" })
      );
      state = reducer(
        state,
        changeProjects({ idx: 0, field: "project", value: "AI Simulator" })
      );

      expect(state.educations[0].school).toBe("MIT");
      expect(state.projects[0].project).toBe("AI Simulator");
    });
  });

  describe("skills", () => {
    it("updates featured skill ratings and descriptions", () => {
      let state = reducer(
        initialResumeState,
        changeSkills({
          field: "featuredSkills",
          idx: 0,
          skill: "Next.js",
          rating: 5,
        })
      );
      state = reducer(
        state,
        changeSkills({
          field: "descriptions",
          value: ["Proficient in SSR", "State management"],
        })
      );

      expect(state.skills.featuredSkills[0]).toEqual({
        skill: "Next.js",
        rating: 5,
      });
      expect(state.skills.descriptions).toEqual([
        "Proficient in SSR",
        "State management",
      ]);
    });
  });

  describe("setResume", () => {
    it("replaces entire resume state with provided resume", () => {
      const state = reducer(initialResumeState, setResume(mockResume));
      expect(state).toEqual(mockResume);
      expect(state.profile.name).toBe(mockResume.profile.name);
    });
  });
});
