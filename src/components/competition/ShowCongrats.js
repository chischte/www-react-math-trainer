import React from "react";

const ShowCongrats = (props) => (
  <div className="show-congrats">
    <div className="show-congrats__haudi">HaudiHo!</div>
    Du hast
    <span className="show-congrats__count"> {props.calculationsSolved} </span>
    Rechnungen
    <br></br>
    in einer Minute gelöst.
  </div>
);

export default ShowCongrats;
