import React, { useEffect, useState, useCallback } from "react";

export default function Countdown(props) {
  const [initialTime] = useState(8);
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const clockInterval = 100; // [ms]
  const resolution = clockInterval / 1000 //[s]

  const communicateWithParent = useCallback(() => {
    if (timeRemaining > 0) {
      props.setTimeElapsed(timeElapsed);
    } else {
      props.setStageCompleted();
    }
  }, [props, timeElapsed, timeRemaining])

  // Update time periodically:
  useEffect(() => {
    // Save intervalId to clear interval when the component re-renders:
    const intervalId = setInterval(() => {
      var newTimeElapsed = timeElapsed + clockInterval / 1000;
      newTimeElapsed = Math.round(newTimeElapsed / resolution) * resolution;
      setTimeElapsed(newTimeElapsed);

      let newTimeRemaining = initialTime - newTimeElapsed;
      newTimeRemaining = Math.round(newTimeRemaining / resolution) * resolution;
      setTimeRemaining(newTimeRemaining)

      communicateWithParent();
    }, clockInterval);

    // Clear interval on re-render to avoid memory leaks:
    return () => clearInterval(intervalId);
  }, [initialTime, timeElapsed, resolution, communicateWithParent]);

  return (
    <div>
      {timeRemaining === 0
        ?
        <div className="countdown">time's up !</div>
        :
        <div className="countdown">{Math.ceil(timeRemaining)}</div>
      }
    </div>
  );
}


