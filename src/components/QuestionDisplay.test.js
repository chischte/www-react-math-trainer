import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import QuestionDisplay from "./QuestionDisplay";

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

it("question display shows text from props", () => {
   act(() => {
    render(<QuestionDisplay questionString="1x1" />, container);
  });
  expect(container.textContent).toBe("1x1");
});