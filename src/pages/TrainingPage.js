import React from "react";
import Header from "../components/Header";
import TrainingSelector from "../components/training/TrainingSelector";

function TrainingPage(){

    const getDisciplineFromUrl=()=>{
        var splitUrl=window.location.href.split('/');
        return splitUrl[splitUrl.length-3];
    }

    const getLevelFromUrl=()=>{
        var splitUrl=window.location.href.split('/');
        return splitUrl[splitUrl.length-2];
    }

    const getRangeFromUrl=()=>{
        var splitUrl=window.location.href.split('/');
        return splitUrl[splitUrl.length-1];
    }
   

    
        return (
            <div>
                <Header/>
                <br></br>
                TRAINING
                <br></br>
                Discipline = {getDisciplineFromUrl()}
                <br></br>
                Level = {getLevelFromUrl()}
                <br></br>
                Range = {getRangeFromUrl()}
                <br></br>

                <br></br>
            </div>
        );
    
}

export default TrainingPage
