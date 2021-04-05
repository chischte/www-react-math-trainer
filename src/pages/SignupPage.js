import React from "react";
import firebaseInitializeApp from "../components/firebase/firebase";
import * as firebase from "firebase/app";
import "firebase/auth";
import TextField from "@material-ui/core/TextField";
import { NavLink } from "react-router-dom";
import {
  Button,
  Box,
  FormLabel,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Header from "../components/Header";

export default class SignupPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userEmail: "",
      userName: "",
      userPassword: "",
      userCharacter: "jedi",
      databaseSnapshot: "",
      userIsLoggedIn: "",
    };
  }

  componentDidMount() {
    if (!!firebase.auth().currentUser) {
      const user = firebase.auth().currentUser;
      this.setState({ userName: user.displayName });
      this.setState({ userIsLoggedIn: !!firebase.auth().currentUser });
    }
    this.getUserDatabaseSnapshot();
  }

  componentDidUpdate() {}

  getUserDatabaseSnapshot = () => {
    let ref = firebase.database().ref("/nicknames/");
    ref.on("value", (snapshot) => {
      let databaseSnapshot = snapshot.val();
      if (!!databaseSnapshot) {
        // Convert object containing objects to an array of objects:
        databaseSnapshot = Object.values(databaseSnapshot);
        this.setState({ databaseSnapshot: databaseSnapshot }, () => {});
      }
    });
  };

  setCharacter = (event) => {
    this.setState({ userCharacter: event.target.value });
  };

  handleCreateNewUser = (event) => {
    event.preventDefault();
    const { email, password, name } = event.target.elements;
    this.setState(
      {
        userName: name.value.trim(),
        userEmail: email.value,
        userPassword: password.value,
      },
      () => {
        this.checkIfNicknameIsAvailable();
      }
    );
  };

  checkIfNicknameIsAvailable = () => {
    let nicknameIsAvailable = true;
    const databaseSnapshot = this.state.databaseSnapshot;
    const databaseSnapshotIsAvailable = !!databaseSnapshot;

    if (databaseSnapshotIsAvailable) {
      if (!!databaseSnapshot.find((x) => x.name === this.state.userName)) {
        nicknameIsAvailable = false;
      }
    }

    if (nicknameIsAvailable) {
      this.createNewUserAsync(this.state.userEmail, this.state.userPassword);
    } else {
      alert("This name is already in use, please choose another name");
    }
  };

  async createNewUserAsync(email, password) {
    try {
      await firebaseInitializeApp
        .auth()
        .createUserWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error);
    } finally {
      if (!!firebase.auth().currentUser) {
        this.createUserInDB();
        this.createNicknameEntryDB();
        this.setUserDisplayName();
        this.setState({ userIsLoggedIn: !!firebase.auth().currentUser });
      }
    }
  }

  setUserDisplayName = () => {
    const name = this.state.userName;
    let user = firebase.auth().currentUser;
    user
      .updateProfile({
        displayName: name,
      })
      .then(function () {
        // Update successful.
      })
      .catch(function (error) {
        // An error happened.
      });
  };

  createUserInDB = () => {
    if (!!firebase.auth().currentUser) {
      let user = firebase.auth().currentUser;
      let uid = user.uid;
      let dbEntry = {
        uid: uid,
        name: this.state.userName,
        character: this.state.userCharacter,
        favorite_group: { name: "public", code: "public" },
        groups: [
          {
            code: "public",
            name: "public",
          },
        ],
      };

      firebase
        .database()
        .ref("/users/" + uid)
        .update(dbEntry);
      console.log("created user in database");
    }
  };

  createNicknameEntryDB = () => {
    if (!!firebase.auth().currentUser) {
      let dbEntry = {
        name: this.state.userName,
      };

      firebase
        .database()
        .ref("/nicknames/"+this.state.userName)
        .update(dbEntry);
    }
  };

  render() {
    return (
      <div>
        <Header />
        {!this.state.userIsLoggedIn && (
          <div>
            <div className="outliner">
              <ThemeProvider theme={theme}>
                <div>
                  <form onSubmit={this.handleCreateNewUser}>
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
                      <TextField
                        name="name"
                        fullWidth
                        id="outlined-basic"
                        label="name"
                        variant="outlined"
                      />
                    </Box>

                    <div>
                      <br></br>
                      <FormControl component="fieldset">
                        <FormLabel component="legend"></FormLabel>
                        <RadioGroup
                          aria-label="character"
                          name="character1"
                          value={this.state.userCharacter}
                          onChange={this.setCharacter}
                        >
                          <FormControlLabel
                            value="jedi"
                            control={<Radio />}
                            label="I'm a Jedi"
                          />
                          <FormControlLabel
                            value="sith"
                            control={<Radio />}
                            label="I'm a Sith"
                          />
                          <FormControlLabel
                            value="unicorn"
                            control={<Radio />}
                            label="I'm a Unicorn"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <Box m={0} pt={1}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                      >
                        Create Account
                      </Button>
                    </Box>
                  </form>
                </div>
              </ThemeProvider>
            </div>
          </div>
        )}
        {this.state.userIsLoggedIn && (
          <div>
            You are logged in
            <br></br>
            <NavLink to="/" activeClassName="is-active" exact={true}>
              start a competition
            </NavLink>
          </div>
        )}
      </div>
    );
  }
}
const theme = createMuiTheme({
  typography: {
    fontSize: 20,
  },
});
