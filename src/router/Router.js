import React from "react";
import Homepage from "../pages/Homepage";
import TrainingRunPage from "../pages/TrainingRunPage";
import TrainingSelectPage from "../pages/TrainingSelectPage";
import TrainingPointPage from "../pages/TrainingPointPage";
import TrainingDashPage from "../pages/TrainingDashPage";
import CompetitionPage from "../pages/CompetitionPage";
import HighScorePage from "../pages/HighScorePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import AccountPage from "../pages/AccountPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/training_run" component={TrainingRunPage} />)
      <Route path="/training_point_page" component={TrainingPointPage} />)
      <Route path="/training_dash_page" component={TrainingDashPage} />)
      <Route
        path="/training_select"
        exact={true}
        component={TrainingSelectPage}
      />
      )
      <Route path="/competition" exact={true} component={CompetitionPage} />)
      <Route path="/highscore" exact={true} component={HighScorePage} />)
      <Route path="/login" exact={true} component={LoginPage} />)
      <Route path="/signup" exact={true} component={SignupPage} />)
      <Route path="/account" component={AccountPage} />
      <Route path="/" exact={true} component={Homepage} />)
    </Switch>
  </BrowserRouter>
);

export default Router;
