import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import DatabaseProvider from "./DatabaseProvider";

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

var resultAllowedPath;
const dbPathAllowed = "nicknames";

it("get nickname data from firebase", async () => {
  act(() => {
    render(
      <DatabaseProvider
        dbPath={dbPathAllowed}
        addDbListener={false}
        updateParentFunction={(dbProviderData) => {
          resultAllowedPath = dbProviderData.michi.name;
        }}
      />,
      container
    );
  });
  await new Promise((r) => setTimeout(r, 1500));
  expect(resultAllowedPath).toBe("michi");
});

const dbPathPermitted = "user";
var resultBlockedPath = false;

// TestDoes not test if Path exists
it("get no info from path without read rights", async () => {
  act(() => {
    render(
      <DatabaseProvider
        dbPath={dbPathPermitted}
        addDbListener={false}
        updateParentFunction={(dbProviderData) => {
          if (dbProviderData) {
            resultBlockedPath = true;
          }
        }}
      />,
      container
    );
  });
  await new Promise((r) => setTimeout(r, 1500));
  expect(resultBlockedPath).toBe(false);
});
