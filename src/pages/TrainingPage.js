import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import GenerateMultiplications from "../calculation_generator/generateMultiplications";
import UserInput from "../components/UserInput";
import Stopwatch from "../components/Stopwatch";

const generateMultiplications = new GenerateMultiplications();

function TrainingPage() {
  const [calculationsSolved, setCalculationsSolved] = useState(0);
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const [questionArray, setQuestionArray] = useState();
  const [solutionArray, setSolutionArray] = useState();
  const [numberOfQuestions, setNumberOfQuestions] = useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [currentSolution, setCurrentSolution] = useState();
  const [calculationsGenerated, setCalculationsGenerated] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

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
    if (calculationsSolved === numberOfQuestions) {
      setTrainingCompleted(true);
    }
  }, [calculationsSolved, numberOfQuestions]);

  const updateTimeElapsed=(timeElapsed)=>{
    setTimeElapsed(timeElapsed);
  }

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
        <Stopwatch
        updateTimeElapsed={updateTimeElapsed}
        />
      </div>
    );
  };

  return (
    <div>
      <Header />
      <br></br>
      TRAINING {getRangeFromUrl()}
      <br></br>
      {trainingCompleted === true ? (
        <div> TRAINING COMPLETED</div>
      ) : (
        showTrainingRunning()
      )}
    </div>
  );
}

export default TrainingPage;
