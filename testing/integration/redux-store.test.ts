import { store } from "@/lib/resume/redux/store";
import { changeProfile, setResume } from "@/lib/resume/redux/resumeSlice";
import { changeSettings, changeShowForm } from "@/lib/resume/redux/settingsSlice";
import { mockResume } from "@/testing/mocks/mock-data";

describe("Redux Store Integration", () => {
  it("initializes with resume and settings root reducers", () => {
    const state = store.getState();
    expect(state).toHaveProperty("resume");
    expect(state).toHaveProperty("settings");
    expect(state.resume.profile).toBeDefined();
    expect(state.settings.themeColor).toBeDefined();
  });

  it("handles concurrent state updates across both resume and settings slices", () => {
    // Dispatch resume slice action
    store.dispatch(
      changeProfile({ field: "name", value: "Alex Morgan" })
    );

    // Dispatch settings slice action
    store.dispatch(
      changeSettings({ field: "themeColor", value: "#6366f1" })
    );
    store.dispatch(
      changeShowForm({ field: "custom", value: true })
    );

    const updatedState = store.getState();
    expect(updatedState.resume.profile.name).toBe("Alex Morgan");
    expect(updatedState.settings.themeColor).toBe("#6366f1");
    expect(updatedState.settings.formToShow.custom).toBe(true);
  });

  it("allows bulk setting of resume data without interfering with settings", () => {
    store.dispatch(setResume(mockResume));

    const state = store.getState();
    expect(state.resume.profile.email).toBe("jane.doe@example.com");
    expect(state.resume.workExperiences).toHaveLength(1);
    expect(state.settings.documentSize).toBe("Letter");
  });
});
