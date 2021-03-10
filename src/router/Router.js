import React from "react";
import Homepage from "../pages/Homepage"
import { BrowserRouter, Route, Switch } from "react-router-dom";

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact={true} component={Homepage} />)
      </Switch>
    </BrowserRouter>
);

export default Router;