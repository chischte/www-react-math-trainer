import React from "react";
import Header from "../components/Header";
import TrainingSelector from "../components/training/TrainingSelector";

export default function TrainingSelectPage() {
  return (
    <div>
      <Header />
      <br></br>
      <div className="infotext">WÄHLE EIN TRAINING</div>
      <TrainingSelector></TrainingSelector>
    </div>
  );
}
