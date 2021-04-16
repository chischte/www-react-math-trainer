import React, { useEffect, useCallback, useState } from "react";
import firebase from "firebase";

/**
 * EACH DatabaseProvider CAN PROVIDE A PARENT COMPONENT WITH 1 READ
 * AND 1 UPDATE POSSIBILITY FOR ONE REFERENCE PATH.
 * IF A SECOND DATABASE LOCATION SHOULD BE USED SIMULTANOUSLY, A
 * SECOND DatabaseProvider HAS TO BE IMPLEMENTED IN THE PARENT COMPONENT.
 */

export default function DatabaseProvider(props) {
  
    // Hooks to listen for data in db:
  const [onceRef, setOnceRef] = useState();
  const [continuousRef, setContinuousRef] = useState();
  const [receivedDataFromDb, setReceivedDataFromDb] = useState();
  
  // Hooks to update db:
  const [updateRef, setUpdateRef] = useState();
  const [newDataForDb, setNewDataForDb] = useState();

  //#region MONITOR PROPS ----------------------------------------------------

  // Function to update the parent component:
  const updateParentFunction = props.updateFunction;

  useEffect(() => {
    setContinuousRef(props.continuousRef); // triggers a db query once
    setOnceRef(props.onceRef); // triggers a db query that updates on changes
    setUpdateRef(props.updateRef); // defines where to write to in db
    setNewDataForDb(props.updateData); // data to write to db
  }, [props]);
  //#endregion

  //#region GET DATA ONCE ----------------------------------------------------

  const getDataOnce = useCallback(() => {
    let ref = firebase.database().ref(onceRef);
    ref.once("value", (snapshot) => {
      try {
        if (snapshot) {
          console.log("get data from db helper");
          setReceivedDataFromDb(snapshot.val());
        }
      } catch (e) {
        console.log(e);
      }
    });
  }, [onceRef]);
  
  useEffect(() => {
    if (onceRef) {
      getDataOnce();
    }
  }, [onceRef, getDataOnce]);

  //#endregion

  //#region GET DATA CONTINUOUSLY --------------------------------------------

  const getDataContinuous = useCallback(() => {
    let ref = firebase.database().ref(continuousRef);
    ref.on("value", (snapshot) => {
      try {
        if (snapshot) {
          console.log("get data from db helper");
          setReceivedDataFromDb(snapshot.val());
        }
      } catch (e) {
        console.log(e);
      }
    });
  }, [continuousRef]);

  useEffect(() => {
    if (continuousRef) {
      getDataContinuous();
    }
  }, [continuousRef, getDataContinuous]);

  //#endregion

  //#region SEND UPDATED DATA TO PARENT --------------------------------------

  useEffect(() => {
    if (receivedDataFromDb) {
      updateParentFunction(receivedDataFromDb);
    }
  }, [updateParentFunction, receivedDataFromDb]);
  //#endregion

  //#region UPDATE DATA TO DB ------------------------------------------------

  const updateDbEntry = useCallback((updateRef, data) => {
    console.log("write data to db");
    console.log(data.favorite_group.name);
    firebase
      .database()
      .ref(updateRef)
      .update(data)
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  // The timeout in the following useEffect was necessary because
  // if the database update is triggerd by the same stateHooks that read
  // from the database, an eternal render loop can happen.
  // The timeout gives the depending state hook a moment to settle for the
  // current database data, before updating again.

  useEffect(() => {
    const timer = setTimeout(() => {
      if (updateRef && newDataForDb) {
        updateDbEntry(updateRef, newDataForDb);
      }
    }, 50); // prevents an eternal loop of updating hooks
    return () => clearTimeout(timer);
  }, [updateRef, newDataForDb, updateDbEntry]);
  // The timeout g hooks in o
  //#endregion

  return <React.Fragment></React.Fragment>;
}
