import React, { useEffect, useState, useContext } from "react";
import firebase from "firebase";
import "firebase/auth";
import Header from "../components/Header";
import { AuthContext } from "../components/firebase/Auth";

export default function ManageGroupsPage() {
  const authContext = useContext(AuthContext);
  const [userName, setUserName] = useState();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState();
  const [userGroups, setUserGroups] = useState();
  const [favoriteGroup, setFavoriteGroup] = useState();

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserName(authContext.currentUser.displayName);
      setUserIsLoggedIn(true);
      getUserGroupsDB();
    } else {
      setUserName("guest");
      setUserIsLoggedIn(false);
    }
  }, [authContext]);


  function getUserGroupsDB() {
    const user = firebase.auth().currentUser;
    const uid = user.uid;

    let ref = firebase.database().ref("/users/" + uid);
    ref.once("value", (snapshot) => {
      const dbUserData = snapshot.val();
      console.log(dbUserData);
      if (!!dbUserData.groups) {
        setUserGroups(dbUserData.groups);
      }
      if (!!dbUserData.favorite_group) {
        setFavoriteGroup(dbUserData.favorite_group);
      }
    });
  }

  return (
    <div>
      <Header
        userIsLoggedIn={userIsLoggedIn}
        userName={userName}
      />

      <div>
        <div className="group-selector">
          <br></br>
          {!!userGroups & !!favoriteGroup
            ?
            <div className="ooutliner outliner-flex">
              <table className="groups-table">
                <thead>
                  <tr>
                    <th className="groups_title-header " colSpan={2}>MEINE GRUPPEN</th>
                  </tr>
                  <tr>
                    <td className="groups_bold-field">GRUPPEN NAME</td>
                    <td className="groups_bold-field">GRUPPENCODE</td>
                  </tr>
                </thead>
                <tbody>
                  {userGroups.map((group) => (
                    <tr key={group.code}>

                      <td>{group.name}</td>
                      <td> {group.code}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            :
            <div></div>}
        </div>
      </div>


    </div>
  );

}
