import React, { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../components/firebase/Auth";
import firebaseInitializeApp from "../components/firebase/firebase";
import firebase from "firebase";
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

export default function SignupPage() {
  const authContext = useContext(AuthContext);
  const [userEmail, setUserEmail] = useState();
  const [userName, setUserName] = useState();
  const [userCharacter, setUserCharacter] = useState("jedi");
  const [userPassword, setUserPassword] = useState();
  const [userUid, setUserUid] = useState();
  const [nicknameDatabaseSnapshot, setNicknameDatabaseSnapshot] = useState();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState();

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserIsLoggedIn(true);
      setUserUid(authContext.currentUser.uid);
    } else {
      setUserIsLoggedIn(false);
    }
  }, [authContext]);

  const getNicknameDatabaseSnapshot = () => {
    try {
      let ref = firebase.database().ref("/nicknames/");
      ref.on("value", (snapshot) => {
        let databaseSnapshot = snapshot.val();
        if (!!databaseSnapshot) {
          // Convert object containing objects to an array of objects:
          databaseSnapshot = Object.values(databaseSnapshot);
          setNicknameDatabaseSnapshot(databaseSnapshot);
        }
      });
    } catch (e) {
      alert("db connection failed\r\n" + e);
    }
  };

  useEffect(() => {
    getNicknameDatabaseSnapshot();
  }, []);

  const assignUserCharacter = (event) => {
    setUserCharacter(event.target.value);
  };

  const handleCreateNewUser = (event) => {
    event.preventDefault();
    var { password, name } = event.target.elements;
    name = name.value.trim();

    if (checkIfNicknameIsValid(name)) {
      setUserName(name);
      setUserPassword(password.value);
      setUserEmail(createEmailFromUserName(name));
    }
  };

  const checkIfNicknameIsValid = (name) => {
    let nicknameIsAvailable = true;
    if (name.length > 15) {
      alert(
        "Bitte wähle einen kürzeren Namen.\r\n" +
          "Der Name darf maximal 15 Zeichen lang sein."
      );
      nicknameIsAvailable = false;
    }
    else if (!!nicknameDatabaseSnapshot) {
      if (!!nicknameDatabaseSnapshot.find((x) => x.name === name)) {
        nicknameIsAvailable = false;
        alert(
          "Dieser Nickname ist bereits vergeben, bitte probier es mit einem anderen Namen"
        );
      }
    }
    return nicknameIsAvailable;
  };

  const createEmailFromUserName = (nickName) => {
    var email = nickName + "@mathe-trainer.oo";
    return email;
  };

  const createUserEmailAuth = useCallback(async () => {
    try {
      await firebaseInitializeApp
        .auth()
        .createUserWithEmailAndPassword(userEmail, userPassword);
      alert(
        "WICHTIG! AUFSCHREIBEN!:\r\nDein Nickname ist:" +
          userName +
          "\r\nDein Passwort ist:" +
          userPassword +
          "\r\nOHNE DIESE INFOS IST ES NICHT MÖGLICH,\r\nDICH SPÄTER WIEDER ANZUMELDEN!"
      );
    } catch (error) {
      console.log(error);
      alert(
        "Das erstellen des Accounts hat leider nicht funktioniert!\r\n" +
          "Bitte entferne allfällige Leerschläge oder Sonderzeichen aus deinem Nickname.\r\n" +
          "Erlaubte Sonderzeichen sind: !%&'*+-/=?^_`{|}~"
      );
    } finally {
    }
  }, [userEmail, userName, userPassword]);

  const createUserEntryInDB = useCallback(() => {
    if (userIsLoggedIn) {
      let dbEntry = {
        uid: userUid,
        name: userName,
        character: userCharacter,
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
        .ref("/users/" + userUid)
        .update(dbEntry);
      console.log("created user in database");
    }
  }, [userCharacter, userIsLoggedIn, userName, userUid]);

  const createNicknameEntryDB = useCallback(() => {
    if (!!firebase.auth().currentUser) {
      let dbEntry = {
        name: userName,
      };
      firebase
        .database()
        .ref("/nicknames/" + userName)
        .update(dbEntry);
      console.log("created nickname entry in database");
    }
  }, [userName]);

  // If all data is provided, create user
  useEffect(() => {
    if (userEmail && userPassword && !!userName && !userIsLoggedIn) {
      createUserEmailAuth();
    }
  }, [userEmail, userPassword, userName, createUserEmailAuth, userIsLoggedIn]);

  // If email auth worked, create nickname and user db entryies
  useEffect(() => {
    if (userEmail && userPassword && !!userName && userIsLoggedIn) {
      createNicknameEntryDB();
      createUserEntryInDB();
    }
  }, [
    userEmail,
    userPassword,
    userName,
    createNicknameEntryDB,
    createUserEntryInDB,
    userIsLoggedIn,
  ]);

  const setUserDisplayName = useCallback(() => {
    let user = firebase.auth().currentUser;
    user
      .updateProfile({
        displayName: userName,
      })
      .then(function () {
        console.log("user display name update successful");
      })
      .catch(function (e) {
        console.log(e);
      });
  }, [userName]);

  // If user is logged in, set user display name:
  useEffect(() => {
    if (userIsLoggedIn) {
      setUserDisplayName();
    }
  }, [userIsLoggedIn, setUserDisplayName]);

  return (
    <div>
      <Header />
      {!userIsLoggedIn && (
        <div>
          <div className="outliner">
            <ThemeProvider theme={theme}>
              <div>
                <form onSubmit={handleCreateNewUser}>
                  <Box m={0} pt={1}>
                    <TextField
                      name="name"
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

                  <div>
                    <br></br>
                    <FormControl component="fieldset">
                      <FormLabel component="legend"></FormLabel>
                      <RadioGroup
                        aria-label="character"
                        name="character1"
                        value={userCharacter}
                        onChange={assignUserCharacter}
                      >
                        <FormControlLabel
                          value="jedi"
                          control={<Radio />}
                          label="Ich bin ein Jedi"
                        />
                        <FormControlLabel
                          value="sith"
                          control={<Radio />}
                          label="Ich bin ein Sith"
                        />
                        <FormControlLabel
                          value="unicorn"
                          control={<Radio />}
                          label="Ich bin ein Einhorn"
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
                      Account Erstellen
                    </Button>
                  </Box>
                </form>
              </div>
            </ThemeProvider>
          </div>
        </div>
      )}
      {userIsLoggedIn && (
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
const theme = createMuiTheme({
  typography: {
    fontSize: 20,
  },
});
