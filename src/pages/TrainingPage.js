import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import GenerateMultiplications from "../calculation_generator/generateMultiplications";
import UserInput from "../components/UserInput";
import Stopwatch from "../components/Stopwatch";

const generateMultiplications = new GenerateMultiplications();

function TrainingPage() {
  const [calculationsSolved, setCalculationsSolved] = useState(0);
  const [questionArray, setQuestionArray] = useState();
  const [solutionArray, setSolutionArray] = useState();
  const [numberOfQuestions, setNumberOfQuestions] = useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [currentSolution, setCurrentSolution] = useState();
  const [calculationsGenerated, setCalculationsGenerated] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [trainingStage, setTrainingStage] = useState("readyToStart");
  const [totalTrainingTime, setTotalTrainingTime] = useState();

  const getLevelFromUrl = () => {
    var splitUrl = window.location.href.split("/");
    return splitUrl[splitUrl.length - 2];
  };

  const getRangeFromUrl = () => {
    var splitUrl = window.location.href.split("/");
    return splitUrl[splitUrl.length - 1];
  };

  useEffect(() => {
    generateMultiplications.generateCalculations(
      getLevelFromUrl(),
      getRangeFromUrl()
    );
    setQuestionArray(generateMultiplications.getQuestionArray());
    setSolutionArray(generateMultiplications.getSolutionArray());
    setNumberOfQuestions(generateMultiplications.getNumberOfQuestions());
    setCalculationsGenerated(true);
  }, []);

  useEffect(() => {
    if (calculationsGenerated) {
      setCurrentQuestion(questionArray[calculationsSolved]);
      setCurrentSolution(solutionArray[calculationsSolved]);
    }
  }, [calculationsSolved, calculationsGenerated, questionArray, solutionArray]);

  const getNewCalculation = () => {
    return currentQuestion;
  };

  const getSolution = () => {
    return currentSolution;
  };
  const countOneUp = () => {
    setCalculationsSolved(calculationsSolved + 1);
  };

  useEffect(() => {
    if (
      calculationsSolved === numberOfQuestions &&
      trainingStage === "running"
    ) {
      setTrainingStage("completed");
      setTotalTrainingTime(timeElapsed);
    }
    if (trainingStage === "readyToStart" && calculationsSolved === 1) {
      setTrainingStage("running");
      setCalculationsSolved(0);
    }
  }, [calculationsSolved, numberOfQuestions]);

  const updateTimeElapsed = (timeElapsed) => {
    setTimeElapsed(timeElapsed);
  };

  const getRpm = () => {
    const rpm = Math.round(60 / (totalTrainingTime / calculationsSolved));
    return rpm;
  };
  // MANAGE TRAINING STAGES ----------------------------------------------------

  const showReadyToStart = () => {
    return (
      <div>
        DRÜCKE ENTER UM DAS TRAINING ZU STARTEN
        <br></br>
        <br></br>
        <UserInput
          solution=""
          getNewCalculation={getNewCalculation}
          countOneUp={countOneUp}
        />
      </div>
    );
  };

  const showTrainingRunning = () => {
    return (
      <div>
        Question ={currentQuestion}
        <br></br>
        <br></br>
        <UserInput
          solution={getSolution()}
          getNewCalculation={getNewCalculation}
          countOneUp={countOneUp}
        />
        <br></br>
        Calculations Solved : {calculationsSolved}
        <br></br>
        <Stopwatch updateTimeElapsed={updateTimeElapsed} />
      </div>
    );
  };

  const showTrainingFeedback = () => {
    return (
      <div>
        Super, du hast das Training geschafft!
        <br></br>
        <br></br>
        Trainingsdauer: {totalTrainingTime} Sekunden
        <br></br>
        Geschwindigkeit: {getRpm()} rpm
        <br></br>
         (rpm = Rechnungen pro Minute)
      </div>
    );
  };
  // -----------------------------------------------------------------------------
  return (
    <div>
      <Header />
      <br></br>
      <br></br>
      {trainingStage === "readyToStart" && showReadyToStart()}
      {trainingStage === "running" && showTrainingRunning()}
      {trainingStage === "completed" && showTrainingFeedback()}
      <br></br>
      
      <br></br>
    </div>
  );
}

export default TrainingPage;
