import React, { useState, useEffect, useCallback } from "react";

function ProgressButton(props) {
  const [color, setColor] = useState();
  const [width, setWidth] = useState();
  const [rpm] = useState(props.rpm);
  const [rpmGreen] = useState(props.rpmGreen);

  const calculateButtonParameters = useCallback(() => {
    const widthQuotient = rpm / rpmGreen;
    // Calculate width:
    var greenWidth = 30;
    var currentWidth = greenWidth * widthQuotient;
    currentWidth = Math.floor(currentWidth);
    currentWidth += "rem";
    setWidth(currentWidth);
    //AssignColor:
    if (widthQuotient < 0.25) {
      setColor("red");
    } else if (widthQuotient < 0.6) {
      setColor("orange");
    } else {
      setColor("green");
    }
  }, [rpm, rpmGreen]);


  useEffect(() => {
    calculateButtonParameters();
  }, [props,calculateButtonParameters]);

 
  return (
    
      <button
        className="pt_status_button"
        style={{ backgroundColor: color, width: width }}
      >
        {rpm}rpm
      </button>
    
  );
}

export default ProgressButton;
