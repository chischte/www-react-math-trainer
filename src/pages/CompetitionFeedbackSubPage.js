import React, { useEffect, useState, useContext} from "react";
import { AuthContext } from "../components/firebase/Auth";

export default function CompetitionFeedback(props) {
  const authContext = useContext(AuthContext);

  const [overviewArray] = useState(props.overviewArray);
  const [userName, setUserName] = useState();

  useEffect(() => {
    if (!!authContext.currentUser) {
      setUserName(authContext.currentUser.displayName);
    } else {
      setUserName("guest");
    }
  }, [authContext]);

  // Sort overview array by calculation time:
  useEffect(() => {
    overviewArray.pop(); //last calculation entry is unsolved
    overviewArray.sort(function (a, b) {
      return b.calculationTime - a.calculationTime;
    });
  }, [overviewArray]);

  return (
    <div>
      <div className="show-congrats">
        <div className="show-congrats__haudi">
          HaudiHo {userName}!
          <h5>
            Du hast{" "}
            <span className="show-congrats__count">
              {" "}
              {props.calculationsSolved}{" "}
            </span>{" "}
            Rechnungen
            <br />
            in einer Minute gelöst!
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
              <td className="tra_td">{array.questionNumber}</td>
              <td className="tra_td">{array.questionString}</td>
              {index < 3 ? (
                <td className="tra_td error_td">{array.calculationTime}s</td>
              ) : (
                <td className="tra_td">{array.calculationTime}s</td>
              )}

              {array.errorCount >= 1 ? (
                <td className="tra_td error_td">{array.errorCount}</td>
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
