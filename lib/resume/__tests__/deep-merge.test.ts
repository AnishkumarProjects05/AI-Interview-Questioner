import { deepMerge } from "@/lib/resume/deep-merge";

describe("deepMerge", () => {
  test("should merge simple, non-overlapping properties", () => {
    const target = { a: 1 };
    const source = { b: 2 };
    
    const result = deepMerge(target, source);
    
    expect(result).toEqual({ a: 1, b: 2 });
  });

  test("should overwrite properties present in target with source", () => {
    const target = { a: 1, b: 2 };
    const source = { b: 99 };
    
    const result = deepMerge(target, source);
    
    expect(result).toEqual({ a: 1, b: 99 });
  });

  test("should perform deep recursive merge on nested objects", () => {
    const target = {
      user: {
        name: "Alice",
        settings: {
          theme: "light",
          notifications: true
        }
      }
    };
    const source = {
      user: {
        settings: {
          theme: "dark"
        },
        age: 25
      }
    };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      user: {
        name: "Alice",
        age: 25,
        settings: {
          theme: "dark",
          notifications: true
        }
      }
    });
  });

  test("should return a new object copy instead of mutating the target", () => {
    const target = { a: 1 };
    const source = { b: 2 };

    const result = deepMerge(target, source);

    expect(result).not.toBe(target); // Checking that reference changed
    expect(target).toEqual({ a: 1 }); // Target is untouched
  });
});
