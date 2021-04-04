import React from "react";
import Header from "../components/Header";
import TrainingSelector from "../components/training/TrainingSelector";

function TrainingHomePage() {
  return (
    <div>
      <Header />
      <br></br>
      <h4>Wähle eine Trainingsdisziplin:</h4>
      <br></br>
      <TrainingSelector></TrainingSelector>
    </div>
  );
}

export default TrainingHomePage;
