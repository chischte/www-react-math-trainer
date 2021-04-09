import React from "react";
import { useHistory } from "react-router-dom";

export default function TrainingSelector() {
  const history = useHistory();

  return (
    <div className="outliner outliner_flex">
      <button className="tr_calculator_button" onClick={() => {
        history.push("/training_dash_page/addition");
      }}>
        <div>+</div>
      </button>
      <button className="tr_calculator_button" onClick={() => {
        history.push("/training_dash_page/subtraction");
      }}>
        −
      </button>
      <button
        className="tr_calculator_button"
        onClick={() => {
          history.push("/training_point_page/multiplication");
        }}
      >
        &times;
      </button>
      <button
        className="tr_calculator_button"
        onClick={() => {
          history.push("/training_point_page/division");
        }}
      >
        &divide;
      </button>
    </div>
  );
}
