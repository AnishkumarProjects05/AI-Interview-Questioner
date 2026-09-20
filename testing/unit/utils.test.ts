import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges simple class names together", () => {
    const result = cn("flex", "items-center", "justify-between");
    expect(result).toBe("flex items-center justify-between");
  });

  it("handles conditional class objects correctly", () => {
    const isPrimary = true;
    const isLarge = false;
    const result = cn(
      "btn",
      isPrimary && "btn-primary",
      isLarge && "btn-lg",
      { "shadow-md": true, "opacity-50": false }
    );
    expect(result).toBe("btn btn-primary shadow-md");
  });

  it("resolves Tailwind class conflicts by keeping the latest class (twMerge)", () => {
    const result = cn("p-4", "p-8");
    expect(result).toBe("p-8");

    const colorResult = cn("bg-red-500", "bg-blue-500");
    expect(colorResult).toBe("bg-blue-500");

    const textResult = cn("text-sm", "text-lg");
    expect(textResult).toBe("text-lg");
  });

  it("ignores falsy, null, and undefined values", () => {
    const result = cn("base-class", null, undefined, false, 0 && "ignored", "");
    expect(result).toBe("base-class");
  });

  it("handles nested arrays of class names", () => {
    const result = cn(["font-bold", ["italic", "underline"]], "text-center");
    expect(result).toBe("font-bold italic underline text-center");
  });

  it("returns empty string when no arguments are passed", () => {
    expect(cn()).toBe("");
  });
});
