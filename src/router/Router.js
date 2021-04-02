import React from "react";
import Homepage from "../pages/Homepage"
import TrainingPage from "../pages/TrainingPage"
import TrainingHomePage from "../pages/TrainingHomePage"
import TrainingMultiplicationPage from "../pages/TrainingMultiplicationPage"
import CompetitionPage from "../pages/CompetitionPage"
import HighScorePage from "../pages/HighScorePage"
import AccountPage from "../pages/AccountPage"
import { BrowserRouter, Route, Switch } from "react-router-dom";

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/training"  component={TrainingPage} />)
            <Route path="/training_multiplication" exact={true} component={TrainingMultiplicationPage} />)
            <Route path="/training_home" exact={true} component={TrainingHomePage} />)
            <Route path="/competition" exact={true} component={CompetitionPage} />)
            <Route path="/highscore" exact={true} component={HighScorePage} />)
            <Route path="/account" exact={true} component={AccountPage} />)
            <Route path="/" exact={true} component={Homepage} />)
      </Switch>
    </BrowserRouter>
);

export default Router;