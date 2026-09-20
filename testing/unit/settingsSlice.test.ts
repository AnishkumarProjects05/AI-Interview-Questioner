import {
  settingsSlice,
  changeSettings,
  changeShowForm,
  changeFormHeading,
  changeFormOrder,
  changeShowBulletPoints,
  setSettings,
  initialSettings,
} from "@/lib/resume/redux/settingsSlice";

describe("settingsSlice", () => {
  const reducer = settingsSlice.reducer;

  it("returns initial settings by default", () => {
    expect(reducer(undefined, { type: "UNKNOWN" })).toEqual(initialSettings);
  });

  it("updates general settings such as themeColor and fontFamily", () => {
    let state = reducer(
      initialSettings,
      changeSettings({ field: "themeColor", value: "#ff0000" })
    );
    state = reducer(
      state,
      changeSettings({ field: "fontFamily", value: "Inter" })
    );

    expect(state.themeColor).toBe("#ff0000");
    expect(state.fontFamily).toBe("Inter");
  });

  it("toggles section visibility via changeShowForm", () => {
    const state = reducer(
      initialSettings,
      changeShowForm({ field: "custom", value: true })
    );
    expect(state.formToShow.custom).toBe(true);
  });

  it("updates section headings", () => {
    const state = reducer(
      initialSettings,
      changeFormHeading({ field: "workExperiences", value: "PROFESSIONAL CAREER" })
    );
    expect(state.formToHeading.workExperiences).toBe("PROFESSIONAL CAREER");
  });

  it("reorders form sections up and down", () => {
    // formsOrder initially: ["workExperiences", "educations", "projects", "skills", "custom"]
    let state = reducer(
      initialSettings,
      changeFormOrder({ form: "educations", type: "up" })
    );
    expect(state.formsOrder[0]).toBe("educations");
    expect(state.formsOrder[1]).toBe("workExperiences");

    // Move back down
    state = reducer(
      state,
      changeFormOrder({ form: "educations", type: "down" })
    );
    expect(state.formsOrder[0]).toBe("workExperiences");
    expect(state.formsOrder[1]).toBe("educations");
  });

  it("toggles bullet points for sections", () => {
    const state = reducer(
      initialSettings,
      changeShowBulletPoints({ field: "projects", value: false })
    );
    expect(state.showBulletPoints.projects).toBe(false);
  });

  it("replaces entire settings state with setSettings", () => {
    const customSettings = {
      ...initialSettings,
      themeColor: "#10b981",
      fontFamily: "Outfit",
    };
    const state = reducer(initialSettings, setSettings(customSettings));
    expect(state.themeColor).toBe("#10b981");
    expect(state.fontFamily).toBe("Outfit");
  });
});
