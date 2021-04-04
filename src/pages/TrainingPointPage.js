import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import { useHistory } from "react-router-dom";
import BackHomeButton from "../components/BackHomeButton";

function TrainingPointPage() {
  const history = useHistory();
  const [pointOperationMode, setPointOperationMode] = useState();
  const [pointOperator, setPointOperator] = useState();

  const setPointOperatorFromUrl = useCallback(() => {
    var splitUrl = window.location.href.split("/");
    var urlDiscipline = splitUrl[splitUrl.length - 1];
    switch (urlDiscipline) {
      case "multiplication":
        setPointOperationMode("multiplication");
        setPointOperator("×");
        break;
      case "division":
        setPointOperationMode("division");
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

  const generateButtonRow = (rowNumber) => {
    return (
      <div>
        <table className="point-training-selector-table">
          <tr>
            <button className="pt_nohover_button">
              {rowNumber}
              {pointOperator}
              {rowNumber}
            </button>
            <button
              className="pt_hover_button"
              onClick={() => {
                history.push(
                  "/training/" +
                    pointOperationMode +
                    "/level=1/range=" +
                    rowNumber
                );
              }}
            >
              LEVEL 1
            </button>
            <button
              className="pt_hover_button"
              onClick={() => {
                history.push(
                  "/training/" +
                    pointOperationMode +
                    "/level=2/range=" +
                    rowNumber
                );
              }}
            >
              LEVEL 2
            </button>
            <button
              className="pt_hover_button"
              onClick={() => {
                history.push(
                  "/training/" +
                    pointOperationMode +
                    "/level=drill/range=" +
                    rowNumber
                );
              }}
            >
              DRILL
            </button>
          </tr>
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
      <BackHomeButton 
      buttonName="BACK"
      url="/training_home" />
    </div>
  );
}

export default TrainingPointPage;
