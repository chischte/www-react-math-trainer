import React, { useEffect, useState, useContext, useCallback } from "react";
import firebase from "firebase";
import { AuthContext } from "../components/firebase/Auth";
import GenerateCalculations from "../calculation_generator/generateCalculations";
import Countdown from "../components/competition/Countdown";
import QuestionDisplay from "../components/QuestionDisplay";
import CompetitionSelector from "../components/competition/CompetitionSelector";
import ReadySetGo from "../components/competition/ReadySetGo";
import CompetitionFeedback from "../pages/CompetitionFeedbackSubPage";
import UserInput from "../components/UserInput";
import Header from "../components/Header";
import ShowSpeed from "../components/competition/ShowSpeed";

const generateCalculations = new GenerateCalculations();

export default function CompetitionPage() {
  const authContext = useContext(AuthContext);

  //#region useState HOOKS -------------------------------------------------------
  const [recordCheckIsEnabled, setRecordCheckIsEnabled] = useState(false);
  const [competitionCountIsEnabled, setCompetitionCountIsEnabled] = useState(
    false
  );
  const [checkForRecordTrack, setCheckForRecordTrack] = useState(false);
  const [dbWriteDataIsReady, setDbWriteDataIsReady] = useState(false);
  const [groupDbSnapshotIsCreated, setGroupDbSnapshotIsCreated] = useState(
    false
  );
  const [cpmSub, setCpmSub] = useState(0);
  const [cpmAdd, setCpmAdd] = useState(0);
  const [cpmDiv, setCpmDiv] = useState(0);
  const [countAdd, setCountAdd] = useState(0);
  const [countSub, setCountSub] = useState(0);
  const [countMul, setCountMul] = useState(0);
  const [countDiv, setCountDiv] = useState(0);
  const [countTotal, setCountTotal] = useState(0);
  const [groupName, setGroupName] = useState("public");
  const [groupCode, setGroupCode] = useState("public");
  const [questionStrings, setQuestionStrings] = useState([]);
  const [calculationsSolved, setCalculationsSolved] = useState(0);
  const [userCharacter, setUserCharacter] = useState("");
  const [userName, setUserName] = useState("guest");
  const [userUid, setUserUid] = useState("");
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [mode, setMode] = useState(); // addition/subtraction/division/multiplication
  const [competitionStage, setCompetitionStage] = useState("mounted"); // mounted -> readySetGo -> running -> completed
  const [cpmMul, setCpmMul] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [errorArray, setErrorArray] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentSolution, setCurrentSolution] = useState("");
  const [calculationLogArray, setCalculationLogArray] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeElapsedArray, setTimeElapsedArray] = useState([]);
  //#endregion

  //#region WRITE COMPETITION INFO TO DB/GROUPS -----------------------

  const calculateNewAverage = useCallback(() => {
    const newAverage = (cpmAdd + cpmSub + cpmMul + cpmDiv) / 4;
    return newAverage;
  }, [cpmAdd, cpmDiv, cpmMul, cpmSub]);

  const writeToDatabase = useCallback(() => {
    if (userIsLoggedIn && dbWriteDataIsReady) {
      let dbEntry = {
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
      };
      firebase
        .database()
        .ref("/groups/" + groupCode + "/highscore/" + userUid)
        .update(dbEntry);
      console.log("stored high score data to db/groups:");
      console.log(dbEntry);
    }
  }, [
    countAdd,
    countDiv,
    countMul,
    countSub,
    countTotal,
    cpmAdd,
    cpmDiv,
    cpmMul,
    cpmSub,
    groupCode,
    userUid,
    userCharacter,
    userName,
    dbWriteDataIsReady,
    userIsLoggedIn,
    calculateNewAverage,
  ]);

  // Monitor if DB is ready to write and initiate DB write
  useEffect(() => {
    if (userIsLoggedIn && dbWriteDataIsReady) {
      writeToDatabase();
      setDbWriteDataIsReady(false);
    }
  }, [userIsLoggedIn, dbWriteDataIsReady, writeToDatabase]);
  //#endregion

  //#region CHECK FOR RECORDS --------------------------------------------------

  const setRecordValueOfCurrentMode = () => {
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
  };

  const checkForAdditionRecord = useCallback(() => {
    if (cpmAdd < calculationsSolved) {
      setCpmAdd(calculationsSolved);
      alert(
        "SUPER! ...DU HAST EINEN NEUEN PERSöNLICHEN REKORD GEMACHT !!! :-)"
      );
    }
  }, [calculationsSolved, cpmAdd]);

  const checkForSubtractionRecord = useCallback(() => {
    if (cpmSub < calculationsSolved) {
      setCpmSub(calculationsSolved);
      alert(
        "SUPER! ...DU HAST EINEN NEUEN PERSöNLICHEN REKORD GEMACHT !!! :-)"
      );
    }
  }, [calculationsSolved, cpmSub]);

  const checkForMultiplicationRecord = useCallback(() => {
    if (cpmMul < calculationsSolved) {
      setCpmMul(calculationsSolved);
      alert(
        "SUPER! ...DU HAST EINEN NEUEN PERSöNLICHEN REKORD GEMACHT !!! :-)"
      );
    }
  }, [calculationsSolved, cpmMul]);

  const checkForDivisionRecord = useCallback(() => {
    if (cpmDiv < calculationsSolved) {
      setCpmDiv(calculationsSolved);
      alert(
        "SUPER! ...DU HAST EINEN NEUEN PERSöNLICHEN REKORD GEMACHT !!! :-)"
      );
    }
  }, [calculationsSolved, cpmDiv]);

  const checkForNewRecord = useCallback(() => {
    if (mode === "addition") {
      checkForAdditionRecord();
    }
    if (mode === "subtraction") {
      checkForSubtractionRecord();
    }
    if (mode === "multiplication") {
      checkForMultiplicationRecord();
    }
    if (mode === "division") {
      checkForDivisionRecord();
    }
  }, [
    checkForAdditionRecord,
    checkForSubtractionRecord,
    checkForMultiplicationRecord,
    checkForDivisionRecord,
    mode,
  ]);

  useEffect(() => {
    if (recordCheckIsEnabled) {
      setRecordCheckIsEnabled(false);
      checkForNewRecord();
    }
  }, [checkForNewRecord, checkForRecordTrack, recordCheckIsEnabled]);
  //#endregion

  //#region GET PREVIOUS USER COMPETITION INFO FROM DB/GROUPS ------------------

  const getGroupsHighscoreDB = useCallback(
    (uid) => {
      let ref = firebase
        .database()
        .ref("/groups/" + groupCode + "/highscore/" + uid);
      ref.once("value", (snapshot) => {
        const dbUserData = snapshot.val();
        console.log("get high score data from db/groups: ");
        console.log(dbUserData);

        if (!!dbUserData) {
          setCpmAdd(dbUserData.cpm_add);
          setCpmSub(dbUserData.cpm_sub);
          setCpmMul(dbUserData.cpm_mul);
          setCpmDiv(dbUserData.cpm_div);
          setCountAdd(dbUserData.count_add);
          setCountSub(dbUserData.count_sub);
          setCountMul(dbUserData.count_mul);
          setCountDiv(dbUserData.count_div);
          setCountTotal(dbUserData.count_total);
          setUserCharacter(dbUserData.character);
          setUserName(dbUserData.name);
        } else {
          // no group highscore created yet, clear fields:
          setCpmAdd(0);
          setCpmSub(0);
          setCpmMul(0);
          setCpmDiv(0);
          setCountAdd(0);
          setCountSub(0);
          setCountMul(0);
          setCountDiv(0);
          setCountTotal(0);
        }
      });
    },
    [groupCode]
  );

  // Get DB /groups data:
  useEffect(() => {
    if (userUid && !groupDbSnapshotIsCreated) {
      getGroupsHighscoreDB(userUid);
      setGroupDbSnapshotIsCreated(true);
    }
  }, [userUid, getGroupsHighscoreDB, groupDbSnapshotIsCreated]);
  //#endregion

  //#region GET USER'S NAME AVATAR FAVORITE GROUP FROM DB/USERS ----------------

  const getUsersDB = useCallback((uid) => {
    var dbUserData = 0;
    let ref = firebase.database().ref("/users/" + uid);
    ref.once("value", (snapshot) => {
      dbUserData = snapshot.val();
      console.log("get user data from db/user:");
      console.log(dbUserData);
    });
    if (!!dbUserData) {
      try {
        setUserName(dbUserData.name);
        setUserCharacter(dbUserData.character);
        setGroupName(dbUserData.favorite_group.name);
        setGroupCode(dbUserData.favorite_group.code);
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  // Get DB /user data:
  useEffect(() => {
    if (userUid) {
      getUsersDB(userUid);
    }
  }, [userUid, getUsersDB]);

  //#endregion

  //#region GET USER AUTH STATUS AND INFO --------------------------------------

  useEffect(() => {
    if (!!authContext.currentUser) {
      const uid = authContext.currentUser.uid;
      setUserUid(uid);
      setUserIsLoggedIn(true);
    } else {
      setUserIsLoggedIn(false);
    }
  }, [authContext]);
  //#endregion

  //#region VARIOUS ------------------------------------------------------------

  const selectMode = (mode) => {
    setMode(mode);
    setRecordValueOfCurrentMode();
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
    setCheckForRecordTrack(true);
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
      timeDifference =
        _timeElapsedArray[currentIndex - 1] -
        _timeElapsedArray[currentIndex - 2];
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
    setCompetitionStage("readySetGo");
    setCalculationsSolved(0);
    setQuestionStrings([]);
  };

  const setStageRunning = () => {
    setCompetitionStage("running");
  };

  const setStageCompleted = () => {
    setCompetitionStage("completed");
    setRecordCheckIsEnabled(true);
    setCompetitionCountIsEnabled(true);
  };

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
    setDbWriteDataIsReady(true);
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

  useEffect(() => {
    if (competitionCountIsEnabled) {
      updateCompetitionCounter();
      setCompetitionCountIsEnabled(false);
    }
  }, [competitionCountIsEnabled, updateCompetitionCounter]);

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
        <ShowSpeed
          calculationsSolved={calculationsSolved}
          currentSpeed={currentSpeed}
        />
        <Countdown
          setTimeElapsed={updateTimeElapsed}
          setStageCompleted={setStageCompleted}
        />
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
      <br></br>
      <div className="user-at-group">
        {userName}@{groupName}
      </div>
      <CompetitionSelector
        selectMode={selectMode}
        setStageReadySetGo={setStageReadySetGo}
      />
      {competitionStage === "mounted" && stageMounted()}
      {competitionStage === "readySetGo" && stageReadySetGo()}
      {competitionStage === "running" && stageRunning()}
      {competitionStage === "completed" && stageCompleted()}
    </div>
  );
}
