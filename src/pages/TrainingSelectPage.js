import React from "react";
import Header from "../components/Header";
import TrainingSelector from "../components/training/TrainingSelector";
import BackHomeButton from "../components/BackHomeButton";

export default function TrainingSelectPage() {
  return (
    <div>
      <Header />
      <br></br>
      <h4>Wähle eine Trainingsdisziplin:</h4>
      <br></br>
      <TrainingSelector></TrainingSelector>
      <br></br>
    </div>
  );
}
