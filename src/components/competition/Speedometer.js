import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

function Speedometer(props) {

  let currentModeRecordCpm = props.currentModeRecordCpm;
  if (currentModeRecordCpm === 0) {
    currentModeRecordCpm = 30;
  }

  return (
    <div className="speedometer__container outliner">
      <ReactSpeedometer
        maxValue={currentModeRecordCpm}
        width={170}
        maxSegmentLabels={1}
        needleHeightRatio={0.8}
        ringWidth={20}
        value={props.currentSpeed}
        paddingHorizontal={40}
        labelFontSize={"1.2rem"}
        segments={7}
        currentValueText=" "
        needleColor= {"rgb(14,102,255)"}
        needleTransitionDuration={10000}
        needleTransition="easeElastic"
        textColor="grey"
      />

    </div>
  );
}

export default Speedometer;
