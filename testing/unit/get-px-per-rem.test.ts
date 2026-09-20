import { getPxPerRem } from "@/lib/resume/get-px-per-rem";

describe("getPxPerRem utility", () => {
  const originalGetComputedStyle = window.getComputedStyle;

  afterEach(() => {
    window.getComputedStyle = originalGetComputedStyle;
  });

  it("returns default 16 when body font-size cannot be determined", () => {
    window.getComputedStyle = jest.fn().mockReturnValue({
      "font-size": "",
    } as any);

    expect(getPxPerRem()).toBe(16);
  });

  it("parses numeric pixel values from computed body font-size", () => {
    window.getComputedStyle = jest.fn().mockReturnValue({
      "font-size": "20px",
    } as any);

    expect(getPxPerRem()).toBe(20);
  });

  it("correctly handles decimal font-size values", () => {
    window.getComputedStyle = jest.fn().mockReturnValue({
      "font-size": "14.5px",
    } as any);

    expect(getPxPerRem()).toBe(14.5);
  });
});
