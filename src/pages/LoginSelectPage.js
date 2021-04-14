import React, { useState, useContext, useEffect } from "react";
import firebaseInitializeApp from "../components/firebase/firebase";
import "firebase/auth";
import TextField from "@material-ui/core/TextField";
import { Button, Box } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
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
      <div className="outliner">
        <ThemeProvider theme={theme}>
          {!userIsLoggedIn && (
            <div>
              <form onSubmit={handleSwitchToSignup}>
                <Box m={0} pt={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    ICH BIN NEU HIER
                  </Button>
                </Box>
              </form>
              <h5> ODER</h5>
              <Box m={0} pt={1}>
                <Button
                  onClick={handleSwitchToLogin}
                  variant="contained"
                  color="secondary"
                  fullWidth
                >
                  ICH HABE SCHON EINEN ACCOUNT
                </Button>
              </Box>
            </div>
          )}
        </ThemeProvider>
        {userIsLoggedIn && (
          <div>
            <Redirect to="/" />
          </div>
        )}
      </div>
    </div>
  );
}

const theme = createMuiTheme({
  typography: {
    fontSize: 20,
  },
});
