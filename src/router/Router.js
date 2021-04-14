import React from "react";
import Homepage from "../pages/Homepage";
import TrainingRunPage from "../pages/TrainingRunPage";
import TrainingSelectPage from "../pages/TrainingSelectPage";
import TrainingPointPage from "../pages/TrainingPointPage";
import TrainingDashPage from "../pages/TrainingDashPage";
import CompetitionPage from "../pages/CompetitionPage";
import HighscorePage from "../pages/HighscorePage";
import LoginPage from "../pages/LoginPage";
import LoginSelectPage from "../pages/LoginSelectPage";
import SignupPage from "../pages/SignupPage";
import AccountPage from "../pages/AccountPage";
import CreateGroupPage from "../pages/CreateGroupPage";
import ManageGroupsPage from "../pages/ManageGroupsPage";
import JoinGroupPage from "../pages/JoinGroupPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AuthProvider } from "../components/firebase/Auth";

const Router = () => (
  <AuthProvider>
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
        <Route path="/highscore" exact={true} component={HighscorePage} />)
        <Route path="/login_select_page" exact={true} component={LoginSelectPage} />)
        <Route path="/login" exact={true} component={LoginPage} />)
        <Route path="/signup" exact={true} component={SignupPage} />)
        <Route path="/creategroup" exact={true} component={CreateGroupPage} />
        <Route path="/joingroup" exact={true} component={JoinGroupPage} />
        <Route path="/managegroups" exact={true} component={ManageGroupsPage} />
        <Route path="/account" exact={true} component={AccountPage} />
        <Route path="/" exact={true} component={Homepage} />)
      </Switch>
    </BrowserRouter>
  </AuthProvider>
);

export default Router;
