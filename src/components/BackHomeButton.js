import React from "react";
import { useHistory } from "react-router-dom";

function BackHomeButton(props) {
  const history = useHistory();

  return (
    <div className="outliner outliner_flex">
      <button
      className="bh_hover_button"
        onClick={() => {
          history.push(props.url);
        }}
      >
        {props.buttonName}
      </button>
    </div>
  );
}
export default BackHomeButton;
