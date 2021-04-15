import * as firebase from "firebase/app";

export default class DatabaseHelper {

  getDataContinuous(ref) {
    return new Promise((resolve, reject) => {
      const userRef = firebase
        .database()
        .ref(ref);
      const onError = (error) => reject(error);
      const onData = (snapshot) => resolve(snapshot.val());
      userRef.on("value", onData, onError);
    });
  }

  getDataOnce(ref) {
    return new Promise((resolve, reject) => {
      const userRef = firebase
        .database()
        .ref(ref);
      const onError = (error) => reject(error);
      const onData = (snapshot) => resolve(snapshot.val());
      userRef.once("value", onData, onError);
    });
  }


  updateData(data, ref) {
    firebase
      .database()
      .ref(ref)
      .update(data);
  }

  closeDbConnection() { }
}
