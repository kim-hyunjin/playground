import React from "react";

import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Greeting from "../components/Greeting";

/**
 *  msw 목업 서버 설정
 */
const mockServer = setupServer(
  rest.get("/greeting", (req, res, ctx) => {
    return res(ctx.json({ greeting: "hello there" }));
  })
);
beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

test("loads and displays greetings", async () => {
  // Arrange
  render(<Greeting url="/greeting" />); // React element into the DOM.

  // ACT
  fireEvent.click(screen.getByText("Load Greeting")); // fire button click event

  await screen.findByRole("heading"); // find h1 tag

  // Assert
  expect(screen.getByRole("heading")).toHaveTextContent("hello there");
  expect(screen.getByRole("button")).toBeDisabled();
});
