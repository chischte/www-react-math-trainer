import React from "react";
import { useHistory } from "react-router-dom";

function TrainingSelector(props) {
  const history = useHistory();

  return (
    <div className="outliner outliner__flex">
      <button className="calculator_button" onClick={() => {}}>
        <div>+</div>
      </button>
      <button className="calculator_button" onClick={() => {}}>
        −
      </button>
      <button
        className="calculator_button"
        onClick={() => {
          history.push("/training_point_page/multiplication");
        }}
      >
        &times;
      </button>
      <button
        className="calculator_button"
        onClick={() => {
          history.push("/training_point_page/division");
        }}
      >
        &divide;
      </button>
    </div>
  );
}
export default TrainingSelector;
