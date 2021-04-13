import React, { useCallback, useEffect, useState, useContext } from "react";
import Header from "../components/Header";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import { AuthContext } from "../components/firebase/Auth";
import BackHomeButton from "../components/BackHomeButton";
import ProgressButton from "../components/training/ProgressButton";

export default function TrainingDashPage() {
  const history = useHistory();
  const authContext = useContext(AuthContext);

  const [dbSnapshot, setDbSnapshot] = useState();
  const [trainingDiscipline, setTrainingDiscipline] = useState();
  const [dashOperator, setDashOperator] = useState();
  const [userUid, setUserUid] = useState();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  const setDashOperatorFromUrl = useCallback(() => {
    var splitUrl = window.location.href.split("/");
    var urlDiscipline = splitUrl[splitUrl.length - 1];
    switch (urlDiscipline) {
      case "addition":
        setTrainingDiscipline(urlDiscipline);
        setDashOperator("+");
        break;
      case "subtraction":
        setTrainingDiscipline(urlDiscipline);
        setDashOperator("-");
        break;
      default:
        alert("invalid URL");
        break;
    }
  }, []);

  useEffect(() => {
    setDashOperatorFromUrl();
  }, [setDashOperatorFromUrl]);

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
    }
  }, []);

  // establish DB connection only if user is logged in:
  useEffect(() => {
    if (!!userIsLoggedIn) {
      getDbSnapshot(getDbPath());
    }
  }, [userIsLoggedIn, getDbPath, getDbSnapshot]);

  const getRpmFromDb = (level) => {
    var rpm = "-";
    if (dbSnapshot) {
      try {
        if (level === "STEP") {
          rpm = dbSnapshot.step[1].rpm;
        } else if (level === "JUMP") {
          rpm = dbSnapshot.jump[1].rpm;
        } else if (level === "BIG JUMP") {
          rpm = dbSnapshot.big_jump[1].rpm;
        }
        //rpm += " rpm";
      } catch (e) {
        console.log(e);
      }
    }

    return rpm;
  };

  const scaleProgressButtonByLevel = (level) => {
    var rpmGreen;
    switch (level) {
      case "STEP":
        rpmGreen = 22;
        break;
      case "JUMP":
        rpmGreen = 19;
        break;
      case "BIG JUMP":
        rpmGreen = 10;
        break;
      default:
        alert("invalid level");
        break;
    }
    return rpmGreen;
  };

  const generateButtonRow = (level) => {
    return (
      <div>
        <table className="dash-training-selector-table">
          <thead>
            <tr>
              <td>
                <button
                  className="dt_hover_button"
                  onClick={() => {
                    history.push(
                      "/training_run/" +
                        trainingDiscipline +
                        "/" +
                        level.toLowerCase() +
                        "/range=1"
                    );
                  }}
                >
                  {level}
                </button>
                {getRpmFromDb(level) > 0 && (
                  <ProgressButton
                    rpm={getRpmFromDb(level)}
                    rpmGreen={scaleProgressButtonByLevel(level)}
                    pointOrDash="dash"
                  />
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
      <div className="huge-operator">{dashOperator}</div>
      {generateButtonRow("STEP")}
      {generateButtonRow("JUMP")}
      {generateButtonRow("BIG JUMP")}
      <br></br>
      <BackHomeButton buttonName="BACK" url="/training_select" />
    </div>
  );
}