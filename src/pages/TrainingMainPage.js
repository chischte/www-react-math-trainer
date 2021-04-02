import React from "react";
import Header from "../components/Header";
import TrainingSelector from "../components/training/TrainingSelector";

function TrainingMainPage(){
   

    
        return (
            <div>
                <Header/>
                <br></br>
                TRAINING
                <br></br>
                <br></br>
                <TrainingSelector></TrainingSelector>
            </div>
        );
    
}

export default TrainingMainPage
