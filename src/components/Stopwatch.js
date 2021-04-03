import React, { useEffect, useState } from "react";

function Stopwatch(props) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    setTimeElapsed(props.startTime);
  }, []);

  useEffect(() => {
    // save intervalId to clear interval when the component re-renders
    const intervalId = setInterval(() => {
      var _timeElapsed = timeElapsed + 0.1;
      _timeElapsed = Math.round(_timeElapsed * 10) / 10;
      setTimeElapsed(_timeElapsed);
      //
    }, 100);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  });

  useEffect(() => {
    props.updateTimeElapsed(timeElapsed);
  }, [timeElapsed, props]);

  return (
    <div>
      <div className="countdown">Stoppuhr: {Math.round(timeElapsed)}</div>
    </div>
  );
}

export default Stopwatch;
