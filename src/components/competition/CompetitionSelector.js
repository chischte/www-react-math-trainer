import React from "react";

const CompetitionSelector = (props) => (
  <div className="outliner outliner__flex">
    <button
      className="comp_calculator_button"
      onClick={() => {
        props.selectMode("addition");
        props.setStageReadySetGo();
      }}
      >
      <div>+</div>
    </button>
    <button
      className="comp_calculator_button"
      onClick={() => {
        props.selectMode("subtraction");
        props.setStageReadySetGo();
      }}
      >
    −
    </button>
    <button
      className="comp_calculator_button"
      onClick={() => {
        props.selectMode("multiplication");
        props.setStageReadySetGo();
      }}
      >
      &times;
    </button>
    <button
      className="comp_calculator_button"
      onClick={() => {
        props.selectMode("division");
        props.setStageReadySetGo();
      }}
      >
      {" "}
      &divide;
    </button>
  </div>
);

export default CompetitionSelector;
