import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../components/firebase/Auth";

export default function CompetitionFeedback(props) {
  const authContext = useContext(AuthContext);

  const [overviewArray] = useState(props.overviewArray);
  const [userName, setUserName] = useState();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserName(authContext.currentUser.displayName);
      setUserIsLoggedIn(true);
    } else {
      setUserName("guest");
      setUserIsLoggedIn(false);
    }
  }, [authContext]);

  return (
    <div>
      <div className="show-congrats">
        <div className="show-congrats__haudi">
          HaudiHo {userName}! 
          <h5>
            du hast{" "}
            <span className="show-congrats__count">
              {" "}
              {props.calculationsSolved}{" "}
            </span>{" "}
            Rechnungen<br/>in einer Minute gelöst!
          </h5>
        </div>
      </div>

      <br></br>
      <table className="after-training-table">
        <thead>
          <tr>
            <th colSpan={4} className="tra_th title-header">
              AUSWERTUNG
            </th>
          </tr>
          <tr>
            <th className="tra_th">#</th>
            <th className="tra_th">Rechnung</th>
            <th className="tra_th">Zeit</th>
            <th className="tra_th">Fehler</th>
          </tr>
        </thead>
        <tfoot>
          {overviewArray.map((array, index) => (
            <tr key={array[4]}>
              <td className="tra_td">{array[4]}</td>
              <td className="tra_td">{array[0]}</td>
              {index < 3 ? (
                <td className="tra_td error_td">{array[2]}s</td>
              ) : (
                <td className="tra_td">{array[2]}s</td>
              )}

              {array[3] === true ? (
                <td className="tra_td error_td">&times;</td>
              ) : (
                <td className="tra_td"></td>
              )}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}
