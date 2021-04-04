import React from "react";
import { NavLink } from "react-router-dom";

export default class Header extends React.Component {
  state = {};

  componentDidMount() {}

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
        <NavLink to="/training_select"
        className="header_link"
        activeClassName="is-active"
        
        >training</NavLink>
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

        <NavLink
          to="/account"
          className="header_link"
          activeClassName="is-active"
        >
          account
        </NavLink>
      </div>
    );
  }
}
