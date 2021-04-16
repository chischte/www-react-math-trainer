import React, { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../components/firebase/Auth";
import "firebase/auth";
import TextField from "@material-ui/core/TextField";
import { Button, Box } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Header from "../components/Header";
import DatabaseProvider from "../components/database_provider/DatabaseProvider";

var generator = require("generate-password"); //www.npmjs.com/package/generate-password

export default function CreateGroupPage() {
  const authContext = useContext(AuthContext);

  const [dbGroupCodeData, setDbGroupCodeData] = useState();
  const [groupName, setGroupName] = useState();
  const [groupCode, setGroupCode] = useState();
  const [groupCodeDbPath, setGroupCodeDbPath] = useState();

  const [newGroupDbPath, setNewGroupDbPath] = useState();
  const [newGroupDbData, setNewGroupDbData] = useState();

  const [newUserGroupDbPath, setNewUserGroupDbPath] = useState();
  const [newUserGroupDbData, setNewUserGroupDbData] = useState();

  const [groupCreated, setGroupCreated] = useState(false);
  const [userName, setUserName] = useState();
  const [userUid, setUserUid] = useState();
  const [userGroups, setUserGroups] = useState();

  //#region GET USER AUTH INFO

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserName(authContext.currentUser.displayName);
      setUserUid(authContext.currentUser.uid);
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

  // Generate password
  const getUniquePassword = useCallback(() => {
    console.log("get a new group code");
    setGroupCode(generatePassword());
  }, []);

  // Generate new code once at beginning:
  useEffect(() => {
    getUniquePassword();
  }, [getUniquePassword]);

  // Generate new code if code already exists in db:
  useEffect(() => {
    if (dbGroupCodeData) {
      console.log("group code already exists");
      getUniquePassword();
    }
  }, [dbGroupCodeData, getUniquePassword]);

  // Trigger db snapshot:
  useEffect(() => {
    if (groupCode) {
      setGroupCodeDbPath("/groups/" + groupCode + "/highscore/");
    }
  }, [groupCode]);

  // Props function for the db provider:
  const getDbGroupCodeData = (dbProviderData) => {
    setDbGroupCodeData(dbProviderData);
  };

  //#endregion

  //#region GET USER GROUPS FROM DB/USERS/USER ----------------------------------

  // Props function for the dbProvider
  const getDbUserData = (dbProviderData) => {
    try {
      setUserGroups(dbProviderData.groups);
    } catch (error) {
      alert(error);
    }
  };

  //#endregion

  //#region CREATE GROUP IN DB/GROUPS ------------------------

  // Set db path:
  useEffect(() => {
    if (!!groupName & !!groupCode & !groupCreated) {
      setGroupCreated(true);
      setNewGroupDbPath("/groups/" + groupCode + "/group_info/" + userUid);
    }
  }, [groupCode, groupCreated, groupName, userUid]);

  // Create db data:
  useEffect(() => {
    if (!!groupName & !!groupCode) {
      let dbEntry = {
        group_name: groupName,
        creator: userName,
        date: new Date(),
      };
      setNewGroupDbData(dbEntry);
    }
  }, [groupCode, groupCreated, groupName, userName]);

  //#endregion

  //#region UPDATE DB/USER WITH NEW GROUP ------------------------

  // Create db data:
  useEffect(() => {
    if (!!groupName && !!groupCode && userGroups) {
      // Update array of groups
      let newGroupObject = { name: groupName, code: groupCode };
      let arrayOfGroupObjects = userGroups;
      arrayOfGroupObjects.push(newGroupObject);
      console.log(arrayOfGroupObjects);
      let dbEntry = {
        groups: arrayOfGroupObjects,
      };
      console.log("update group in user database");

      // Update favorite group:
      dbEntry += {
        favorite_group: { name: groupName, code: groupCode },
      };
      console.log("update favorite group in user database");
      setNewUserGroupDbData(dbEntry);
    }
  }, [groupCode, groupCreated, groupName, userName, userGroups]);

  // Set db path:
  useEffect(() => {
    if (!!groupName && !!groupCode && userUid) {
      setNewUserGroupDbPath("/users/" + userUid);
    }
  }, [groupCode, groupCreated, groupName, userUid]);

  //#endregion

  const handleCreateGroup = (event) => {
    event.preventDefault();
    const { groupName } = event.target.elements;
    setGroupName(groupName.value);
  };

  return (
    <div>
      <DatabaseProvider
        dbPath={groupCodeDbPath}
        addDbListener={false}
        updateParentFunction={getDbGroupCodeData}
      />
      <DatabaseProvider dbPath={newGroupDbPath} updateDbData={newGroupDbData} />

      <DatabaseProvider
        dbPath={newUserGroupDbPath}
        updateDbData={newUserGroupDbData}
        addDbListener={true}
        updateParentFunction={getDbUserData}
      />
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
