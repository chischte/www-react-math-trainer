import React, { useState, useContext, useEffect } from "react";
import "firebase/auth";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../components/firebase/Auth";

export default function LoginSelectPage(props) {
  const authContext = useContext(AuthContext);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState();

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserIsLoggedIn(true);
    } else {
      setUserIsLoggedIn(false);
    }
  }, [authContext]);

  const handleSwitchToLogin = (event) => {
    props.history.push("/login");
  };

  const handleSwitchToSignup = () => {
    props.history.push("/signup");
  };

  return (
    <div>
      <Header />
      <div className="acc_outliner">
        {!userIsLoggedIn && (
          <div>
            <button
              className="acc_purple acc_button "
              onClick={handleSwitchToSignup}
            >
              ICH BIN NEU HIER
            </button>

            <form onSubmit={handleSwitchToSignup}></form>
            <h5> ODER</h5>
            <button
              className="acc_red acc_button "
              onClick={handleSwitchToLogin}
            >
              ICH HABE SCHON EINEN ACCOUNT
            </button>
          </div>
        )}
        {userIsLoggedIn && (
          <div>
            <Redirect to="/" />
          </div>
        )}
      </div>
    </div>
  );
}
