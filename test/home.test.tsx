import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import HomePage from "../app/page";
import { ReactNode } from "react";

vi.mock("@clerk/nextjs", () => {
  //create a mock function to match the one we are getting from clerk

  const mockedFunction = {
    auth: () => new Promise((resolve) => resolve({ userId: "user_2NNEqL2nrIRdJ194ndJqAHwEfxC" })),
    ClerkProvider: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    useUser: () => ({
      isSignedIn: true,
      user: {
        id: "user_2NNEqL2nrIRdJ194ndJqAHwEfxC",
        fullName: "Charles Harris",
      },
    }),
  };

  return mockedFunction;
});

vi.mock("next/font/google", () => {
  return {
    Inter: () => ({ className: "inter" }),
  };
});

test(`Home`, async () => {
  render(await HomePage());
  expect(screen.getByText("Your daily Journal with emotions")).toBeTruthy();
});

//to see how testing would be in nextjs
