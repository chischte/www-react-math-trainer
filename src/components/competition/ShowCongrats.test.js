import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import ShowCongrats from "./ShowCongrats";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("shows speed from props", () => {
   act(() => {
    render(<ShowCongrats calculationsSolved="55"/>, container);
  });
  expect(container.textContent).toContain("55");
});