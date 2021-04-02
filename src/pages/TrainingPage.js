import React from "react";
import Header from "../components/Header";
import GenerateMultiplications from "../calculation_generator/generateMultiplications";

const generateMultiplications = new GenerateMultiplications();

function TrainingPage() {
  const getDisciplineFromUrl = () => {
    var splitUrl = window.location.href.split("/");
    return splitUrl[splitUrl.length - 3];
  };

  const getLevelFromUrl = () => {
    var splitUrl = window.location.href.split("/");
    return splitUrl[splitUrl.length - 2];
  };

  const getRangeFromUrl = () => {
    var splitUrl = window.location.href.split("/");
    return splitUrl[splitUrl.length - 1];
  };

  return (
    <div>
      <Header />
      <br></br>
      TRAINING
      <br></br>
      Question ={" "}
      {generateMultiplications.generateMultiplication(getRangeFromUrl())[0][0]}
      <br></br>
      Answer ={" "}
      {generateMultiplications.generateMultiplication(getRangeFromUrl())[1][0]}
      <br></br>
    </div>
  );
}

export default TrainingPage;
