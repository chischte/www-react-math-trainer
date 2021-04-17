import React, { useEffect, useCallback, useState, useRef } from "react";
import firebase from "firebase";
import firebaseInitializeApp from "../firebase/firebase"; // used for jest testing

/**
 * EACH DatabaseProvider CAN PROVIDE A PARENT COMPONENT WITH 1 READ
 * AND 1 UPDATE POSSIBILITY FOR ONE REFERENCE PATH.
 * IF A SECOND DATABASE LOCATION SHOULD BE USED SIMULTANOUSLY, A
 * SECOND DatabaseProvider HAS TO BE IMPLEMENTED IN THE PARENT COMPONENT.
 *
 *
 * IMPLEMENTATION EXAMPLE IN PARENT COMPONENT:
 *      .....
 *      // Get DB connection after changed uid:
 *      useEffect(() => {
 *        if (userUid) {
 *          setUserGroupsDbPath("/users/" + userUid);
 *        }
 *      }, [userUid]);
 *      .....
 *      // Props function for the dbProvider:
 *      const getDbUserData = (dbProviderData) => {
 *        setDbUserData(dbProviderData);
 *      };
 *      .....
 *      return (
 *        <DatabaseProvider
 *          dbPath={userGroupsDbPath}
 *          addDbListener={true}
 *          updateParentFunction={getDbUserData}
 *          updateDbData={dbUpdateEntry} // = useState hook containing data
 *         />
 *      )
 *      .....
 */

export default function DatabaseProvider(props) {
  // Hooks to listen for data in db:
  const [dbPath, setDbPath] = useState();
  const [receivedDataFromDb, setReceivedDataFromDb] = useState();
  const [addDbListener, setAddDbListener] = useState(null);
  // Hooks to update db:
  const [updateDbData, setUpdateDbData] = useState();

  //#region MONITOR PROPS ----------------------------------------------------

  // Function to update the parent component:
  const updateParentFunction = props.updateParentFunction;

  useEffect(() => {
    setDbPath(props.dbPath); // triggers a db query
    setAddDbListener(props.addDbListener); //"true" adds a listener, "false" doesn't
    setUpdateDbData(props.updateDbData); // data to write to db
  }, [props]);
  //#endregion

  //#region GET DATA ONCE ----------------------------------------------------

  const getDataOnce = useCallback(() => {
    let ref = firebase.database().ref(dbPath);
    ref.once("value", (snapshot) => {
      try {
        if (snapshot) {
          console.log("get data from db helper once");
          setReceivedDataFromDb(snapshot.val());
        }
      } catch (e) {
        console.log(e);
      }
    });
  }, [dbPath]);

  useEffect(() => {
    if (dbPath && addDbListener === false) {
      getDataOnce();
    }
  }, [dbPath, addDbListener, getDataOnce]);

  //#endregion

  //#region GET DATA CONTINUOUSLY --------------------------------------------

  const processSnapshot = (snapshot) => {
    try {
      if (snapshot) {
        console.log("get data from db helper continuously");
        setReceivedDataFromDb(snapshot.val());
      }
    } catch (e) {
      console.log(e);
    }
  };

  const previousDbPath = useRef();

  const getDataContinuous = useCallback(() => {
    // Detach previous listeners:
    if (previousDbPath.current) {
      firebase.database().ref(previousDbPath.current).off();
    }
    // Add new listener:
    let ref = firebase.database().ref(dbPath);
    ref.on("value", (snapshot) => processSnapshot(snapshot));

    // Store new dbPath as ref:
    getDataContinuous.current = dbPath;
  }, [dbPath]);

  useEffect(() => {
    if (dbPath && addDbListener === true) {
      getDataContinuous();
    }
  }, [dbPath, addDbListener, getDataContinuous]);

  //#endregion

  //#region SEND UPDATED DATA TO PARENT --------------------------------------

  useEffect(() => {
    if (receivedDataFromDb) {
      updateParentFunction(receivedDataFromDb);
    }
  }, [updateParentFunction, receivedDataFromDb]);
  //#endregion

  //#region UPDATE DATA TO DB ------------------------------------------------

  const updateDbEntry = useCallback(() => {
    console.log("write data to db");
    firebase
      .database()
      .ref(dbPath)
      .update(updateDbData)
      .catch(function (error) {
        console.log(error);
      });
  }, [dbPath, updateDbData]);

  // The timeout in the following useEffect was necessary because
  // if the database update is triggerd by the same stateHooks that read
  // from the database, an eternal render loop can happen.
  // The timeout gives the depending state hook a moment to settle for the
  // current database data, before updating again.

  useEffect(() => {
    const timer = setTimeout(() => {
      if (dbPath && updateDbData) {
        updateDbEntry();
      }
    }, 50); // prevents an eternal loop of updating hooks
    return () => clearTimeout(timer);
  }, [dbPath, updateDbData, updateDbEntry]);
  // The timeout g hooks in o
  //#endregion

  return <React.Fragment></React.Fragment>;
}
