import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import GenerateMultiplications from "../calculation_generator/generateMultiplications";
import UserInput from "../components/UserInput";
import Stopwatch from "../components/Stopwatch";

const generateMultiplications = new GenerateMultiplications();

function TrainingPage() {
  const [calculationsSolved, setCalculationsSolved] = useState(0);
  const [solvedCalculationsArray, setSolvedCalculationsArray] = useState([]);
  const [solvingTimeArray, setSolvingTimeArray] = useState([]);
  const [timeElapsedArray, setTimeElapsedArray] = useState([]);
  const [errorArray, setErrorArray] = useState([]);
  const [trainingDiscipline, setTrainingDiscipline] = useState();
  const [trainingLevel, setTrainingLevel] = useState();
  const [trainingRange, setTrainingRange] = useState();
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
  }, [setDisciplineFromUrl]);

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

  // VARIOUS FUNCTIONS: --------------------------------------------------------

  const getNewCalculation = () => {
    return currentQuestion;
  };

  const getSolution = () => {
    return currentSolution;
  };
  const countOneUp = () => {
    setCalculationsSolved(calculationsSolved + 1);
  };

  const getOverviewArray = useCallback(() => {
    var overviewArray = [];

    for (var i = 0; i < 10; i++) {
      var _error = errorArray[i];
      var _answer = solutionArray[i];
      var _time = solvingTimeArray[i];
      var _question = questionArray[i];
      overviewArray.push([_question, _answer, _time, _error]);
    }
    // SortOverviewArray by slowest calculations
    overviewArray.sort(function (a, b) {
      return b[2] - a[2];
    });
    return overviewArray;
  }, [errorArray, questionArray, solutionArray, solvingTimeArray]);

  const addSlowestAnswersToDrill = useCallback(() => {
    var overviewArray = getOverviewArray();
    var _questionArray = questionArray;
    var _solutionArray = solutionArray;

    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 5; j++) {
        _questionArray.push(overviewArray[j][0]);
        _solutionArray.push(overviewArray[j][1]);
      }
    }
  }, [questionArray, solutionArray, getOverviewArray]);

  // MANAGE TRAINING STAGES ----------------------------------------------------

  const manageTrainingStages = useCallback(() => {
    switch (trainingStage) {
      case "readyToStart":
        if (calculationsSolved === 1) {
          if (trainingLevel === "1" || trainingLevel === "2") {
            setTrainingStage("running");
          }
          if (trainingLevel === "drill") {
            setTrainingStage("drillStage1");
          }
          setCalculationsSolved(0);
        }
        break;

      case "running":
        if (calculationsSolved === numberOfQuestions) {
          setTrainingStage("completed");
          setTotalTrainingTime(timeElapsed);
        }
        break;

      case "drillStage1":
        if (calculationsSolved === 10) {
          addSlowestAnswersToDrill();
          setTrainingStage("drillStage2");
        }
        break;

      case "drillStage2":
        if (calculationsSolved === 11) {
          setTrainingStage("drillStage3");
          setCalculationsSolved(10);
        }
        break;

        case "drillStage3":
          if (calculationsSolved === 14) {
            setTrainingStage("completed");
            setTotalTrainingTime(timeElapsed);
          }
          break;

      case "completed":
        break;

      default:
        break;
    }
  }, [
    calculationsSolved,
    numberOfQuestions,
    timeElapsed,
    trainingStage,
    trainingLevel,
    addSlowestAnswersToDrill,
  ]);

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

  

  // MONITOR TRAINING PERFORMANCE ----------------------------------------------

  // [0 = question,1 = answer, 2 = timeElapsed, 3= time to solve, 4= mark error]

  const markUserError = () => {
    var _errorArray = errorArray;
    _errorArray[calculationsSolved] = true;
    setErrorArray(_errorArray);
  };

  useEffect(() => {
    if (trainingStage === "drillStage1" || trainingStage === "drillStage3") {
      var calculationsArray = solvedCalculationsArray;
      calculationsArray[calculationsSolved] = currentQuestion;
      setSolvedCalculationsArray(calculationsArray);

      // Get arrays from hooks:
      var _solvingTimeArray = solvingTimeArray;
      var _timeElapsedArray = timeElapsedArray;

      var currentIndex = calculationsSolved;

      // Log Current time:
      _timeElapsedArray[currentIndex] = timeElapsed;

      // Calculate time difference
      if (calculationsSolved === 1) {
        var timeDifference = _timeElapsedArray[0];
        timeDifference = Math.round(10 * timeDifference) / 10;
        solvingTimeArray[currentIndex - 1] = timeDifference;
      }
      if (calculationsSolved > 1) {
        timeDifference =
          _timeElapsedArray[currentIndex - 1] -
          _timeElapsedArray[currentIndex - 2];
        timeDifference = Math.round(10 * timeDifference) / 10;
        _solvingTimeArray[currentIndex - 1] = timeDifference;
      }

      // Assign arrays back to hooks:
      setSolvingTimeArray(_solvingTimeArray);
      setTimeElapsedArray(_timeElapsedArray);
    }
  }, [
    calculationsSolved,
    trainingStage,
    currentQuestion,
    solvedCalculationsArray,
    timeElapsedArray,
    solvingTimeArray,
    timeElapsed,
  ]);

  // MANAGE DISPLAY OF TRAINING STAGES -----------------------------------------

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
          markUserError={markUserError}
          timeElapsed={0.0}
        />
      </div>
    );
  };

  const showReadyToContinueDrill = () => {
    return (
      <div>
        DRÜCKE ENTER UM DIE 5 LANGSAMSTEN RECHNUNGEN 2x zu WIEDERHOLEN
        <br></br>
        <br></br>
        <UserInput
          solution=""
          getNewCalculation={getNewCalculation}
          countOneUp={countOneUp}
          markUserError={markUserError}
          timeElapsed={555}
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
          markUserError={markUserError}
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
  // ---------------------------------------------------------------------------
  return (
    <div>
      <Header />
      <br></br>
      <br></br>
      {trainingStage === "readyToStart" && showReadyToStart()}
      {trainingStage === "running" && showTrainingRunning()}
      {trainingStage === "drillStage1" && showTrainingRunning()}
      {trainingStage === "drillStage2" && showReadyToContinueDrill()}
      {trainingStage === "drillStage3" && showTrainingRunning()}
      {trainingStage === "completed" && showTrainingFeedback()}
      <br></br>     

      <br></br>
    </div>
  );
}

export default TrainingPage;
