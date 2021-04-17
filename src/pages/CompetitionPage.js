import React, { useEffect, useState, useContext, useCallback } from "react";
import firebase from "firebase";
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

const generateCalculations = new GenerateCalculations();

export default function CompetitionPage() {
  const authContext = useContext(AuthContext);

  //#region useState HOOKS -------------------------------------------------------

  // INFOS FROM AND FOR DATABASE:
  const [dbSnapshot, setdBSnapshot] = useState();
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
  // TRIGGER DB WRITE:
  const [newHighscoreEntry, setNewHighscoreEntry] = useState(false);
  const [recordCheckIsDone, setRecordCheckIsDone] = useState(false);
  const [competitionCountIsUpdated, setCompetitionCountIsUpdated] = useState(false);
  const [dbSnapshotWasAvailable, setDbSnapshotWasAvailable] = useState(false);
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

  //#region GET PREVIOUS USER COMPETITION INFO FROM DB/GROUPS ------------------

  // Generate highscore database path:
  useEffect(() => {
    if (groupCode && userUid) {
      setHighscoreDbPath("/groups/" + groupCode + "/highscore/" + userUid);
    }
  }, [groupCode, userUid]);

  const getGroupsHighscoreDB = useCallback(() => {
    let ref = firebase.database().ref(highscoreDbPath);
    ref.once("value", (snapshot) => {
      const dbUserData = snapshot.val();
      setdBSnapshot(dbUserData);
      setDbSnapshotWasAvailable(true);
      console.log("get high score data from db/groups: ");
      console.log(dbUserData);
    });
  }, [highscoreDbPath]);

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
    if (!!dbSnapshot) {
      setCpmAdd(dbSnapshot.cpm_add);
      setCpmSub(dbSnapshot.cpm_sub);
      setCpmMul(dbSnapshot.cpm_mul);
      setCpmDiv(dbSnapshot.cpm_div);
      setCountAdd(dbSnapshot.count_add);
      setCountSub(dbSnapshot.count_sub);
      setCountMul(dbSnapshot.count_mul);
      setCountDiv(dbSnapshot.count_div);
      setCountTotal(dbSnapshot.count_total);
    } else {
      // no group highscore created yet, clear fields:
      clearAllFields();
    }
  }, [dbSnapshot]);

  // Get DB /groups data if group changed:
  useEffect(() => {
    if (userUid) {
      setDbSnapshotWasAvailable(false);
      getGroupsHighscoreDB(userUid);
    }
  }, [userUid, getGroupsHighscoreDB, groupCode]);
  //#endregion

  //#region WRITE COMPETITION INFO TO DB/GROUPS --------------------------------

  const writeToDatabase = useCallback(() => {
    firebase.database().ref(highscoreDbPath).update(newHighscoreEntry);
    console.log("stored high score data to db/groups:");
  }, [highscoreDbPath, newHighscoreEntry]);
  
  
  // Trigger db update:
  useEffect(() => {
    if (newHighscoreEntry && dbSnapshotWasAvailable && highscoreDbPath) {
      writeToDatabase();
    }
  }, [newHighscoreEntry, dbSnapshotWasAvailable, highscoreDbPath, writeToDatabase]);

 
  const calculateNewAverage = useCallback(() => {
    const newAverage = (cpmAdd + cpmSub + cpmMul + cpmDiv) / 4;
    return newAverage;
  }, [cpmAdd, cpmDiv, cpmMul, cpmSub]);

  const createNewDbEntry = () => {
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
  };

  // Create new db entry:
  useEffect(() => {
    if (
      dbSnapshotWasAvailable &&
      recordCheckIsDone &&
      competitionCountIsUpdated
    ) {
      createNewDbEntry();
    }
  }, [
    dbSnapshotWasAvailable,
    competitionCountIsUpdated,
    recordCheckIsDone,
    createNewDbEntry,
  ]);
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

  const getUsersDB = useCallback(() => {
    var dbUserData = 0;
    let ref = firebase.database().ref(userDbPath);
    ref.on("value", (snapshot) => {
      dbUserData = snapshot.val();
      console.log("get user data from db/user:");
      if (dbUserData) {
        try {
          setUserCharacter(dbUserData.character);
          setGroupName(dbUserData.favorite_group.name);
          setGroupCode(dbUserData.favorite_group.code);
        } catch (e) {
          console.log(e);
        }
      }
    });
  }, [userDbPath]);

  // Get DB /user data:
  useEffect(() => {
    if (userDbPath) {
      getUsersDB();
    }
  }, [userDbPath, getUsersDB]);

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

  //#region MANAGE COMPETITION STAGES ------------------------------------------

  const setStageReadySetGo = () => {
    setRecordCheckIsDone(false);
    setCompetitionCountIsUpdated(false);
    setCompetitionStage("readySetGo");
    setCalculationsSolved(0);
    setQuestionStrings([]);
  };

  const setStageRunning = () => {
    setCompetitionStage("running");
  };

  const setStageCompleted = () => {
    setCompetitionStage("completed");
    checkForNewRecord();
    updateCompetitionCounter();
  };

  //#region UPDATE COMPETITION COUNT -------------------------------------------

  const updateCompetitionCounter = useCallback(() => {
    if (mode === "addition") {
      if (calculationsSolved > cpmAdd / 2) {
        setCountAdd(countAdd + 1);
        setCountTotal(countTotal + 1);
      }
    }
    if (mode === "subtraction") {
      if (calculationsSolved > cpmSub / 2) {
        setCountSub(countSub + 1);
        setCountTotal(countTotal + 1);
      }
    }
    if (mode === "multiplication") {
      if (calculationsSolved > cpmMul / 2) {
        setCountMul(countMul + 1);
        setCountTotal(countTotal + 1);
      }
    }
    if (mode === "division") {
      if (calculationsSolved > cpmDiv / 2) {
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
