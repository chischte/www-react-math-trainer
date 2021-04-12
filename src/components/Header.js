import React, { useContext, useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../components/firebase/Auth";

export default function Header() {
  const authContext = useContext(AuthContext);
  const [userName, setUserName] = useState();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState();
  const [mode, setMode] = useState();

  // Get user auth info:
  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserName(authContext.currentUser.displayName);
      setUserIsLoggedIn(true);
    } else {
      setUserName("guest");
      setUserIsLoggedIn(false);
    }
  }, [authContext]);

  // Get url location to hide irrelevant links:
  // Currently not in use because does not look as cool as inteded
  const getModeFromUrl = useCallback(() => {
    var currentUrl = window.location.href;
    if (currentUrl.includes("training")) {
      setMode("training");
    } else if (currentUrl.includes("competition")) {
      setMode("competition");
    } else if (currentUrl.includes("highscore")) {
      setMode("training");
    }
  }, []);

  useEffect(() => {
    getModeFromUrl();
  }, [getModeFromUrl]);

  return (
        <div className="header_outliner">
      <br></br>
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
