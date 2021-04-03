import React from "react";
import Header from "../components/Header";
import { useHistory } from "react-router-dom";

function TrainingMultiplicationPage() {
  const history = useHistory();

  const generateButtonRow = (rowNumber) => {
    return (
      <div>
        <button className="training_button">
          {rowNumber}x{rowNumber}
        </button>{" "}
        <button
          className="training_button"
          onClick={() => {
            history.push("/training/multiplication/1/" + rowNumber);
          }}
        >
          LEVEL 1
        </button>
        <button
          className="training_button"
          onClick={() => {
            history.push("/training/multiplication/2/" + rowNumber);
          }}
        >
          LEVEL 2
        </button>
        <button
          className="training_button"
          onClick={() => {
            history.push("/training/multiplication/drill/"+ rowNumber);
          }}
        >
          DRILL
        </button>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <br></br>
      MULTIPLICATION TRAINING
      <br></br>
      <br></br>
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
    </div>
  );
}

export default TrainingMultiplicationPage;
