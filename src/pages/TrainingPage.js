import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import GenerateMultiplications from "../calculation_generator/generateMultiplications";
import UserInput from "../components/UserInput";


const generateMultiplications = new GenerateMultiplications();

function TrainingPage() {
  const [calculationsSolved, setCalculationsSolved] = useState(0);

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

  const getNewCalculation = () => {
    return "bbb";
  };

  const getSolution=()=>{
    var solution = generateMultiplications.generateMultiplication(getRangeFromUrl())[1][calculationsSolved]
    //solution=666
    return solution
}
  const countOneUp = () => {
    setCalculationsSolved(calculationsSolved+1);
  };

  return (
    <div>
      <Header />
      <br></br>
      TRAINING
      <br></br>
      Question ={" "}
      {generateMultiplications.generateMultiplication(getRangeFromUrl())[0][calculationsSolved]}
      <br></br>
      <br></br>
      <UserInput
        solution={getSolution()}
        getNewCalculation={getNewCalculation}
        countOneUp={countOneUp}
      />
      <br></br>
      Answer ={" "}
      {generateMultiplications.generateMultiplication(getRangeFromUrl())[1][calculationsSolved]}
      <br></br>
      Calculations Solved = {calculationsSolved}
      <br></br>
      Number of Calculations = {generateMultiplications.generateMultiplication()[0].length}  
    </div>
  );
}

export default TrainingPage;
