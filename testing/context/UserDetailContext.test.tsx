import React, { useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserDetailContext from "@/context/UserDetailContext";

function TestConsumer() {
  const { user, setUser, theme, toggleTheme } = useContext(UserDetailContext);

  return (
    <div>
      <p data-testid="user-email">{user ? user.email : "no-user"}</p>
      <p data-testid="theme-name">{theme}</p>
      <button onClick={() => setUser({ email: "updated@test.com" })}>
        Update User
      </button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

describe("UserDetailContext", () => {
  it("provides safe default fallback values to consumers", () => {
    render(<TestConsumer />);

    expect(screen.getByTestId("user-email")).toHaveTextContent("no-user");
    expect(screen.getByTestId("theme-name")).toHaveTextContent("light");
  });

  it("provides updated context values when wrapped in UserDetailContext.Provider", () => {
    const mockSetUser = jest.fn();
    const mockToggleTheme = jest.fn();

    render(
      <UserDetailContext.Provider
        value={{
          user: { email: "candidate@interview.ai", name: "Candidate One" } as any,
          setUser: mockSetUser,
          theme: "dark",
          toggleTheme: mockToggleTheme,
        }}
      >
        <TestConsumer />
      </UserDetailContext.Provider>
    );

    expect(screen.getByTestId("user-email")).toHaveTextContent(
      "candidate@interview.ai"
    );
    expect(screen.getByTestId("theme-name")).toHaveTextContent("dark");

    fireEvent.click(screen.getByRole("button", { name: /update user/i }));
    expect(mockSetUser).toHaveBeenCalledWith({ email: "updated@test.com" });

    fireEvent.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
