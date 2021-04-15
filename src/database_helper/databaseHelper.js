import * as firebase from "firebase/app";

export default class DatabaseHelper {
  //   constructor() {}

  getDbConnection(ref) {
    return new Promise((resolve, reject) => {
      const userRef = firebase
        .database()
        .ref(ref);

      const onError = (error) => reject(error);
      const onData = (snapshot) => resolve(snapshot.val());
      userRef.on("value", onData, onError);
    });
  }

  async getDataContinuous(ref) {
    try {
      const dbUserData = await this.getDbConnection(ref);
      console.log("db helper: database ref.on set");
      console.log(dbUserData.groups); 
      return dbUserData;
    } catch (e) {
      console.log(e);
    } 
  }

  updateData(data,ref){
    firebase
    .database()
    .ref(ref)
    .update(data);
  }

  closeDbConnection() {}
}
