import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../components/firebase/Auth";

function Header() {
  const authContext = useContext(AuthContext);
  const [userName, setUserName] = useState();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState();

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserName(authContext.currentUser.displayName);
      setUserIsLoggedIn(true);
    } else {
      setUserName("guest");
      setUserIsLoggedIn(false);
    }
  }, [authContext]);

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

      {userIsLoggedIn ? (
        <NavLink
          to="/account"
          className="header_link"
          activeClassName="is-active"
        >
          {userName}
        </NavLink>
      ) : (
        <NavLink
          to="/login"
          className="header_link"
          activeClassName="is-active"
        >
          anmelden
        </NavLink>
      )}
    </div>
  );
}

export default Header;
