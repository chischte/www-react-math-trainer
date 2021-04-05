import React, { useEffect, useState } from "react";
function TrainingFeedback(props){

    const[overviewArray,setOverviewArray]=useState(props.overviewArray);


useEffect(()=>{
    setOverviewArray(props.overviewArray)

},[props])

const getRpm = () => {
    const calculationsSolved=props.overviewArray.length;
    const rpm = Math.round(60 / (props.totalTrainingTime / calculationsSolved));
    return rpm;
  };


return(
    <div>
    Super, du hast das Training geschafft!
    <br></br>
    Tip: Schreibe dir die langsamsten und falsch gelösten Rechnungen auf!
    <br></br>
    Geschwindigkeit: {getRpm()} rpm
    <br></br>
    (rpm = Rechnungen pro Minute)
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
)

}
export default TrainingFeedback;