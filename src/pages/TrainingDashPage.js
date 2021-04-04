import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import { useHistory } from "react-router-dom";
import BackHomeButton from "../components/BackHomeButton"

function TrainingDashPage() {
  const history = useHistory();
  const [dashOperationMode, setDashOperationMode] = useState();
  const [dashOperator, setDashOperator] = useState();

  const setDashOperatorFromUrl = useCallback(() => {
    var splitUrl = window.location.href.split("/");
    var urlDiscipline = splitUrl[splitUrl.length - 1];
    switch (urlDiscipline) {
      case "addition":
        setDashOperationMode(urlDiscipline);
        setDashOperator("+");
        break;
      case "subtraction":
        setDashOperationMode(urlDiscipline);
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

  const generateButtonRow = (level) => {
    return (
      <div>
        <table className="dash-training-selector-table">
          <tr>
            <button
              className="dt_hover_button"
              onClick={() => {
                history.push(
                  "/training_run/" +
                    dashOperationMode +
                    "/level=" +
                    level.toLowerCase() +
                    "/range=1"
                );
              }}
            >
              {level}
            </button>
          </tr>
        </table>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <h1>{dashOperator}</h1>
      {generateButtonRow("STEP")}
      {generateButtonRow("JUMP")}
      {generateButtonRow("BIG JUMP")}
      <br></br>
      <BackHomeButton 
      buttonName="BACK"
      url="/training_select" />
    </div>
  );
}

export default TrainingDashPage;
