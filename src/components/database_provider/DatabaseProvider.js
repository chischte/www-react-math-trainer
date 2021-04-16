import React, { useEffect, useCallback, useState } from "react";
import firebase from "firebase";

export default function DatabaseProvider(props) {
  const [counter, setCounter] = useState(0);
  // Hooks to listen for data in db:
  const [onceRef, setOnceRef] = useState();
  const [continuousRef, setContinuousRef] = useState();
  const [receivedDataFromDb, setNewDataFromDb] = useState();
  // Hooks to update db:
  const [updateRef, setUpdateRef] = useState();
  const [newDataForDb, setNewDataForDb] = useState();

  //#region MONITOR PROPS ----------------------------------------------------

  // Function to update the parent component:
  const updateParentFunction = props.updateFunction;

  useEffect(() => {
    setContinuousRef(props.continuousRef); // triggers a db query once
    setOnceRef(props.onceRefRef); // triggers a db query that updates on changes
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
          setNewDataFromDb(snapshot.val());
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
          setNewDataFromDb(snapshot.val());
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

  const updateCounter = useCallback(() => {
    setCounter(counter + 1);
  }, [counter]);

  const updateDbEntry = useCallback((updateRef, data) => {
    updateCounter();
    if (counter < 20) {
      console.log("write data to db");
      console.log(data.favorite_group.name);
      firebase
        .database()
        .ref(updateRef)
        .update(data)
        .catch(function (error) {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (updateRef && newDataForDb) {
        updateDbEntry(updateRef, newDataForDb);
      }
    }, 50); // this prevents an eternal loop, god knows why
    return () => clearTimeout(timer);
  }, [updateRef, newDataForDb, updateDbEntry]);
  //#endregion

  return <React.Fragment></React.Fragment>;
}
