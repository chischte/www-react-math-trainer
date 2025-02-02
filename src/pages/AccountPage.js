import React, { useState, useContext, useEffect } from "react";
import firebaseInitializeApp from "../components/firebase/firebase";
import { Button, Box } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Header from "../components/Header";
import { AuthContext } from "../components/firebase/Auth";
import firebase from "firebase";

export default function AccountPage(props) {
  const authContext = useContext(AuthContext);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState();

  useEffect(() => {
    if (!!firebase.auth().currentUser) {
      setUserIsLoggedIn(true);
    } else {
      setUserIsLoggedIn(false);
    }
  }, [authContext]);

  const handleLogout = () => {
    firebaseInitializeApp.auth().signOut();
    setUserIsLoggedIn(false);
  };

  return (
    <div>
      <Header />
      <div className="outliner">
        {userIsLoggedIn && (
          <div>
            <ThemeProvider theme={theme}>
              <Button
                onClick={() => props.history.push("/joingroup")}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Einer Gruppe Beitreten
              </Button>

              <Box m={0} pt={1}>
                <Button
                  onClick={() => props.history.push("/creategroup")}
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Eine Gruppe erstellen
                </Button>
              </Box>
              <Box m={0} pt={1}>
                <Button
                  onClick={() => props.history.push("/managegroups")}
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  meine Gruppen{" "}
                </Button>
              </Box>
              <Box m={0} pt={1}>
                <Button
                  onClick={handleLogout}
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                >
                  log out{" "}
                </Button>
              </Box>
            </ThemeProvider>
          </div>
        )}
        {!userIsLoggedIn && <h4> logged out </h4>}
      </div>
    </div>
  );
}

const theme = createMuiTheme({
  typography: {
    fontSize: 20,
  },
});
