import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import ReadySetGo from "./ReadySetGo";

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

var result = false;

const setResult = () => {
  result = true;
};

it("shows speed from props", () => {
  jest.useFakeTimers();
  act(() => {
    render(<ReadySetGo setStageRunning={() => setResult()} />, container);
  });
  jest.advanceTimersByTime(4000);
  expect(result).toBe(true);
});
