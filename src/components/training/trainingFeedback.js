import React, { useEffect, useState, useContext, useCallback } from "react";
import * as firebase from "firebase/app";
import { AuthContext } from "../firebase/Auth";

function TrainingFeedback(props) {
  const authContext = useContext(AuthContext);

  const [overviewArray] = useState(props.overviewArray);
  const [trainingDiscipline] = useState(props.trainingDiscipline);
  const [trainingLevel] = useState(props.trainingLevel);
  const [trainingRange] = useState(props.trainingRange);
  const [userName, setUserName] = useState();
  const [userUid, setUserUid] = useState();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [dbSnapshot, setDbSnapshot] = useState();

  const getRpm = useCallback(() => {
    const calculationsSolved = props.overviewArray.length;
    const rpm = Math.round(60 / (props.totalTrainingTime / calculationsSolved));
    return rpm;
  }, [props]);

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

  const getDbPath = useCallback(() => {
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
  }, [trainingDiscipline, trainingLevel, trainingRange, userUid]);

  // update DB entry:
  const updateNewRecordInDb = useCallback(() => {
    if (userIsLoggedIn) {
      let dbEntry = {
        rpm: getRpm(),
      };
      firebase.database().ref(getDbPath()).update(dbEntry);
      console.log("updated training score");
    }
  }, [getDbPath, getRpm, userIsLoggedIn]);

  const createFirstDbEntry = useCallback(() => {
    if (!!userIsLoggedIn) {
      let dbEntry = {
        rpm: getRpm(),
      };
      firebase.database().ref(getDbPath()).update(dbEntry);
      alert(
        "Super " +
          userName +
          "! ...dein Punktestand wurde gespeichert."
      );
      console.log("created training score");
    }
  }, [getDbPath, getRpm, userIsLoggedIn,userName]);

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
  const getDbSnapshot = React.useCallback(
    async (ref) => {
      try {
        const dbUserData = await getDbConnection(ref);
        if (dbUserData) {
          setDbSnapshot(dbUserData);
        } else {
          createFirstDbEntry();
        }
      } catch (e) {
        console.log(e);
      }
    },
    [createFirstDbEntry]
  );

  // establish DB connection only if user is logged in:
  useEffect(() => {
    if (!!userIsLoggedIn) {
      getDbSnapshot(getDbPath()); // uid michi = "UoVJYc0wIaNUSspmeZBhpGhNgFg2"
    }
  }, [userIsLoggedIn, getDbPath, getDbSnapshot]);

  // check for new record
  useEffect(() => {
    if (dbSnapshot) {
      console.log(dbSnapshot);
      if (getRpm() > dbSnapshot.rpm) {
        updateNewRecordInDb();
        alert(
          "SUPER " + userName + "! EIN NEUER REKORD IN DIESER DISZIPLIN!!!"
        );
      }
    }
  }, [dbSnapshot, getRpm, updateNewRecordInDb]);

  return (
    <div>
      Super {userName}! ...du hast das Training geschafft!
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
