import React, { useEffect, useCallback, useState } from "react";
import firebase from "firebase";

export default function DataProvider(props) {

    const [continuousData, setContinuousData] = useState();
    const [referenceIsSet, setReferenceIsSet] = useState(false);
    const [listener, setListener] = useState(false);

    //eAov1km3Uph0d4a8Fugkc3QP10l1

    const getDataContinuous = useCallback((contRef) => {
        let ref = firebase.database().ref(contRef);
        // if (listener) {
        //     ref.off("value", listener);
        // }
        // var _listener = ref.on("value", (snapshot) => {
        ref.on("value", (snapshot) => {
            try {
                console.log("get data from db helper:**************************");
                console.log(snapshot.val());
                setContinuousData(snapshot.val());
            } catch (e) {
                console.log(e);
            }
        });
        //setListener(_listener);
    }, [listener]);

    // Get DB /user data:
    useEffect(() => {
        if (props.continuousRef && !referenceIsSet) {
            //alert(props.continuousRef);
            getDataContinuous(props.continuousRef);
            setReferenceIsSet(true);
        }
    }, [getDataContinuous, props.continuousRef, referenceIsSet]);

    // Get DB /user data:
    useEffect(() => {
        if (continuousData) {
            props.setData(continuousData);
        }
        getDataContinuous();
    }, [getDataContinuous, props, continuousData]);

    // const getDataOnce = (ref) => {
    //     return new Promise((resolve, reject) => {
    //         const userRef = firebase
    //             .database()
    //             .ref(ref);
    //         const onError = (error) => reject(error);
    //         const onData = (snapshot) => resolve(snapshot.val());
    //         userRef.once("value", onData, onError);
    //     });
    // }


    // const updateData = (data, ref) => {
    //     firebase
    //         .database()
    //         .ref(ref)
    //         .update(data);
    // }

    // closeDbConnection() { }

    return (
        <div>

        </div>
    )
}
