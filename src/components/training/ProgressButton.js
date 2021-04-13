import React, { useState, useEffect, useCallback } from "react";

export default function ProgressButton(props) {
  const [color, setColor] = useState();
  const [width, setWidth] = useState();
  const [rpm] = useState(props.rpm);
  const [rpmGreen] = useState(props.rpmGreen);
  const [pointOrDash] = useState(props.pointOrDash);

  const calculateButtonParameters = useCallback(() => {
    const widthQuotient = rpm / rpmGreen;
    
    // Calculate width:
    var greenWidth = 20;
    var currentWidth = greenWidth * widthQuotient;
    currentWidth = Math.floor(currentWidth);
    currentWidth += "rem";
    setWidth(currentWidth);
    
    // AssignColor:
    if (widthQuotient < 0.33) {
      setColor("red");
    } else if (widthQuotient < 1) {
      setColor("orange");
    } else {
      setColor("green");
    }
  }, [rpm, rpmGreen]);

  useEffect(() => {
    calculateButtonParameters();
  }, [props, calculateButtonParameters]);

  return (
    <span>
      {pointOrDash === "point" && (
        <button
          className="pt_status_button"
          style={{ backgroundColor: color, width: width }}
        >
          {rpm}rpm
        </button>
      )}
      {pointOrDash === "dash" && (
        <button
          className="dt_status_button"
          style={{ backgroundColor: color, width: width }}
        >
          {rpm}rpm
        </button>
      )}
    </span>
  );
}
