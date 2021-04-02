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
      <button className="training_button" >
        8x8
      </button>{" "}
      <button className="training_button" onClick={() => {history.push('/training/multiplication/1/8')}}>
        LEVEL 1
      </button>
      <button className="training_button" onClick={() => {history.push('/training/multiplication/2/8')}}>
        LEVEL 2
      </button>
      <button className="training_button" onClick={() => {history.push('/training/multiplication/drill/8')}}>
        DRILL
      </button>
      <br></br>
    </div>
  );
}

export default TrainingMultiplicationPage;
