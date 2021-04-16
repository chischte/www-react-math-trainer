import React, { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../components/firebase/Auth";
import TextField from "@material-ui/core/TextField";
import { Button, Box } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Header from "../components/Header";
import DatabaseProvider from "../components/database_provider/DatabaseProvider";

var generator = require("generate-password"); //www.npmjs.com/package/generate-password

export default function CreateGroupPage() {
  const authContext = useContext(AuthContext);

  //#region USE STATE HOOKS ----------------------------------------------------

  const [groupName, setGroupName] = useState();
  const [groupCode, setGroupCode] = useState();

  // CHECK FOR EXISTING ENTRIES:
  const [groupDbPath, setGroupDbPath] = useState();
  const [groupDbData, setGroupDbData] = useState();

  // CREATE NEW ENTRY IN DB/GROUPS:
  const [newGroupDbPath, setNewGroupDbPath] = useState();
  const [newGroupDbData, setNewGroupDbData] = useState();

  // GET EXISTING DATA AND UPDATE NEW DATA TO DB/USERS/USER:
  const [userDbPath, setUserDbPath] = useState();
  const [userDbData, setUserDbData] = useState();
  const [userGroups, setUserGroups] = useState();

  // USER AUTH INFO:
  const [userName, setUserName] = useState();
  const [userUid, setUserUid] = useState();
  const [groupCreated, setGroupCreated] = useState(false);
  //#endregion

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
    if (groupDbData) {
      console.log("group code already exists");
      getUniquePassword();
    }
  }, [groupDbData, getUniquePassword]);

  // Trigger db snapshot:
  useEffect(() => {
    if (groupCode) {
      setGroupDbPath("/groups/" + groupCode + "/highscore/");
    }
  }, [groupCode]);

  // Props function for the db provider:
  const getDbGroupCodeData = (dbProviderData) => {
    setGroupDbData(dbProviderData);
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
    if (groupName && groupCode && !groupCreated) {
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
    if (groupName && groupCode && userGroups) {
      // Update array of groups
      let newGroupObject = { name: groupName, code: groupCode };
      let arrayOfGroupObjects = userGroups;
      arrayOfGroupObjects.push(newGroupObject);
      let dbEntry = {
        groups: arrayOfGroupObjects,
        favorite_group: { name: groupName, code: groupCode },
      };
      console.log("update group in user database");
      console.log("update favorite group in user database");
      setUserDbData(dbEntry);
    }
  }, [groupCode, groupName, userName, userGroups]);

  // Set db path:
  useEffect(() => {
    if (groupName && groupCode && userUid) {
      setUserDbPath("/users/" + userUid);
    }
  }, [groupCode, groupName, userUid]);

  //#endregion

  // Set group created:
  useEffect(() => {
    if (newGroupDbData && userDbData) {
      setGroupCreated(true);
    }
  }, [newGroupDbData, userDbData]);

  const handleCreateGroup = (event) => {
    event.preventDefault();
    const { groupName } = event.target.elements;
    setGroupName(groupName.value);
  };

  return (
    <div>
      <DatabaseProvider
        dbPath={groupDbPath}
        addDbListener={false}
        updateParentFunction={getDbGroupCodeData}
      />
      <DatabaseProvider dbPath={newGroupDbPath} updateDbData={newGroupDbData} />

      <DatabaseProvider
        dbPath={userDbPath}
        updateDbData={userDbData}
        addDbListener={false}
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
