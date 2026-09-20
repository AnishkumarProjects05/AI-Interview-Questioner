import { deepClone } from "@/lib/resume/deep-clone";

describe("deepClone utility", () => {
  it("clones a simple flat object without mutating the original", () => {
    const original = { name: "Alice", score: 100 };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);

    cloned.name = "Bob";
    expect(original.name).toBe("Alice");
  });

  it("deeply clones nested objects and arrays", () => {
    const original = {
      user: {
        profile: {
          bio: "Software Engineer",
          skills: ["TypeScript", "React"],
        },
      },
    };

    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned.user).not.toBe(original.user);
    expect(cloned.user.profile.skills).not.toBe(original.user.profile.skills);

    cloned.user.profile.skills.push("Next.js");
    expect(original.user.profile.skills).toHaveLength(2);
    expect(cloned.user.profile.skills).toHaveLength(3);
  });

  it("handles empty objects and arrays", () => {
    expect(deepClone({})).toEqual({});
    expect(deepClone({ list: [] })).toEqual({ list: [] });
  });
});
