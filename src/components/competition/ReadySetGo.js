import React, { useEffect, useState } from "react";

export default function ReadySetGo(props) {
  const [stage, setStage] = useState(3);

  if (stage <= 0) {
    props.setStageRunning();
  }

  useEffect(() => {
    // Save intervalId to clear the interval when the
    // component re-renders:
    const intervalId = setInterval(() => {
      setStage(stage - 1);
    }, 800);

    // Clear interval on re-render to avoid memory leaks:
    return () =>
      clearInterval(intervalId);
  }, [stage]);

  return (
    <div className="ready-set-go">
      {stage === 2 && (<div>READY</div>)}
      {stage === 1 && (<div>SET</div>)}
    </div>
  );
}