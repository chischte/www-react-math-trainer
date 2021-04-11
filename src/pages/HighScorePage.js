import React, { useState, useContext, useCallback, useEffect } from "react";
import firebase from "firebase";
import "firebase/auth";
import { config } from "../components/firebase/firebase";
import Header from "../components/Header";
import GroupSelector from "../components/GroupSelector";
import { AuthContext } from "../components/firebase/Auth";

// JEDI PICS:
import joda from "../pics/jedi_joda.png";
import rey from "../pics/jedi_rey.jpg";
import luke from "../pics/jedi_luke.png";
import ewok from "../pics/jedi_ewok.png";
// SITH PICS:
import emperor from "../pics/sith_emperor_sidious.png";
import darthVader from "../pics/sith_darth_vader.png";
import redTrooper from "../pics/sith_red_trooper.jpg";
import whiteTrooper from "../pics/sith_white_trooper.png";
// UNICORN PICS:
import unicorn1 from "../pics/unicorn_1st.png";
import unicorn2 from "../pics/unicorn_2nd.png";
import unicorn3 from "../pics/unicorn_3rd.png";
import unicorn4 from "../pics/unicorn_4th.png";

export default function HighscorePage() {
  const authContext = useContext(AuthContext);
  const [leadingCharacter, setLeadingCharacter] = useState();
  const [groupName, setGroupName] = useState("public");
  const [groupCode, setGroupCode] = useState("public");
  const [userName, setUserName] = useState();
  const [userUid, setUserUid] = useState();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState();
  const [highscoreAvailable, setHighscoreAvailable] = useState(false);
  const [databaseSnapshot, setDatabaseSnapshot] = useState();
  const [processedSnapshot, setProcessedSnapshot] = useState();
  const [addCpm, setAddCpm] = useState();
  const [subCpm, setSubCpm] = useState();
  const [mulCpm, setMulCpm] = useState();
  const [divCpm, setDivCpm] = useState();

  // Get users selected (favorite) group:
  useEffect(() => {
    if (userUid) {
      let ref = firebase.database().ref("/users/" + userUid);
      ref.on("value", (snapshot) => {
        const dbUserData = snapshot.val();
        if (!!dbUserData) {
          setGroupName(dbUserData.favorite_group.name);
          setGroupCode(dbUserData.favorite_group.code);
        }
      });
    }
  }, [userUid]);

  // Get snapshot of group highscore:
  const getGroupsHighscoreDbSnapshot = useCallback(() => {
    let ref = firebase.database().ref("/groups/" + groupCode + "/highscore/");
    ref.once("value", (snapshot) => {
      let _databaseSnapshot = snapshot.val();

      if (!!_databaseSnapshot) {
        // Convert object containing objects to an array of objects:
        _databaseSnapshot = Object.values(_databaseSnapshot);
        setHighscoreAvailable(true);
        setDatabaseSnapshot(_databaseSnapshot);
        console.log("update highscore info from db/groups")
      } else {
        setHighscoreAvailable(false);
      }
    });
  },[groupCode]);

  useEffect(() => {
    if (groupCode) {
      let ref = firebase.database().ref("/groups/" + groupCode + "/highscore/");
      ref.once("value", (snapshot) => {
        getGroupsHighscoreDbSnapshot(snapshot);
      });
    }
  }, [groupCode,getGroupsHighscoreDbSnapshot]);

  // Update highscore periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      getGroupsHighscoreDbSnapshot();
    }, 15000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  },[getGroupsHighscoreDbSnapshot]);

  const getCpmRecords = useCallback(() => {
    let highscoreSnapshot = databaseSnapshot;

    // Addition record:
    highscoreSnapshot.sort((a, b) => (a.cpm_add < b.cpm_add ? 1 : -1));
    let recordUser = highscoreSnapshot[0];
    setAddCpm(recordUser.cpm_add);

    // Subtraction record:
    highscoreSnapshot.sort((a, b) => (a.cpm_sub < b.cpm_sub ? 1 : -1));
    recordUser = highscoreSnapshot[0];
    setSubCpm(recordUser.cpm_sub);

    // Multiplication record:
    highscoreSnapshot.sort((a, b) => (a.cpm_mul < b.cpm_mul ? 1 : -1));
    recordUser = highscoreSnapshot[0];
    setMulCpm(recordUser.cpm_mul);

    // Division record:
    highscoreSnapshot.sort((a, b) => (a.cpm_div < b.cpm_div ? 1 : -1));
    recordUser = highscoreSnapshot[0];
    setDivCpm(recordUser.cpm_div);
    console.log("records created");
  }, [databaseSnapshot]);

  const sortAndAssignHierachy = useCallback(() => {
    let highscoreSnapshot = databaseSnapshot;

    highscoreSnapshot.sort((a, b) => (a.cpm_avg < b.cpm_avg ? 1 : -1));

    let jediRank = 1;
    let sithRank = 1;
    let unicornRank = 1;
    let index = 0;

    setLeadingCharacter(highscoreSnapshot[0].character);

    for (index = 0; index < highscoreSnapshot.length; index++) {
      let character = highscoreSnapshot[index].character;
      if (character === "sith") {
        highscoreSnapshot[index].hierarchy_rank = sithRank;
        sithRank++;
      }
      if (character === "jedi") {
        highscoreSnapshot[index].hierarchy_rank = jediRank;
        jediRank++;
      }
      if (character === "unicorn") {
        highscoreSnapshot[index].hierarchy_rank = unicornRank;
        unicornRank++;
      }
    }
    console.log("hierarchy assigned");
    setProcessedSnapshot(highscoreSnapshot);
  }, [databaseSnapshot]);

  useEffect(() => {
    if (databaseSnapshot) {
      getCpmRecords();
      sortAndAssignHierachy();
    }
  }, [databaseSnapshot, sortAndAssignHierachy, getCpmRecords]);

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserName(authContext.currentUser.displayName);
      setUserUid(authContext.currentUser.uid);
      setUserIsLoggedIn(true);
    } else {
      setUserIsLoggedIn(false);
    }
  }, [authContext]);

  const getLastSeenInfo = (timestamp) => {
    const loginDate = new Date(timestamp).getTime();
    let timeDifference = new Date().getTime() - loginDate;

    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const months = day * 30;
    const year = day * 365;
    let lastSeen;

    if (timeDifference < hour) {
      lastSeen = Math.floor(timeDifference / minute) + "min";
    } else if (timeDifference < day) {
      lastSeen = Math.floor(timeDifference / hour) + "h";
    } else if (timeDifference < 2 * week) {
      lastSeen = Math.floor(timeDifference / day) + "d";
    } else if (timeDifference < 2 * months) {
      lastSeen = "weeks";
    } else if (timeDifference < 1 * year) {
      lastSeen = "months";
    } else if (timeDifference < 2 * year) {
      lastSeen = "a year";
    } else {
      lastSeen = "years";
    }
    return lastSeen;
  };

  const createHighscoreTable = () => {
    return (
      <div>
        {!!processedSnapshot && (
          <div>
            <table className="highscore-table">
              <thead>
                <tr>
                  <th colSpan={9} className="high_th title-header">
                    HIGHSCORE @ {groupName.toUpperCase()}
                  </th>
                </tr>
                <tr>
                  <th className="high_th">#</th>
                  <th className="high_th">NAME</th>
                  <th className="high_th"></th>
                  <th className="high_th">Ø</th>
                  <th className="high_th symbol__th">+</th>
                  <th className="high_th symbol__th">−</th>
                  <th className="high_th symbol__th">&times;</th>
                  <th className="high_th symbol__th">&divide;</th>
                  <th className="high_th" style={{ fontSize: "13px" }}>
                    LAST<br></br>SEEN
                  </th>
                </tr>
              </thead>
              <tfoot>
                {processedSnapshot.map((highscore, index) => (
                  <tr key={highscore.name}>
                    <td className="high_td bold-field">
                      {index + 1 === 1 && index + 1 + "st"}
                      {index + 1 === 2 && index + 1 + "nd"}
                      {index + 1 === 3 && index + 1 + "rd"}
                      {index + 1 > 3 && index + 1 + "th"}
                    </td>
                    <td className="high_td bold-field">{highscore.name}</td>
                    <td className="high_td picture__td">
                      {(highscore.character === "sith") &
                      (highscore.hierarchy_rank === 1) ? (
                        <img className="picture" src={emperor} alt=""></img>
                      ) : (
                        <div></div>
                      )}

                      {(highscore.character === "sith") &
                      (highscore.hierarchy_rank === 2) ? (
                        <img className="picture" src={darthVader} alt=""></img>
                      ) : (
                        <div></div>
                      )}

                      {(highscore.character === "sith") &
                      (highscore.hierarchy_rank === 3) ? (
                        <img className="picture" src={redTrooper} alt=""></img>
                      ) : (
                        <div></div>
                      )}

                      {(highscore.character === "sith") &
                      (highscore.hierarchy_rank > 3) ? (
                        <img
                          className="picture"
                          src={whiteTrooper}
                          alt=""
                        ></img>
                      ) : (
                        <div></div>
                      )}

                      {(highscore.character === "jedi") &
                      (highscore.hierarchy_rank === 1) ? (
                        <img className="picture" src={joda} alt=""></img>
                      ) : (
                        <div></div>
                      )}

                      {(highscore.character === "jedi") &
                      (highscore.hierarchy_rank === 2) ? (
                        <img className="picture" src={rey} alt=""></img>
                      ) : (
                        <div></div>
                      )}
                      {(highscore.character === "jedi") &
                      (highscore.hierarchy_rank === 3) ? (
                        <img className="picture" src={luke} alt=""></img>
                      ) : (
                        <div></div>
                      )}
                      {(highscore.character === "jedi") &
                      (highscore.hierarchy_rank > 3) ? (
                        <img className="picture" src={ewok} alt=""></img>
                      ) : (
                        <div></div>
                      )}

                      {(highscore.character === "unicorn") &
                      (highscore.hierarchy_rank === 1) ? (
                        <img className="picture" src={unicorn1} alt=""></img>
                      ) : (
                        <div></div>
                      )}

                      {(highscore.character === "unicorn") &
                      (highscore.hierarchy_rank === 2) ? (
                        <img className="picture" src={unicorn2} alt=""></img>
                      ) : (
                        <div></div>
                      )}
                      {(highscore.character === "unicorn") &
                      (highscore.hierarchy_rank === 3) ? (
                        <img className="picture" src={unicorn3} alt=""></img>
                      ) : (
                        <div></div>
                      )}
                      {(highscore.character === "unicorn") &
                      (highscore.hierarchy_rank > 3) ? (
                        <img className="picture" src={unicorn4} alt=""></img>
                      ) : (
                        <div></div>
                      )}
                    </td>

                    <td className="high_td">{highscore.cpm_avg}</td>

                    {highscore.cpm_add === addCpm ? (
                      <td className="high_td record__td">
                        {highscore.cpm_add}
                      </td>
                    ) : (
                      <td className="high_td">{highscore.cpm_add}</td>
                    )}

                    {highscore.cpm_sub === subCpm ? (
                      <td className="high_td record__td">
                        {highscore.cpm_sub}
                      </td>
                    ) : (
                      <td className="high_td">{highscore.cpm_sub}</td>
                    )}

                    {highscore.cpm_mul === mulCpm ? (
                      <td className="high_td record__td">
                        {highscore.cpm_mul}
                      </td>
                    ) : (
                      <td className="high_td">{highscore.cpm_mul}</td>
                    )}

                    {highscore.cpm_div === divCpm ? (
                      <td className="high_td record__td">
                        {highscore.cpm_div}
                      </td>
                    ) : (
                      <td className="high_td">{highscore.cpm_div}</td>
                    )}

                    <td className="high_td">
                      {getLastSeenInfo(highscore.timestamp)}
                    </td>
                  </tr>
                ))}
              </tfoot>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {leadingCharacter === "unicorn" && (
        <style>{"html { background-color:rgb(251,72,169) }"}</style>
      )}
      {/* {leadingCharacter === "jedi" && (
        <style>{"html { background-color:white }"}</style>
      )} */}
      {leadingCharacter === "sith" && (
        <style>{"html { background-color:black}"}</style>
      )}
      <span className="high_pink"></span>
      <Header userIsLoggedIn={userIsLoggedIn} userName={userName} />
      <GroupSelector />
      {highscoreAvailable ? (
        createHighscoreTable()
      ) : (
        <div className="outliner_wide">
          <div className="infotext">
            In dieser Gruppe gibt es noch keine Highscore. <br></br> Mache einen
            Wettkampf um die Highscore zu erzeugen!
          </div>
        </div>
      )}
    </div>
  );
}
