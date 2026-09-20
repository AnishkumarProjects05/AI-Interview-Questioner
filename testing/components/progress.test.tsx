import React from "react";
import { render } from "@testing-library/react";
import { Progress } from "@/components/ui/progress";

describe("Progress component", () => {
  it("renders with progress root and indicator data slots", () => {
    const { container } = render(<Progress value={40} />);
    const root = container.querySelector('[data-slot="progress"]');
    const indicator = container.querySelector('[data-slot="progress-indicator"]');

    expect(root).toBeInTheDocument();
    expect(indicator).toBeInTheDocument();
  });

  it("calculates correct translateX style for given progress value", () => {
    const { container, rerender } = render(<Progress value={75} />);
    let indicator = container.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toHaveStyle({ transform: "translateX(-25%)" });

    rerender(<Progress value={100} />);
    indicator = container.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toHaveStyle({ transform: "translateX(-0%)" });
  });

  it("falls back to 0% when value is undefined", () => {
    const { container } = render(<Progress />);
    const indicator = container.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toHaveStyle({ transform: "translateX(-100%)" });
  });

  it("applies custom classes to root container", () => {
    const { container } = render(<Progress value={50} className="w-64" />);
    const root = container.querySelector('[data-slot="progress"]');
    expect(root).toHaveClass("w-64");
  });
});
