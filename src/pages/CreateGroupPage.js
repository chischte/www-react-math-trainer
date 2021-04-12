import React, { useState, useContext, useEffect, useCallback } from "react";
import firebase from "firebase";
import { AuthContext } from "../components/firebase/Auth";
import "firebase/auth";
import TextField from "@material-ui/core/TextField";
import { Button, Box } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Header from "../components/Header";

var generator = require("generate-password"); //www.npmjs.com/package/generate-password

export default function CreateGroupPage() {
  const authContext = useContext(AuthContext);
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [groupCreated, setGroupCreated] = useState(false);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState("");
  const [userName, setUserName] = useState();
  const [uid, setUid] = useState();
  const [userGroups, setUserGroups] = useState();
  const [groupsDbSnapshot, setGroupsDbSnapshot] = useState();

  //#region GET USER AUTH INFO

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserName(authContext.currentUser.displayName);
      setUid(authContext.currentUser.uid);
      setUserIsLoggedIn(true);
      getUserGroupsDB();
    } else {
      setUserName("guest");
      setUserIsLoggedIn(false);
    }
  }, [authContext]);

  //#endregion

  //#region CREATE A UNIQUE PASSWORD -------------------------------------------

  const generatePassword = () => {
    const password = generator.generate({
      length: 5,
      symbols: false,
      numbers: true,
      uppercase: false,
      lowercase: true,
      excludeSimilarCharacters: true,
      exclude: "bil10o8B3Evu![]{},.-_öäü'´^§°¦ç",
      strict: true,
    });
    return password;
  };

  const getUniquePassword = useCallback(() => {
    let groupCode = generatePassword();
    let ref = firebase.database().ref("/groups/" + groupCode + "/highscore/");
    ref.on("value", (snapshot) => {
      const dbUserData = snapshot.val();
      if (!!dbUserData) {
        // groupCode exists already, get new code:
        getUniquePassword();
      } else {
        setGroupCode(groupCode);
      }
    });
  }, []);

  useEffect(() => {
    getUniquePassword();
  }, [getUniquePassword]);

  //#endregion

  //#region GET USER GROUPS FROM DB/USERS/USER ---------------------------------

  const getUserGroupsDB = () => {
    const user = firebase.auth().currentUser;
    const uid = user.uid;

    let ref = firebase.database().ref("/users/" + uid);
    ref.on("value", (snapshot) => {
      const dbUserData = snapshot.val();
      if (!!dbUserData.groups) {
        setUserGroups(dbUserData.groups);
      }
    });
  };

  useEffect(() => {
    getUserGroupsDB();
  }, []);
  //#endregion

  //#region UPDATE DB/USER AND DB/GROUPS WITH NEW GROUP ------------------------

  const createGroupInDB = useCallback(() => {
    if (!!firebase.auth().currentUser) {
      let user = firebase.auth().currentUser;
      let uid = user.uid;
      let dbEntry = {
        group_name: groupName,
        creator: userName,
        date: new Date(),
      };

      firebase
        .database()
        .ref("/groups/" + groupCode + "/group_info/" + uid)
        .update(dbEntry);
      console.log("created group in database");
    }
  }, [groupCode, groupName, userName]);

  const updateUserGroupsDB = useCallback(() => {
    if (userIsLoggedIn) {
      let newGroupObject = { name: groupName, code: groupCode };
      let arrayOfGroupObjects = userGroups;
      arrayOfGroupObjects.push(newGroupObject);
      console.log(arrayOfGroupObjects);
      let dbEntry = {
        groups: arrayOfGroupObjects,
      };
      firebase
        .database()
        .ref("/users/" + uid)
        .update(dbEntry);
      console.log("update group in user database");

      // Update favorite group:
      dbEntry = {
        favorite_group: { name: groupName, code: groupCode },
      };
      firebase
        .database()
        .ref("/users/" + uid)
        .update(dbEntry);
      console.log("update favorite group in user database");
    }
  }, [groupCode, groupName, uid, userGroups, userIsLoggedIn]);

  useEffect(() => {
    if (!!groupName & !!groupCode & !groupCreated) {
      setGroupCreated(true);
      createGroupInDB();
      updateUserGroupsDB();
    }
  }, [createGroupInDB, updateUserGroupsDB, groupCreated, groupName, groupCode]);

  //#endregion

  
  const handleCreateGroup = (event) => {
    event.preventDefault();
    const { groupName } = event.target.elements;
    setGroupName(groupName.value);
  };

  return (
    <div>
      <Header />
      {!groupCreated && (
        <div>
          <br></br>
          <div className="infotext">ERSTELLE EINE GRUPPE</div>
          <div className="outliner">
            <ThemeProvider theme={theme}>
              <div>
                <form onSubmit={handleCreateGroup}>
                  <Box m={0} pt={1}>
                    <TextField
                      name="groupName"
                      fullWidth
                      id="outlined-basic"
                      label="Gruppenname"
                      variant="outlined"
                    />
                  </Box>

                  <Box m={0} pt={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      fullWidth
                    >
                      Gruppe erstellen
                    </Button>
                  </Box>
                </form>
              </div>
            </ThemeProvider>
          </div>
        </div>
      )}
      {!!groupCreated && (
        <div className="outliner_wide">
          <div className="infotext">
            <br></br>
            Du hast die Gruppe <span className="it-blue">{groupName}</span>{" "}
            erstellt.
            <br></br>
            Mit dem Gruppencode <span className="it-blue">
              {groupCode}
            </span>{" "}
            können andere Benutzer der Gruppe beitreten.
          </div>
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
