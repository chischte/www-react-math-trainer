import React from "react";
import Header from "../components/Header";
import TrainingSelector from "../components/training/TrainingSelector";
import { useHistory } from 'react-router-dom'

function TrainingMultiplicationPage() {
    const history = useHistory();
  return (
    <div>
      <Header />
      <br></br>
      MULTIPLICATION TRAINING
      <br></br>
      <br></br>
      <button className="training_button" onClick={() => {}}>
        8x8
      </button>{" "}
      <button className="training_button" onClick={() => {}}>
        LEVEL 1
      </button>
      <button className="training_button" onClick={() => {}}>
        LEVEL 2
      </button>
      <button className="training_button" onClick={() => {history.push('/training/multiplication/drill/8x8')}}>
        DRILL
      </button>
      <br></br>
    </div>
  );
}

export default TrainingMultiplicationPage;
