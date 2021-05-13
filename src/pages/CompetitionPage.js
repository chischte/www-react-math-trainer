import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../components/firebase/Auth";
import GenerateCalculations from "../calculation_generator/generateCompetitionCalculations";
import Countdown from "../components/competition/Countdown";
import QuestionDisplay from "../components/QuestionDisplay";
import CompetitionSelector from "../components/competition/CompetitionSelector";
import ReadySetGo from "../components/competition/ReadySetGo";
import CompetitionFeedback from "../pages/CompetitionFeedbackSubPage";
import UserInput from "../components/UserInput";
import Header from "../components/Header";
import GroupSelector from "../components/GroupSelector";
import Speedometer from "../components/competition/Speedometer";
import DatabaseProvider from "../components/database_provider/DatabaseProvider";

const generateCalculations = new GenerateCalculations();

export default function CompetitionPage() {
  const authContext = useContext(AuthContext);

  //#region useState HOOKS -------------------------------------------------------

  // INFOS FROM AND FOR DATABASE:
  const [dbHighscoreSnapshot, setDbHighscoreSnapshot] = useState();
  const [currentModeRecordCpm, setCurrentModeRecordCpm] = useState(0);
  const [cpmAdd, setCpmAdd] = useState(0);
  const [cpmSub, setCpmSub] = useState(0);
  const [cpmMul, setCpmMul] = useState(0);
  const [cpmDiv, setCpmDiv] = useState(0);
  const [countAdd, setCountAdd] = useState(0);
  const [countSub, setCountSub] = useState(0);
  const [countMul, setCountMul] = useState(0);
  const [countDiv, setCountDiv] = useState(0);
  const [countTotal, setCountTotal] = useState(0);
  const [highscoreDbPath, setHighscoreDbPath] = useState(0);
  const [userDbPath, setUserDbPath] = useState(0);
  // TRIGGER DB/HIGHSCORE WRITE:
  const [newHighscoreEntry, setNewHighscoreEntry] = useState(false);
  const [recordCheckIsDone, setRecordCheckIsDone] = useState(false);
  const [competitionCountIsUpdated, setCompetitionCountIsUpdated] = useState(false);
  // USER AUTH INFO:
  const [userUid, setUserUid] = useState("");
  const [userName, setUserName] = useState("guest");
  const [userCharacter, setUserCharacter] = useState("");
  // GROUP INFO:
  const [groupName, setGroupName] = useState();
  const [groupCode, setGroupCode] = useState();
  // STAGES AND TRIGGERS:
  const [mode, setMode] = useState(); // addition/subtraction/division/multiplication
  const [competitionStage, setCompetitionStage] = useState("mounted"); // mounted -> readySetGo -> running -> completed
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeElapsedArray, setTimeElapsedArray] = useState([]);
  const [calculationsSolved, setCalculationsSolved] = useState(0);
  // QUESTIONS AND ANSWERS:
  const [questionStrings, setQuestionStrings] = useState([]);
  const [errorArray, setErrorArray] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentSolution, setCurrentSolution] = useState("");
  const [calculationLogArray, setCalculationLogArray] = useState([]);
  //SPEEDOMETER
  const [speedometerSpeed, setSpeedometerSpeed] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  //#endregion

  //#region GET USER AUTH STATUS AND INFO --------------------------------------

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserUid(authContext.currentUser.uid);
      setUserName(authContext.currentUser.displayName);
    } else {
      setGroupName("public");
    }
  }, [authContext]);
  //#endregion

  //#region GET AND PROCESS PREVIOUS USER COMPETITION INFO FROM DB/GROUPS ------

  // Generate highscore database path:
  useEffect(() => {
    if (groupCode && userUid) {
      setHighscoreDbPath("/groups/" + groupCode + "/highscore/" + userUid);
    }
  }, [groupCode, userUid]);

  // Props function for the db provider:
  const getHighscoreDbSnapshot = (dbProviderData) => {
    setDbHighscoreSnapshot(dbProviderData);
    console.log("get high score data from db/groups: ");
    console.log(dbProviderData);
  };

  const clearAllFields = () => {
    setCpmAdd(0);
    setCpmSub(0);
    setCpmMul(0);
    setCpmDiv(0);
    setCountAdd(0);
    setCountSub(0);
    setCountMul(0);
    setCountDiv(0);
    setCountTotal(0);
  };
  useEffect(() => {
    if (!!dbHighscoreSnapshot) {
      setCpmAdd(dbHighscoreSnapshot.cpm_add);
      setCpmSub(dbHighscoreSnapshot.cpm_sub);
      setCpmMul(dbHighscoreSnapshot.cpm_mul);
      setCpmDiv(dbHighscoreSnapshot.cpm_div);
      setCountAdd(dbHighscoreSnapshot.count_add);
      setCountSub(dbHighscoreSnapshot.count_sub);
      setCountMul(dbHighscoreSnapshot.count_mul);
      setCountDiv(dbHighscoreSnapshot.count_div);
      setCountTotal(dbHighscoreSnapshot.count_total);
    } else {
      console.log("no previous data found in db/.../highscore/user");
      clearAllFields();
    }
  }, [dbHighscoreSnapshot]);

  //#endregion

  //#region WRITE COMPETITION INFO TO DB/GROUPS --------------------------------

  const calculateNewAverage = useCallback(() => {
    const newAverage = (cpmAdd + cpmSub + cpmMul + cpmDiv) / 4;
    return newAverage;
  }, [cpmAdd, cpmDiv, cpmMul, cpmSub]);

  const createNewDbEntry = useCallback(() => {
    setNewHighscoreEntry({
      cpm_add: cpmAdd,
      cpm_avg: calculateNewAverage(),
      cpm_div: cpmDiv,
      cpm_mul: cpmMul,
      cpm_sub: cpmSub,
      count_add: countAdd,
      count_sub: countSub,
      count_mul: countMul,
      count_div: countDiv,
      count_total: countTotal,
      character: userCharacter,
      name: userName,
      timestamp: new Date(),
    });
  }, [
    calculateNewAverage,
    countAdd,
    countDiv,
    countMul,
    countSub,
    countTotal,
    cpmAdd,
    cpmDiv,
    cpmMul,
    cpmSub,
    userCharacter,
    userName,
  ]);

  // Create new db entry:
  useEffect(() => {
    if (recordCheckIsDone && competitionCountIsUpdated) {
      createNewDbEntry(); // triggers databaseProvider update
    }
  }, [competitionCountIsUpdated, recordCheckIsDone, createNewDbEntry]);
  //#endregion

  //#region CHECK FOR RECORDS --------------------------------------------------

  const showRecordMessage = () => {
    setTimeout(
      () => alert("SUPER! ...DU HAST EINEN NEUEN PERSöNLICHEN REKORD GEMACHT !!! :-)"),
      100
    ); // timeout to allow page refresh before alert
  };

  const checkForNewRecord = useCallback(() => {
    switch (mode) {
      case "addition":
        if (calculationsSolved > cpmAdd) {
          setCpmAdd(calculationsSolved);
          showRecordMessage();
        }
        break;
      case "subtraction":
        if (calculationsSolved > cpmSub) {
          setCpmSub(calculationsSolved);
          showRecordMessage();
        }
        break;
      case "multiplication":
        if (calculationsSolved > cpmMul) {
          setCpmMul(calculationsSolved);
          showRecordMessage();
        }
        break;
      case "division":
        if (calculationsSolved > cpmDiv) {
          setCpmDiv(calculationsSolved);
          showRecordMessage();
        }
        break;
      default:
        console.log("this was not a new record");
        break;
    }
    setRecordCheckIsDone(true);
  }, [mode, calculationsSolved, cpmAdd, cpmDiv, cpmMul, cpmSub]);

  //#endregion

  //#region GET USER'S AVATAR AND FAVORITE GROUP FROM DB/USERS -----------------

  // Generate user database path:
  useEffect(() => {
    if (userUid) {
      setUserDbPath("/users/" + userUid);
    }
  }, [userUid]);

  const getUserInfoFromDb = (dbProviderData) => {
    console.log("get user data from db/user:");
    if (dbProviderData) {
      try {
        setUserCharacter(dbProviderData.character);
        setGroupName(dbProviderData.favorite_group.name);
        setGroupCode(dbProviderData.favorite_group.code);
      } catch (e) {
        console.log(e);
      }
    }
  };
  //#endregion

  //#region VARIOUS ------------------------------------------------------------

  const selectMode = (mode) => {
    setMode(mode);
  };

  const getNewCalculation = useCallback(() => {
    let isDuplicate = true;
    let _questionStrings = questionStrings;
    let newQuestion = 0;
    let newSolution = 0;
    while (isDuplicate) {
      generateCalculations.generateNewCalculation(mode);
      newQuestion = generateCalculations.getQuestion();
      newSolution = generateCalculations.getSolution();

      if (_questionStrings.includes(newQuestion)) {
        console.log("duplicate found" + newQuestion);
      } else {
        isDuplicate = false;
      }
    }
    questionStrings.push(newQuestion);
    setQuestionStrings(questionStrings);
    setCurrentQuestion(newQuestion);
    setCurrentSolution(newSolution);
  }, [mode, questionStrings]);

  // Generate new calculation if mode changed:
  useEffect(() => {
    if (mode) {
      getNewCalculation();
    }
  }, [mode, getNewCalculation]);

  const countOneUp = () => {
    setCalculationsSolved(calculationsSolved + 1);
  };

  // Calculate speed when competition is running:
  useEffect(() => {
    setCurrentSpeed(1);
    let cpm = 0;
    if (timeElapsed) {
      cpm = Math.round((calculationsSolved * 60) / timeElapsed);
    }
    setCurrentSpeed(cpm);
  }, [calculationsSolved, timeElapsed]);

  const updateTimeElapsed = (_timeElapsed) => {
    setTimeElapsed(_timeElapsed);
  };

  //#endregion

  //#region SPEEDOMETER --------------------------------------------------------

  // Set speedometer max value:
  const setRecordValueOfCurrentMode = useCallback(() => {
    let recordCpm = 0;
    if (mode === "addition") {
      recordCpm = cpmAdd;
    }
    if (mode === "subtraction") {
      recordCpm = cpmSub;
    }
    if (mode === "multiplication") {
      recordCpm = cpmMul;
    }
    if (mode === "division") {
      recordCpm = cpmDiv;
    }
    setCurrentModeRecordCpm(recordCpm);
  }, [cpmAdd, cpmDiv, cpmMul, cpmSub, mode]);

  useEffect(() => {
    if (mode) {
      setRecordValueOfCurrentMode();
    }
  }, [mode, setRecordValueOfCurrentMode]);

  // Minimize speedometer overshooting:
  useEffect(() => {
    if (timeElapsed > 5) {
      setSpeedometerSpeed(currentSpeed);
    } else {
      setSpeedometerSpeed(currentModeRecordCpm / 2);
    }
  }, [currentSpeed, timeElapsed, currentModeRecordCpm]);

  //#endregion

  //#region GET DATA FOR COMPETITION FEEDBACK SUB-PAGE -------------------------

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
    // Get arrays from hooks:
    var currentIndex = calculationsSolved;
    var _timeElapsedArray = timeElapsedArray;
    var _calculationLogArray = calculationLogArray;

    // Log Current time:
    _timeElapsedArray[currentIndex] = Math.round(10 * timeElapsed) / 10;

    //Calculate time difference and update log:
    if (calculationsSolved === 1) {
      var timeDifference = _timeElapsedArray[0];
      timeDifference = Math.round(10 * timeDifference) / 10;
      _calculationLogArray[currentIndex - 1].calculationTime = timeDifference;
    }
    if (calculationsSolved > 1) {
      timeDifference = _timeElapsedArray[currentIndex - 1] - _timeElapsedArray[currentIndex - 2];
      timeDifference = Math.round(10 * timeDifference) / 10;
      _calculationLogArray[currentIndex - 1].calculationTime = timeDifference;
    }

    // Update log:
    var calculationLog = {
      questionNumber: calculationsSolved + 1,
      questionString: currentQuestion,
      solutionString: currentSolution,
      errorCount: errorArray[currentIndex],
      calculationTime: "", // not calculated yet
    };

    // Update log array:
    _calculationLogArray[currentIndex] = calculationLog;

    // Assign back to hooks:
    setCalculationLogArray(_calculationLogArray);
    setTimeElapsedArray(_timeElapsedArray);

    // }
  }, [
    calculationsSolved,
    currentQuestion,
    currentSolution,
    timeElapsedArray,
    timeElapsed,
    calculationLogArray,
    errorArray,
  ]);

  //#endregion

  //#region SET COMPETITION STAGES ---------------------------------------------

  // Triggered by a button click:
  const setStageReadySetGo = () => {
    setRecordCheckIsDone(false);
    setCompetitionCountIsUpdated(false);
    setCompetitionStage("readySetGo");
    setCalculationsSolved(0);
    setQuestionStrings([]);
  };

  // Triggered by the readySetGo component:
  const setStageRunning = () => {
    setCompetitionStage("running");
  };

  // Triggered by the countdown at 0:
  const setStageCompleted = () => {
    setCompetitionStage("completed");
    checkForNewRecord();
    updateCompetitionCounter();
  };
  //#endregion

  //#region UPDATE COMPETITION COUNT -------------------------------------------
  
  // Competitions are only counted if the user reached at least a third of his
  // record speed.

  const updateCompetitionCounter = useCallback(() => {
    if (mode === "addition") {
      if (calculationsSolved > cpmAdd / 3) {
        setCountAdd(countAdd + 1);
        setCountTotal(countTotal + 1);
      }
    }
    if (mode === "subtraction") {
      if (calculationsSolved > cpmSub / 3) {
        setCountSub(countSub + 1);
        setCountTotal(countTotal + 1);
      }
    }
    if (mode === "multiplication") {
      if (calculationsSolved > cpmMul / 3) {
        setCountMul(countMul + 1);
        setCountTotal(countTotal + 1);
      }
    }
    if (mode === "division") {
      if (calculationsSolved > cpmDiv / 3) {
        setCountDiv(countDiv + 1);
        setCountTotal(countTotal + 1);
      }
    }
    setCompetitionCountIsUpdated(true);
  }, [
    calculationsSolved,
    countAdd,
    countDiv,
    countMul,
    countSub,
    countTotal,
    cpmAdd,
    cpmDiv,
    cpmMul,
    cpmSub,
    mode,
  ]);

  //#endregion

  //#region JSX OF COMPETITION STAGES ------------------------------------------

  const stageMounted = () => {
    return <div></div>;
  };

  const stageReadySetGo = () => {
    return <ReadySetGo setStageRunning={setStageRunning} />;
  };

  const stageRunning = () => {
    return (
      <div>
        <div className="outliner">
          <QuestionDisplay questionString={currentQuestion} />

          <UserInput
            solution={currentSolution}
            getNewCalculation={getNewCalculation}
            countOneUp={countOneUp}
            markUserError={markUserError}
          />
        </div>
        <Countdown setTimeElapsed={updateTimeElapsed} setStageCompleted={setStageCompleted} />
        <Speedometer currentSpeed={speedometerSpeed} currentModeRecordCpm={currentModeRecordCpm} />
      </div>
    );
  };

  const stageCompleted = () => {
    return (
      <div>
        <CompetitionFeedback
          calculationsSolved={calculationsSolved}
          overviewArray={calculationLogArray}
        />
      </div>
    );
  };
  //#endregion

  return (
    <div>
      <DatabaseProvider
        dbPath={highscoreDbPath}
        addDbListener={false}
        updateParentFunction={getHighscoreDbSnapshot}
        updateDbData={newHighscoreEntry}
      />
      <DatabaseProvider
        dbPath={userDbPath}
        addDbListener={true}
        updateParentFunction={getUserInfoFromDb}
      />
      <Header />
      <div className="user-at-group">
        {userName}@{groupName}
      </div>
      <GroupSelector />
      <CompetitionSelector selectMode={selectMode} setStageReadySetGo={setStageReadySetGo} />
      {competitionStage === "mounted" && stageMounted()}
      {competitionStage === "readySetGo" && stageReadySetGo()}
      {competitionStage === "running" && stageRunning()}
      {competitionStage === "completed" && stageCompleted()}
    </div>
  );
}
