import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import GenerateMultiplications from "../calculation_generator/generateMultiplications";
import UserInput from "../components/UserInput";
import Stopwatch from "../components/Stopwatch";

const generateMultiplications = new GenerateMultiplications();

function TrainingPage() {
  const [trainingDiscipline, setTrainingDiscipline] = useState();
  const [trainingLevel, setTrainingLevel] = useState();
  const [trainingRange, setTrainingRange] = useState();
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

  const DisciplineEnum = Object.freeze({
    addition: 1,
    subtraction: 2,
    multiplication: 3,
    division: 4,
  });

  // GET URL INFORMATION -------------------------------------------------------

  const setDisciplineFromUrl = useCallback(() => {
    var splitUrl = window.location.href.split("/");
    var urlDiscipline = splitUrl[splitUrl.length - 3];

    switch (urlDiscipline) {
      case "addition":
        setTrainingDiscipline(DisciplineEnum.addition);
        break;
      case "subtraction":
        setTrainingDiscipline(DisciplineEnum.subtraction);
        break;
      case "multiplication":
        setTrainingDiscipline(DisciplineEnum.multiplication);
        break;
      case "division":
        setTrainingDiscipline(DisciplineEnum.division);
        break;
      default:
        alert("invalid URL");
        break;
    }
  }, [DisciplineEnum]);

  const setLevelFromUrl = () => {
    var splitUrl = window.location.href.split("/");
    setTrainingLevel(splitUrl[splitUrl.length - 2]);
  };

  const setNumberRangeFromUrl = () => {
    var splitUrl = window.location.href.split("/");
    setTrainingRange(splitUrl[splitUrl.length - 1]);
  };

  useEffect(() => {
    setDisciplineFromUrl();
    setLevelFromUrl();
    setNumberRangeFromUrl();
  }, [DisciplineEnum, setDisciplineFromUrl]);

  // GET INITIAL CALCULATIONS --------------------------------------------------

  const getMultiplication = useCallback(() => {
    generateMultiplications.generateCalculations(trainingLevel, trainingRange);
    setQuestionArray(generateMultiplications.getQuestionArray());
    setSolutionArray(generateMultiplications.getSolutionArray());
    setNumberOfQuestions(generateMultiplications.getNumberOfQuestions());
  }, [trainingLevel, trainingRange]);

  useEffect(() => {
    if (!calculationsGenerated) {
      switch (trainingDiscipline) {
        case DisciplineEnum.addition:
          alert("addition selected");
          setCalculationsGenerated(true);
          break;
        case DisciplineEnum.subtraction:
          setCalculationsGenerated(true);
          break;
        case DisciplineEnum.multiplication:
          getMultiplication();
          setCalculationsGenerated(true);
          break;
        case DisciplineEnum.division:
          setCalculationsGenerated(true);
          break;
        default:
          break;
      }
    }
  }, [
    DisciplineEnum,
    getMultiplication,
    trainingDiscipline,
    calculationsGenerated,
  ]);

  useEffect(() => {
    if (calculationsGenerated) {
      setCurrentQuestion(questionArray[calculationsSolved]);
      setCurrentSolution(solutionArray[calculationsSolved]);
    }
  }, [calculationsSolved, calculationsGenerated, questionArray, solutionArray]);

  // ---------------------------------------------------------------------------

  const getNewCalculation = () => {
    return currentQuestion;
  };

  const getSolution = () => {
    return currentSolution;
  };
  const countOneUp = () => {
    setCalculationsSolved(calculationsSolved + 1);
  };

  const manageTrainingStages = useCallback(() => {
    // switch(train)

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
  }, [calculationsSolved, numberOfQuestions, timeElapsed, trainingStage]);

  useEffect(() => {
    manageTrainingStages();
  }, [manageTrainingStages]);

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
