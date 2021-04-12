import React from "react";

function ShowSpeed(props) {
  return (
    <div className="show-speed">
      <div>speed: {props.currentSpeed} cpm</div>
      <div>count: {props.calculationsSolved}</div>
    </div>
  );
}

export default ShowSpeed;
