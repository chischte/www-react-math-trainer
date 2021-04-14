import React, { useEffect, useState, useContext } from "react";
import firebase from "firebase";
import "firebase/auth";
import TextField from "@material-ui/core/TextField";
import { Button, Box } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Header from "../components/Header";
import { AuthContext } from "../components/firebase/Auth";

function JoinGroupPage() {
  const [groupName, setGroupName] = useState();
  const [groupsDbSnapshot, setGroupsDbSnapshot] = useState();
  const [userDbSnapshot, setUserDbSnapshot] = useState();
  const [groupCode, setGroupCode] = useState();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState();
  const authContext = useContext(AuthContext);
  const [entryCreated, setEntryCreated] = useState();
  const [userName, setUserName] = useState();
  const [uid, setUid] = useState();

  // Get user data and login state:
  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserName(authContext.currentUser.displayName);
      setUid(authContext.currentUser.uid);
      setUserIsLoggedIn(true);
    } else {
      setUserName("guest");
      setUserIsLoggedIn(false);
    }
  }, [authContext]);

  // Get group code from user input:
  const handleSetGroupCode = (event) => {
    event.preventDefault();
    const { groupCode } = event.target.elements;
    setGroupCode(groupCode.value);
  };

  // Get DB data, generate a promise:
  function getDbConnection(ref) {
    return new Promise((resolve, reject) => {
      const userRef = firebase.database().ref(ref);
      const onError = (error) => reject(error);
      const onData = (snapshot) => resolve(snapshot.val());
      userRef.on("value", onData, onError);
    });
  }

  //#region DB GROUPS FOLDER -----------------------------------------------------
  // Get snapshot from DB groups folder
  // Check if group code is valid
  // Get group name from DB
  // -----------------------------------------------------------------------------

  // wait for DB connection and get snapshot:
  const getDbSnapshotGroups = React.useCallback(async (ref) => {
    try {
      const dbUserData = await getDbConnection(ref);
      if (!!dbUserData) {
        console.log("get snapshot from db/groups/groupcode...")
        console.log(dbUserData);
        setGroupsDbSnapshot(dbUserData);
      } else {
        alert("Dieser Gruppencode ist ungültig!");
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  // Get groups info from DB:
  useEffect(() => {
    if (!!userIsLoggedIn && !!groupCode) {
      getDbSnapshotGroups("/groups/" + groupCode + "/group_info/");
    }
  }, [userIsLoggedIn, getDbSnapshotGroups, groupCode]);

  // Process groupsDbSnapshot:
  useEffect(() => {
    if (!!groupsDbSnapshot) {
      // Convert object containing objects to an array of objects:
      const dbGroupInfo = Object.values(groupsDbSnapshot);
      setGroupName(dbGroupInfo[0].group_name);
    }
  }, [groupsDbSnapshot, userName]);

  //#endregion

  //#region DB USER FOLDER -------------------------------------------------------
  // Check if group is not a duplicate
  // Create Group entry in user folder
  // -----------------------------------------------------------------------------

  // wait for DB connection and get snapshot:
  const getDbSnapshotUser = React.useCallback(async (ref) => {
    try {
      const dbUserData = await getDbConnection(ref);
      if (dbUserData) {
        setUserDbSnapshot(dbUserData);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  // Get user snapshot from DB:
  useEffect(() => {
    if (!!userIsLoggedIn && !!groupCode && !!groupName) {
      getDbSnapshotUser("/users/" + uid); // uid michi = "UoVJYc0wIaNUSspmeZBhpGhNgFg2"
    }
  }, [userIsLoggedIn, getDbSnapshotUser, uid, groupCode, groupName]);

  // Process userDbSnapshot
  useEffect(() => {
    if (userDbSnapshot) {
      let arrayOfGroupObjects = userDbSnapshot.groups;
      let newGroupObject = { name: groupName, code: groupCode };

      let isDuplicate = false;
      for (let i = 0; i < arrayOfGroupObjects.length; i++) {
        if (arrayOfGroupObjects[i].code === newGroupObject.code) {
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) {
        arrayOfGroupObjects.push(newGroupObject);
        let dbEntry = {
          groups: arrayOfGroupObjects,
        };

        // Update group entry:
        firebase
          .database()
          .ref("/users/" + uid)
          .update(dbEntry);
        console.log("update group in user database");

        // Set new group as favorite group:
        firebase
          .database()
          .ref("/users/" + uid)
          .update({
            favorite_group: newGroupObject
          });
        console.log("update favorite group in user database");
      }
      setEntryCreated(true);
    }
  }, [userDbSnapshot, userName, groupCode, groupName, uid]);

  //#endregion

  return (
    <div>
      <Header userIsLoggedIn={userIsLoggedIn} userName={userName} />
      {!entryCreated && (
        <div>
          <div className="user-at-group">Trete einer Gruppe bei</div>
          <div className="outliner">
            <ThemeProvider theme={theme}>
              <div>
                <form onSubmit={handleSetGroupCode}>
                  <Box m={0} pt={1}>
                    <TextField
                      name="groupCode"
                      fullWidth
                      id="outlined-basic"
                      label="Gruppencode"
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
                      Join Group
                    </Button>
                  </Box>
                </form>
              </div>
            </ThemeProvider>
          </div>
        </div>
      )}
      {entryCreated && (
        <div>Du bist jetzt ein Mitglied der Gruppe {groupName}</div>
      )}
    </div>
  );
}
const theme = createMuiTheme({
  typography: {
    fontSize: 20,
  },
});

export default JoinGroupPage;
