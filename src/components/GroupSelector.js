import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { AuthContext } from "../components/firebase/Auth";
import DatabaseHelper from "../database_helper/databaseHelper";

function GroupSelector() {
  const authContext = useContext(AuthContext);

  const dbHelper = useMemo(() => {
    const _dbHelper = new DatabaseHelper();
    return _dbHelper;
  }, []);

  const [dbSnapshot, setDbSnapshot] = useState();
  const [user, setUser] = useState(0);
  const [userGroups, setUserGroups] = useState(0);
  const [favoriteGroup, setFavoriteGroup] = useState({ name: "", code: "" });

  // get User:
  useEffect(() => {
    if (!!authContext.currentUser) {
      setUser(authContext.currentUser);
    }
  }, [authContext]);

  //#region GET FAVORITE GROUP FROM DB/USERS/USER ------------------------------

  // wait for databesHelper snapshot
  const getDbSnapshot = React.useCallback(async (ref) => {
    try {
      setDbSnapshot(await dbHelper.getDataContinuous(ref));
    } catch (e) {
      console.log(e);
    }
  }, [dbHelper]);

  // get DB connection after changed uid:
  useEffect(() => {
    if (!!user.uid) {
      getDbSnapshot("/users/" + user.uid); // uid michi = "UoVJYc0wIaNUSspmeZBhpGhNgFg2"
    }
  }, [user.uid, getDbSnapshot]);

  // update component with new snapshot:
  useEffect(() => {
    if (dbSnapshot) {
      setUserGroups(dbSnapshot.groups);
      console.log(dbSnapshot.favorite_group);
      setFavoriteGroup(dbSnapshot.favorite_group);
    }
  }, [dbSnapshot]);

  //#endregion

  // update favorite group in DB:
  const updateData = useCallback((data, ref) => { dbHelper.updateData(data, ref) }, [dbHelper])


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
