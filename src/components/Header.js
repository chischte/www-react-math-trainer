import React from "react";
import { NavLink } from "react-router-dom";
import * as firebase from "firebase/app";

export default class Header extends React.Component {
  state = {};

  componentDidMount() {
    if (!!firebase.auth().currentUser) {
      const user = firebase.auth().currentUser;
      this.setState({ userName: user.displayName });
      this.setState({ userIsLoggedIn: !!firebase.auth().currentUser });
    }
  }

  componentDidUpdate() {}

  render() {
    return (
      <div className="header">
        <NavLink
          to="/"
          exact={true}
          className="header_link"
          activeClassName="is-active"
        >
          home
        </NavLink>
        <span> </span>
        <NavLink
          to="/training_select"
          className="header_link"
          activeClassName="is-active"
        >
          training
        </NavLink>
        <span> </span>

        <NavLink
          to="/competition"
          className="header_link"
          activeClassName="is-active"
        >
          wettkampf
        </NavLink>
        <span> </span>

        <NavLink
          to="/highscore"
          className="header_link"
          activeClassName="is-active"
        >
          highscore
        </NavLink>
        <span> </span>

        {this.state.userIsLoggedIn ? (
          <NavLink
            to="/login"
            className="header_link"
            activeClassName="is-active"
          >
            {this.state.userName}
          </NavLink>
        ) : (
          <NavLink
            to="/account"
            className="header_link"
            activeClassName="is-active"
          >
            anmelden
          </NavLink>
        )}
      </div>
    );
  }
}
