import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { describe, expect, test } from "vitest";
import { kebabCaseToTitleCase } from "./helpers";

test("button click flow", () => {
  // render app
  render(<App />);

  //find the button
  const buttonEL = screen.getByRole("button", { name: /blue/i });

  //check initial color
  expect(buttonEL).toHaveClass("medium-violet-red");

  //click the button
  fireEvent.click(buttonEL);

  //check the text after click
  expect(buttonEL).toHaveTextContent(/red/i);

  //check button color
  expect(buttonEL).toHaveClass("midnight-blue");
});


test("checkbox flow", () => {
  render(<App />);

  //find elements
  const buttonElement = screen.getByRole("button", { name: /blue/i });
  const checkboxElement = screen.getByRole("checkbox", { name: /disable button/i });
  //check initial conditions
  expect(buttonElement).toBeEnabled();
  expect(checkboxElement).not.toBeChecked();

  //toggle checkbox on
  fireEvent.click(checkboxElement);

  //verify if button is disabled, checkbox is checked and button is gray
  expect(buttonElement).toHaveClass("gray");
  expect(buttonElement).toBeDisabled();
  expect(checkboxElement).toBeChecked();

  //toggle checkbox off
  fireEvent.click(checkboxElement);

  //check checkbox conditions
  expect(buttonElement).toBeEnabled();
  expect(checkboxElement).not.toBeChecked();
});


describe("kebabCaseToTitleCase", () => {
  test("works for no hyphens", () => {
    expect(kebabCaseToTitleCase("red")).toBe("Red");
  });

  test("works for one hyphens", () => {
    expect(kebabCaseToTitleCase("midnight-blue")).toBe("Midnight Blue");
  });

  test("works for multiple hyphens", () => {
    expect(kebabCaseToTitleCase("medium-violet-red")).toBe("Medium Violet Red");
  });
})