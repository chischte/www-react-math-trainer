import React, { useEffect, useState, useContext } from "react";
import * as firebase from "firebase/app";
import { AuthContext } from "../firebase/Auth";

function TrainingFeedback(props) {
  const authContext = useContext(AuthContext);

  const [overviewArray, setOverviewArray] = useState(props.overviewArray);
  const [trainingDiscipline, setTrainingDiscipline] = useState(
    props.trainingDiscipline
  );
  const [trainingLevel, setTrainingLevel] = useState(props.trainingLevel);
  const [trainingRange, setTrainingRange] = useState(props.trainingRange);
  const [userName, setUserName] = useState();
  const [userUid, setUserUid] = useState();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState();
  const [dbSnapshot, setDbSnapshot] = useState();

  useEffect(() => {}, [props]);

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserName(authContext.currentUser.displayName);
      setUserUid(authContext.currentUser.uid);
      setUserIsLoggedIn(true);
    } else {
      setUserName("guest");
      setUserIsLoggedIn(false);
    }
  }, [authContext]);

  const getDbPath = () => {
    const dbPath =
      "/users/" +
      userUid +
      "/training/" +
      trainingDiscipline +
      "/" +
      trainingLevel +
      "/" +
      trainingRange;
    return dbPath;
  };

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

  // get DB connection if user is logged in:
  useEffect(() => {
    if (!!userIsLoggedIn) {
      getDbSnapshot("/users/" + userUid + "/training/"); // uid michi = "UoVJYc0wIaNUSspmeZBhpGhNgFg2"
    }
  }, [userIsLoggedIn]);

  // update component with new snapshot:
  useEffect(() => {
    if (dbSnapshot) {
      //setUserGroups(dbSnapshot.groups);
      console.log(dbSnapshot.favorite_group);
      //setFavoriteGroup(dbSnapshot.favorite_group);
    }
  }, [dbSnapshot]);

  //CHECK FOR NEW RECORD
  //UPDATE DB

  // update DB entry:
  useEffect(() => {
    if (userIsLoggedIn) {
      let dbEntry = {
        rpm: getRpm(),
      };
      firebase.database().ref(getDbPath()).update(dbEntry);
      console.log("updated training score");
    }
  }, [userIsLoggedIn]);

  const getRpm = () => {
    const calculationsSolved = props.overviewArray.length;
    const rpm = Math.round(60 / (props.totalTrainingTime / calculationsSolved));
    return rpm;
  };

  return (
    <div>
      Super, du hast das Training geschafft!
      <br></br>
      Tip: Schreibe dir die langsamsten und falsch gelösten Rechnungen auf!
      <br></br>
      Geschwindigkeit: {getRpm()} rpm
      <br></br>
      (rpm = Rechnungen pro Minute)
      <table className="after-training-table">
        <thead>
          <tr>
            <th colSpan={4} className="tra_th title-header">
              AUSWERTUNG
            </th>
          </tr>
          <tr>
            <th className="tra_th">#</th>
            <th className="tra_th">Rechnung</th>
            <th className="tra_th">Zeit</th>
            <th className="tra_th">Fehler</th>
          </tr>
        </thead>
        <tfoot>
          {overviewArray.map((array, index) => (
            <tr key={array[4]}>
              <td className="tra_td">{array[4]}</td>
              <td className="tra_td">{array[0]}</td>
              {index < 3 ? (
                <td className="tra_td error_td">{array[2]}s</td>
              ) : (
                <td className="tra_td">{array[2]}s</td>
              )}

              {array[3] === true ? (
                <td className="tra_td error_td">&times;</td>
              ) : (
                <td className="tra_td"></td>
              )}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}
export default TrainingFeedback;
