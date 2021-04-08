import React, { useCallback, useEffect, useState, useContext } from "react";
import Header from "../components/Header";
import { useHistory } from "react-router-dom";
import * as firebase from "firebase/app";
import { AuthContext } from "../components/firebase/Auth";
import BackHomeButton from "../components/BackHomeButton";
import ProgressButton from "../components/training/ProgressButton";

export default function TrainingPointPage() {
  const history = useHistory();
  const authContext = useContext(AuthContext);

  const [dbSnapshot, setDbSnapshot] = useState();
  const [trainingDiscipline, setTrainingDiscipline] = useState();
  const [pointOperator, setPointOperator] = useState();
  const [userUid, setUserUid] = useState();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  const setPointOperatorFromUrl = useCallback(() => {
    var splitUrl = window.location.href.split("/");
    var urlDiscipline = splitUrl[splitUrl.length - 1];
    switch (urlDiscipline) {
      case "multiplication":
        setTrainingDiscipline("multiplication");
        setPointOperator("×");
        break;
      case "division":
        setTrainingDiscipline("division");
        setPointOperator("÷");
        break;
      default:
        alert("invalid URL");
        break;
    }
  }, []);

  useEffect(() => {
    setPointOperatorFromUrl();
  }, [setPointOperatorFromUrl]);

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserUid(authContext.currentUser.uid);
      setUserIsLoggedIn(true);
    } else {
      setUserIsLoggedIn(false);
    }
  }, [authContext]);

  const getDbPath = useCallback(() => {
    const dbPath = "/users/" + userUid + "/training/" + trainingDiscipline;
    return dbPath;
  }, [trainingDiscipline, userUid]);

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
      if (dbUserData) {
        setDbSnapshot(dbUserData);
      }
    } catch (e) {
      console.log(e);
      alert("db connection failed\r\n"+e);
    }
  }, []);

  // establish DB connection only if user is logged in:
  useEffect(() => {
    if (!!userIsLoggedIn) {
      getDbSnapshot(getDbPath()); // uid michi = "UoVJYc0wIaNUSspmeZBhpGhNgFg2"
    }
  }, [userIsLoggedIn, getDbPath, getDbSnapshot]);

  const getRpmFromDb = (level, range) => {
    var rpm = "-";
    if (dbSnapshot) {
      console.log(dbSnapshot.level1);
      try {
        if (level === "level1") {
          rpm = dbSnapshot.level1[range].rpm;
        }
        if (level === "level2") {
          rpm = dbSnapshot.level2[range].rpm;
        }
        if (level === "drill") {
          rpm = dbSnapshot.drill[range].rpm;
        }
        //rpm += " rpm";
      } catch (e) {
        console.log(e);
      }
    }

    return rpm;
  };

  const generateButtonRow = (rowNumber) => {
    return (
      <div>
        <table className="point-training-selector-table">
          <thead>
            <tr>
              <td>
                <button className="pt_nohover_button">
                  {rowNumber}
                  {pointOperator}
                  {rowNumber}
                </button>
                <button
                  className="pt_hover_button"
                  onClick={() => {
                    history.push(
                      "/training_run/" +
                        trainingDiscipline +
                        "/level1/range=" +
                        rowNumber
                    );
                  }}
                >
                  LEVEL 1
                </button>
                {getRpmFromDb("level1", rowNumber) > 10 ? (
                  <button
                    className="pt_hover_button"
                    onClick={() => {
                      history.push(
                        "/training_run/" +
                          trainingDiscipline +
                          "/level2/range=" +
                          rowNumber
                      );
                    }}
                  >
                    LEVEL 2
                  </button>
                ) : (
                  "-->"
                )}
                {getRpmFromDb("level2", rowNumber) > 10 ? (
                  <span>
                    <button
                      className="pt_hover_button"
                      onClick={() => {
                        history.push(
                          "/training_run/" +
                            trainingDiscipline +
                            "/drill/range=" +
                            rowNumber
                        );
                      }}
                    >
                      DRILL
                    </button>
                    {getRpmFromDb("drill", rowNumber) > 0 && (
                      <ProgressButton
                        rpm={getRpmFromDb("drill", rowNumber)}
                        rpmGreen={70}
                        pointOrDash="point"
                      />
                    )}
                  </span>
                ) : (
                  "-->"
                )}
              </td>
            </tr>
          </thead>
        </table>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <h1>{pointOperator}</h1>
      {generateButtonRow(1)}
      {generateButtonRow(2)}
      {generateButtonRow(3)}
      {generateButtonRow(4)}
      {generateButtonRow(5)}
      {generateButtonRow(6)}
      {generateButtonRow(8)}
      {generateButtonRow(9)}
      {generateButtonRow(10)}
      <br></br>
      <BackHomeButton buttonName="BACK" url="/training_select" />
    </div>
  );
}