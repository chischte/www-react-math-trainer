import React, { useState, useContext, useEffect } from "react";
import firebaseInitializeApp from "../components/firebase/firebase";
import "firebase/auth";
import TextField from "@material-ui/core/TextField";
import { Button, Box } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../components/firebase/Auth";

export default function LoginPage() {
  const authContext = useContext(AuthContext);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState();

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserIsLoggedIn(true);
    } else {
      setUserIsLoggedIn(false);
    }
  }, [authContext]);

  const handleLogIn = (event) => {
    event.preventDefault();
    var { email, password } = event.target.elements;
    email = email.value + "@mathe-trainer.oo";
    logInExistingUser(email, password.value);
  };

  const logInExistingUser = async (email, password) => {
    try {
      await firebaseInitializeApp
        .auth()
        .signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error);
    }
  };
 
  return (
    <div>
      <Header />
      <div className="outliner">
        <ThemeProvider theme={theme}>
          {!userIsLoggedIn && (
            <div>
              <form onSubmit={handleLogIn}>
                <Box m={0} pt={1}>
                  <TextField
                    name="email"
                    fullWidth
                    id="outlined-basic"
                    label="nickname"
                    variant="outlined"
                  />
                </Box>
                <Box m={0} pt={1}>
                  <TextField
                    name="password"
                    type="password"
                    fullWidth
                    id="outlined-basic"
                    label="password"
                    variant="outlined"
                  />
                </Box>
                <Box m={0} pt={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    ANMELDEN
                  </Button>
                </Box>
              </form>
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
