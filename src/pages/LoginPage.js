import React from "react";
import firebaseInitializeApp from "../components/firebase/firebase";
import * as firebase from "firebase/app";
import "firebase/auth";
import TextField from "@material-ui/core/TextField";
import { Button, Box } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userEmail: "",
      userName: "",
      userPassword: "",
      userGender: "undefined",
      databaseSnapshot: "",
      emailEntered: "",
      emailIsInDatabase: "",
      loginFailed: "",
      userIsLoggedIn: "",
    };
  }

  componentDidMount() {
    if (!!firebase.auth().currentUser) {
      const user = firebase.auth().currentUser;
      this.setState({ userName: user.displayName });
      this.setState({ userIsLoggedIn: !!firebase.auth().currentUser });
    }
  }
  componentDidUpdate() {}

  handleLogIn = (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    this.setState(
      { userEmail: email.value, userPassword: password.value },
      () => {}
    );

    this.logInExistingUserAsync(email.value, password.value);
  };

  async logInExistingUserAsync(email, password) {
    try {
      await firebaseInitializeApp
        .auth()
        .signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error);
      this.setState({ loginFailed: true });
    } finally {
      if (!!firebase.auth().currentUser) {
        this.setState({ userIsLoggedIn: !!firebase.auth().currentUser });
        this.setState({ userName: firebase.auth().currentUser.displayName });
      }
    }
  }
  handleSwitchToSignup = () => {
    this.props.history.push("/signup");
  };

  render() {
    return (
      <div>
        <Header />
        <div className="outliner">
          <ThemeProvider theme={theme}>
            {!this.state.userIsLoggedIn && (
              <div>
                <form onSubmit={this.handleLogIn}>
                  <Box m={0} pt={1}>
                    <TextField
                      name="email"
                      fullWidth
                      id="outlined-basic"
                      label="email"
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
                      Log In
                    </Button>
                  </Box>
                </form>
                <h5> OR</h5>
                <Box m={0} pt={1}>
                  <Button
                    onClick={this.handleSwitchToSignup}
                    variant="contained"
                    color="secondary"
                    fullWidth
                  >
                    Create A New Account
                  </Button>
                </Box>
              </div>
            )}
          </ThemeProvider>
          {this.state.userIsLoggedIn && (
            <div>
              <Redirect to="/" />
            </div>
          )}
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
