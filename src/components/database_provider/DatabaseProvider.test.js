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

var result = "nope";

it("get nickname data from firebase", async () => {
  act(() => {
    
    render(
      <DatabaseProvider
        dbPath={"/nicknames/"}
        addDbListener={false}
        updateParentFunction={(dbProviderData)=>{result=dbProviderData}}
      />,
      container
    );
  });
  await new Promise((r) => setTimeout(r, 500));
  expect(result).toBe("speed: 48 cpmcount: 78");
});
