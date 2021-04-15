import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { AuthContext } from "../components/firebase/Auth";
import DatabaseHelper from "../database_helper/databaseHelper";

function GroupSelector() {
  const authContext = useContext(AuthContext);
  const [dbSnapshot, setDbSnapshot] = useState();
  const [user, setUser] = useState(0);
  const [userGroups, setUserGroups] = useState(0);
  const [favoriteGroup, setFavoriteGroup] = useState({ name: "", code: "" });

  const dbHelper = useMemo(() => { return new DatabaseHelper(); }, []);

  //#region GET USER AUTH INFO -------------------------------------------------
  useEffect(() => {
    if (!!authContext.currentUser) {
      setUser(authContext.currentUser);
    }
  }, [authContext]);

  //#endregion

  //#region GET FAVORITE GROUP FROM DB/USERS/USER ------------------------------

  // Get snapshot from DatabaseHelper:
  const getDbSnapshot = React.useCallback(async (ref) => {
    try {
      setDbSnapshot(await dbHelper.getDataContinuous(ref));
    } catch (e) {
      console.log(e);
    }
  }, [dbHelper]);

  useEffect(() => {
    if (!!user.uid) {
      const ref = "/users/" + user.uid
      getDbSnapshot(ref);
    }
  }, [user.uid, getDbSnapshot]);

  // Update component with new snapshot:
  useEffect(() => {
    if (dbSnapshot) {
      setUserGroups(dbSnapshot.groups);
      setFavoriteGroup(dbSnapshot.favorite_group);
    }
  }, [dbSnapshot]);

  //#endregion

  //#region UPDATE FAVORITE GROUP IN DB/USERS/USER -----------------------------

  // Update db using DatabaseHelper:
  const updateData = useCallback((data, ref) => {
    dbHelper.updateData(data, ref)
  }, [dbHelper])

  useEffect(() => {
    if (dbSnapshot) {
      let dbEntry = {
        favorite_group: favoriteGroup,
      };
      const ref = "/users/" + user.uid
      const data = dbEntry;
      updateData(data, ref);
      console.log("update favorite group in user database");
    }
  }, [favoriteGroup, dbSnapshot, user.uid, dbHelper, updateData]);

  //#endregion

  return (
    <div className="group-selector">
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

export default GroupSelector;
