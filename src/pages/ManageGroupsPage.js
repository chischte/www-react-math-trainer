import React, { useEffect, useState, useContext } from "react";
import Header from "../components/Header";
import DatabaseProvider from "../components/database_provider/DatabaseProvider";
import { AuthContext } from "../components/firebase/Auth";

export default function ManageGroupsPage() {
  const authContext = useContext(AuthContext);

  const [userGroups, setUserGroups] = useState(0);
  const [userGroupsDbPath, setUserGroupsDbPath] = useState();
  const [userUid, setUserUid] = useState();

  //#region GET USER AUTH INFO -------------------------------------------------

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserUid(authContext.currentUser.uid);
    }
  }, [authContext]);

  //#endregion

  //#region GET GROUPS FROM DB/USERS/USER --------------------------------------

  // Set db path:
  useEffect(() => {
    if (userUid) {
      setUserGroupsDbPath("/users/" + userUid + "/groups");
    }
  }, [userUid]);

  // Props function for the db provider:
  const getDbUserData = (dbProviderData) => {
    setUserGroups(dbProviderData);
  };

  //Props function for the db provider:
  const getErrorMessage = (e) => {
    console.log(e);
  };

  //#endregion

  return (
    <div>
      <DatabaseProvider
        dbPath={userGroupsDbPath}
        addDbListener={false}
        updateParentFunction={getDbUserData}
        getErrorMessage={getErrorMessage}
      />
      <Header />
      <div>
        <div className="group-selector">
          <br></br>
          {!!userGroups ? (
            <div className="outliner outliner-flex">
              <table className="groups_table">
                <thead>
                  <tr>
                    <th className="groups_title-header " colSpan={2}>
                      MEINE GRUPPEN
                    </th>
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
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
