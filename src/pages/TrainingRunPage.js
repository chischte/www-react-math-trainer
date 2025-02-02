import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import GenerateCalculations from "../calculation_generator/generateTrainingCalculations";
import UserInput from "../components/UserInput";
import Stopwatch from "../components/Stopwatch";
import BackHomeButton from "../components/BackHomeButton";
import TrainingFeedback from "./TrainingFeedbackSubPage";

const generateCalculations = new GenerateCalculations();

export default function TrainingRunPage() {
 //#region useState HOOKS ------------------------------------------------------
  
 const [numberOfQuestions, setNumberOfQuestions] = useState();
  const [calculationsSolved, setCalculationsSolved] = useState(0);
  const [questionArray, setQuestionArray] = useState([]);
  const [solutionArray, setSolutionArray] = useState();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [solvedCalculationsArray, setSolvedCalculationsArray] = useState([]);
  const [solvingTimeArray, setSolvingTimeArray] = useState([]);
  const [timeElapsedArray, setTimeElapsedArray] = useState([]);
  const [errorArray, setErrorArray] = useState([]);
  const [trainingLevel, setTrainingLevel] = useState();
  const [trainingDiscipline, setTrainingDiscipline] = useState();
  const [trainingRange, setTrainingRange] = useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [currentSolution, setCurrentSolution] = useState();
  const [calculationsGenerated, setCalculationsGenerated] = useState(false);
  const [trainingStage, setTrainingStage] = useState("readyToStart");
  const [totalTrainingTime, setTotalTrainingTime] = useState();
  const [previousTimeElapsed, setPreviousTimeElapsed] = useState(0);
  //#endregion

  //#region GET URL INFORMATION ------------------------------------------------

  const setDisciplineFromUrl = useCallback(() => {
    var splitUrl = window.location.href.split("/");
    var urlDiscipline = splitUrl[splitUrl.length - 3];

    switch (urlDiscipline) {
      case "addition":
        break;
      case "subtraction":
        break;
      case "multiplication":
        break;
      case "division":
        break;
      default:
        alert("invalid URL discipline");
        break;
    }
    setTrainingDiscipline(urlDiscipline);
  }, []);

  const setLevelFromUrl = () => {
    var splitUrl = window.location.href.split("/");
    var urlLevel = splitUrl[splitUrl.length - 2];

    switch (urlLevel) {
      case "level1":
        break;
      case "level2":
        break;
      case "drill":
        break;
      case "step":
        break;
      case "jump":
        break;
      case "big%20jump":
        urlLevel = "big_jump";
        break;
      default:
        alert("invalid URL level");
        break;
    }
    setTrainingLevel(urlLevel);
  };

  const setNumberRangeFromUrl = () => {
    var splitUrl = window.location.href.split("/");
    var urlRangeString = splitUrl[splitUrl.length - 1];
    var urlRangeNumber = urlRangeString.split("=")[1];
    // Check for valid number Range:
    if (urlRangeNumber > 0 && urlRangeNumber <= 10) {
      setTrainingRange(urlRangeNumber);
    } else {
      alert("invalid URL range number");
    }
  };

  useEffect(() => {
    setDisciplineFromUrl();
    setLevelFromUrl();
    setNumberRangeFromUrl();
  }, [setDisciplineFromUrl]);

  //#endregion

  //#region GET INITIAL CALCULATIONS -------------------------------------------

  const getCalculation = useCallback(() => {
    generateCalculations.generateCalculations(
      trainingDiscipline,
      trainingLevel,
      trainingRange
    );
    setQuestionArray(generateCalculations.getQuestionArray());
    setSolutionArray(generateCalculations.getSolutionArray());
    setNumberOfQuestions(generateCalculations.getQuestionArray().length);
  }, [trainingLevel, trainingRange, trainingDiscipline]);

  useEffect(() => {
    if (!calculationsGenerated && trainingDiscipline) {
      getCalculation();
      setCalculationsGenerated(true);
    }
  }, [getCalculation, trainingDiscipline, calculationsGenerated]);

  useEffect(() => {
    if (calculationsGenerated) {
      setCurrentQuestion(questionArray[calculationsSolved]);
      setCurrentSolution(solutionArray[calculationsSolved]);
    }
  }, [calculationsSolved, calculationsGenerated, questionArray, solutionArray]);

  useEffect(() => {
    console.log(currentSolution);
  }, [currentSolution]);

  //#endregion

  //#region VARIOUS ------------------------------------------------------------

  const getNewCalculation = () => {
    return currentQuestion;
  };

  const getSolution = () => {
    return currentSolution;
  };
  const countOneUp = () => {
    setCalculationsSolved(calculationsSolved + 1);
  };

  const updateTimeElapsed = (timeElapsed) => {
    setTimeElapsed(timeElapsed);
  };

  // Generate Overview Array:
  const getOverviewArray = useCallback(() => {
    var overviewArray = [];

    for (var i = 0; i < solutionArray.length; i++) {
      var _question = questionArray[i];
      var _answer = solutionArray[i];
      var _time = solvingTimeArray[i];
      var _error = errorArray[i];
      var _key = [i + 1];
      overviewArray.push([_question, _answer, _time, _error, _key]);
    }
    // Sort Overview Array by slowest calculations
    overviewArray.sort(function (a, b) {
      return b[2] - a[2];
    });
    return overviewArray;
  }, [errorArray, questionArray, solutionArray, solvingTimeArray]);
  //#endregion

  //#region CREATE ADDITIONAL DRILL QUESTIONS ----------------------------------

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
    setNumberOfQuestions(_questionArray.length);
  }, [questionArray, solutionArray, getOverviewArray]);
  //#endregion

  //#region MANAGE TRAINING STAGES ---------------------------------------------

  const manageTrainingStages = useCallback(() => {
    switch (trainingStage) {
      case "readyToStart":
        if (calculationsSolved === 1) {
          if (
            trainingLevel === "level1" ||
            trainingLevel === "level2" ||
            trainingLevel === "step" ||
            trainingLevel === "jump" ||
            trainingLevel === "big_jump"
          ) {
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
          setPreviousTimeElapsed(timeElapsedArray[9]);
        }
        break;

      case "drillStage3":
        if (calculationsSolved === numberOfQuestions) {
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
    timeElapsedArray,
  ]);

  useEffect(() => {
    manageTrainingStages();
  }, [manageTrainingStages]);

  //#endregion

  //#region MONITOR TRAINING PERFORMANCE ---------------------------------------

  // [0 = question,1 = answer, 2 = timeElapsed, 3= time to solve, 4= mark error]

  const markUserError = () => {
    var _errorArray = errorArray;
    if (!_errorArray[calculationsSolved]) {
      _errorArray[calculationsSolved] = 1;
    } else {
      _errorArray[calculationsSolved] += 1;
    }
    setErrorArray(_errorArray);
  };

  useEffect(() => {
    // if (trainingStage === "drillStage1" || trainingStage === "drillStage3") {
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
    // }
  }, [
    calculationsSolved,
    trainingStage,
    currentQuestion,
    solvedCalculationsArray,
    timeElapsedArray,
    solvingTimeArray,
    timeElapsed,
  ]);

  //#endregion

  //#region MANAGE DISPLAY OF TRAINING STAGES ----------------------------------

  const showReadyToStart = () => {
    return (
      <div>
        <h4>Drücke ENTER um das Training zu starten!</h4>
        <br></br>
        <br></br>
        <UserInput
          solution=""
          getNewCalculation={getNewCalculation}
          countOneUp={countOneUp}
          markUserError={markUserError}
        />
      </div>
    );
  };

  const showReadyToContinueDrill = () => {
    return (
      <div>
        DRÜCKE ENTER
        <br></br>
        UM DIE 5 LANGSAMSTEN RECHNUNGEN
        <br></br>
        2x zu WIEDERHOLEN
        <br></br>
        <br></br>
        <UserInput
          solution=""
          getNewCalculation={getNewCalculation}
          countOneUp={countOneUp}
          markUserError={markUserError}
        />
      </div>
    );
  };

  const showTrainingRunning = () => {
    return (
      <div>
        <h3>{currentQuestion}</h3>
        <UserInput
          solution={getSolution()}
          getNewCalculation={getNewCalculation}
          countOneUp={countOneUp}
          markUserError={markUserError}
        />
        <div className="infotext">Noch <span className="it-blue">{numberOfQuestions - calculationsSolved}</span> Rechnungen</div>
        <Stopwatch
          updateTimeElapsed={updateTimeElapsed}
          startTime={previousTimeElapsed}
        />
      </div>
    );
  };

  const showTrainingFeedback = () => {
    var overviewArray = getOverviewArray();
    return (
      <div>
        <TrainingFeedback
          overviewArray={overviewArray}
          totalTrainingTime={totalTrainingTime}
          trainingDiscipline={trainingDiscipline}
          trainingLevel={trainingLevel}
          trainingRange={trainingRange}
        />
      </div>
    );
  };
  //#endregion

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
      <BackHomeButton buttonName="BACK" url="/training_select" />
      <br></br>
    </div>
  );
}
