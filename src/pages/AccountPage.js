import React from "react";
import firebase from "firebase";
import firebaseInitializeApp from "../components/firebase/firebase";
import { Button, Box } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Header from "../components/Header";

export default class AccountPage extends React.Component {
  state = {
    userIsLoggedIn: !!firebase.auth().currentUser,
  };

  componentDidMount() {
    if (!!firebase.auth().currentUser) {
      const user = firebase.auth().currentUser;
      this.setState({ userName: user.displayName });
      this.setState({ userIsLoggedIn: !!firebase.auth().currentUser });
    }
  }

  handleLogout = () => {
    firebaseInitializeApp.auth().signOut();
    this.setState({ userIsLoggedIn: false });
  };

  render() {
    return (
      <div>
        <Header />
        <div className="outliner">
          {this.state.userIsLoggedIn && (
            <div>
              <ThemeProvider theme={theme}>
                <Button
                  onClick={() => this.props.history.push("/joingroup")}
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  join a group{" "}
                </Button>

                <Box m={0} pt={1}>
                  <Button
                    onClick={() => this.props.history.push("/creategroup")}
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    create a group{" "}
                  </Button>
                </Box>
                <Box m={0} pt={1}>
                  <Button
                    onClick={() => this.props.history.push("/managegroups")}
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    manage groups{" "}
                  </Button>
                </Box>
                <Box m={0} pt={1}>
                  <Button
                    onClick={this.handleLogout}
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
          {!this.state.userIsLoggedIn && <h4> logged out </h4>}
        </div>
      </div>
    );
  }
}

const theme = createMuiTheme({
  typography: {
    fontSize: 20,
  },
});
