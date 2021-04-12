import React, { useEffect, useState,useContext } from "react";
import firebase from "firebase";
import { AuthContext } from "../components/firebase/Auth";

function GroupSelector() {
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState(0);
  const [userGroups, setUserGroups] = useState(0);
  const [favoriteGroup, setFavoriteGroup] = useState({ name: "", code: "" });
  const [dbSnapshot, setDbSnapshot] = useState();

  // get User:
  useEffect(() => {
    if (!!authContext.currentUser) {
      setUser(authContext.currentUser);
    }
  }, [authContext]);

  // get DB connection:
  function getDbConnection(ref) {
    return new Promise((resolve, reject) => {
      const userRef = firebase.database().ref(ref);
      const onError = (error) => reject(error);
      const onData = (snapshot) => resolve(snapshot.val());
      userRef.on("value", onData, onError);
    });
  }

  // wait for DB connection and get snapshot:
  const getDbSnapshot = React.useCallback(async (ref) => {
    try {
      const dbUserData = await getDbConnection(ref);
      setDbSnapshot(dbUserData);
    } catch (e) {
      console.log(e);
    }
  }, []);

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

  // update favorite group in DB:
  useEffect(() => {
    if (dbSnapshot) {
      let dbEntry = {
        favorite_group: favoriteGroup,
      };
      firebase
        .database()
        .ref("/users/" + user.uid)
        .update(dbEntry);
      console.log("update favorite group in user database");
    }
  }, [favoriteGroup, dbSnapshot, user.uid]);

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
