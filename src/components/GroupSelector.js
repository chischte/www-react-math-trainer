import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/firebase/Auth";
import DatabaseProvider from "./database_provider/DatabaseProvider";

export default function GroupSelector() {
  const authContext = useContext(AuthContext);
  const [userGroups, setUserGroups] = useState(0);
  const [userGroupsDbPath, setUserGroupsDbPath] = useState();
  const [dbUserData, setDbUserData] = useState(0);
  const [userUid, setUserUid] = useState(0);
  const [favoriteGroup, setFavoriteGroup] = useState({ name: "", code: "" });
  const [dbUpdateEntry, setDbUpdateEntry] = useState(false);

  //#region GET USER AUTH INFO -------------------------------------------------
  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserUid(authContext.currentUser.uid);
    }
  }, [authContext]);

  //#endregion

  //#region GET FAVORITE GROUP FROM DB/USERS/USER ------------------------------

  // Get DB connection after changed uid:
  useEffect(() => {
    if (userUid) {
      setUserGroupsDbPath("/users/" + userUid);
    }
  }, [userUid]);

  // Update component with new snapshot:
  useEffect(() => {
    if (dbUserData) {
      setUserGroups(dbUserData.groups);
      setFavoriteGroup(dbUserData.favorite_group);
    }
  }, [dbUserData]);

  // Props function for the db provider:
  const getDbUserData = (dbProviderData) => {
    setDbUserData(dbProviderData);
  };
  //#endregion

  //#region UPDATE FAVORITE GROUP IN DB/USERS/USER -----------------------------

  useEffect(() => {
    if (dbUserData) {
      let dbEntry = {
        favorite_group: favoriteGroup,
      };
      setDbUpdateEntry(dbEntry);
    }
  }, [favoriteGroup, dbUserData, userUid]);
  //#endregion

  return (
    <div className="group-selector">
      <DatabaseProvider
        dbPath={userGroupsDbPath}
        addDbListener={true}
        updateParentFunction={getDbUserData}
        updateDbData={dbUpdateEntry}

      />
      {!!userGroups & !!favoriteGroup ? (
        <div>
          {userGroups.map((group) => (
            <span key={group.code}>
              <button
                className={
                  group.name === favoriteGroup.name
                    ? "group-selector_button group-selector_button_active"
                    : "group-selector_button group-selector_button_inactive"
                }
                onClick={() => {
                  setFavoriteGroup(group);
                }}
              >
                {group.name}
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
