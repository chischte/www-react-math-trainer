import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import ShowSpeed from "./ShowSpeed";

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
    render(<ShowSpeed currentSpeed="48" calculationsSolved="78" />, container);
  });
  expect(container.textContent).toBe("speed: 48 cpmcount: 78");
});