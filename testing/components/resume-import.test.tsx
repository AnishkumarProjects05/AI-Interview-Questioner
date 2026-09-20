import React from "react";
import { render, screen } from "@testing-library/react";
import { ResumeImportComponent } from "@/app/resume-import/ResumeImportComponent";
import { getHasUsedAppBefore } from "@/lib/resume/redux/local-storage";

// Mock local-storage module
jest.mock("@/lib/resume/redux/local-storage", () => ({
  getHasUsedAppBefore: jest.fn(),
}));

// Mock child ResumeDropzone component
jest.mock("@/components/resume/ResumeDropzone", () => ({
  ResumeDropzone: ({ className }: { className: string }) => (
    <div data-testid="mock-resume-dropzone" className={className}>
      Dropzone Mock
    </div>
  ),
}));

// Mock Next.js Link
jest.mock("next/link", () => {
  return ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
});

describe("ResumeImportComponent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders new user view when user has NOT used the app before", () => {
    (getHasUsedAppBefore as jest.Mock).mockReturnValue(false);

    render(<ResumeImportComponent />);

    expect(
      screen.getByRole("heading", { name: /import data from an existing resume/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-resume-dropzone")).toBeInTheDocument();
    expect(screen.getByText(/don't have a resume yet\?/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /create from scratch/i })
    ).toHaveAttribute("href", "/resume-builder");
  });

  it("renders returning user view when user HAS used the app before", () => {
    (getHasUsedAppBefore as jest.Mock).mockReturnValue(true);

    render(<ResumeImportComponent />);

    expect(
      screen.getByText(/you have data saved in browser from prior session/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /continue where i left off/i })
    ).toHaveAttribute("href", "/resume-builder");
    expect(
      screen.getByRole("heading", { name: /override data with a new resume/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-resume-dropzone")).toBeInTheDocument();
  });
});
