import React, { useEffect, useCallback, useState, useRef } from "react";
import firebase from "firebase";
import firebaseInitializeApp from "../firebase/firebase"; // required for isolated jest testing

//#region HEADER ---------------------------------------------------------------
/**
 * -----------------------------------------------------------------------------
 * EACH DatabaseProvider CAN PROVIDE A PARENT COMPONENT WITH 1 READ
 * AND 1 UPDATE POSSIBILITY FOR ONE REFERENCE PATH.
 * IF A SECOND DATABASE LOCATION SHOULD BE USED SIMULTANOUSLY, A
 * SECOND DatabaseProvider HAS TO BE IMPLEMENTED IN THE PARENT COMPONENT.
 *
 *
 * IMPLEMENTATION EXAMPLE IN PARENT COMPONENT:
 *   .....
 *   // Get DB connection after changed uid:
 *   useEffect(() => {
 *     if (userUid) {
 *       setUserGroupsDbPath("/users/" + userUid);
 *     }
 *   }, [userUid]);
 *   .....
 *   // Props function for the dbProvider:
 *   const getDbUserData = (dbProviderData) => {
 *     setDbUserData(dbProviderData);
 *   };
 *   .....
 *   return (
 *     <DatabaseProvider //-----------------------> example in CreateGroupPage
 *       dbPath={userGroupsDbPath} //-------------> required, db path
 *       updateParentFunction={getDbUserData} //--> optional, funtion to receive data in parent
 *       addDbListener={true} //------------------> optional, default false
 *       updateDbData={dbUpdateEntry} //----------> optional, useState hook to write data to db
 *       getErrorMessage={(error)=>{}} //---------> optional, get error in parent
 *      />
 *   )
 *   .....
 * -----------------------------------------------------------------------------
 */
//#endregion

export default function DatabaseProvider(props) {
  //#region USE STATE HOOKS ----------------------------------------------------
  const [errorMessage, setErrorMessage] = useState();
  // LISTEN TO DB DATA:
  const [dbPath, setDbPath] = useState();
  const [receivedDataFromDb, setReceivedDataFromDb] = useState();
  const [addDbListener, setAddDbListener] = useState(false);
  // UPDATE DB:
  const [updateDbData, setUpdateDbData] = useState();
  //#endregion

  //#region MONITOR PROPS ------------------------------------------------------

  // Function to update the parent component:
  const updateParentFunction = props.updateParentFunction;

  // Get props:
  useEffect(() => {
    setDbPath(props.dbPath); // triggers a db query
    setUpdateDbData(props.updateDbData); // data to write to db
    if (props.addDbListener) {
      setAddDbListener(props.addDbListener); // default false
    }
  }, [props]);
  //#endregion

  //#region PROCESS ERROR MESSAGES -------------------------------------------

  // const processError = props.getErrorMessage;
  const processError = useCallback((e) => {
    console.log(e);
    setErrorMessage(e);
  }, []);

  const submitErrorMessage = props.getErrorMessage;

  useEffect(() => {
    if (errorMessage) {
      if (submitErrorMessage) {
        submitErrorMessage(errorMessage);
      } else {
        console.log(errorMessage);
        console.log("error not forwarded to parent");
      }
    }
  }, [errorMessage, submitErrorMessage]);

  //#endregion

  //#region PROCESS DATABASE SNAPSHOT ------------------------------------------

  const processSnapshot = useCallback(
    (snapshot) => {
      try {
        if (snapshot) {
          setReceivedDataFromDb(snapshot.val());
        }
      } catch (e) {
        processError(e);
      }
    },
    [processError]
  );

  //#endregion

  //#region GET DATA ONCE ----------------------------------------------------

  const getDataOnce = useCallback(() => {
    let ref = firebase.database().ref(dbPath);
    ref
      .once("value", (snapshot) => {
        console.log("get data from db helper once");
        processSnapshot(snapshot);
      })
      .catch((e) => {
        processError(e);
      });
  }, [dbPath, processError, processSnapshot]);

  useEffect(() => {
    if (dbPath && addDbListener === false) {
      getDataOnce();
    }
  }, [dbPath, addDbListener, getDataOnce]);

  //#endregion

  //#region GET DATA CONTINUOUSLY --------------------------------------------

  const previousDbPath = useRef();

  // Access has to be checked with "ref.once", because there is no
  // possibility to catch a "permission denied" error using "ref.on"
  const checkIfAccessIsPermitted = useCallback(
    (ref) => {
      ref
        .once("value", () => {})
        .catch((e) => {
          processError(e);
        });
    },
    [processError]
  );

  const getDataContinuous = useCallback(() => {
    // Detach previous listener:
    if (previousDbPath.current) {
      firebase.database().ref(previousDbPath.current).off();
    }
    // Define new path:
    let ref = firebase.database().ref(dbPath);
    checkIfAccessIsPermitted(ref);

    // Get data and add new listener:
    ref.on("value", (snapshot) => {
      console.log("get data from db helper continuously");
      processSnapshot(snapshot);
    });
    // Store new dbPath as ref:
    previousDbPath.current = dbPath;
    // }
  }, [dbPath, processSnapshot, checkIfAccessIsPermitted]);

  useEffect(() => {
    if (dbPath && addDbListener === true) {
      getDataContinuous();
    }
  }, [dbPath, addDbListener, getDataContinuous]);

  //#endregion

  //#region SEND UPDATED DATA TO PARENT --------------------------------------

  // Use a reference to compare if DB Data changed
  const previousDataFromDb = useRef();

  useEffect(() => {
    if (receivedDataFromDb && receivedDataFromDb !== previousDataFromDb.current) {
      if (updateParentFunction) {
        updateParentFunction(receivedDataFromDb);
      } else {
        console.log("no function defined to send data to parent function");
      }
      previousDataFromDb.current = receivedDataFromDb;
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
      .catch(function (e) {
        processError(e);
      });
  }, [dbPath, updateDbData, processError]);

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
    }, 200); // prevents an eternal loop of updating hooks
    return () => clearTimeout(timer);
  }, [dbPath, updateDbData, updateDbEntry]);
  //#endregion

  return <React.Fragment></React.Fragment>;
}
