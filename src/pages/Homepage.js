import React from "react";
import Header from "../components/Header";

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }
    componentDidUpdate() { }


    render() {
        return (
            <div>
                <Header/>
                <br></br>
                <h3>Wilkommen beim Mathe-Trainer!</h3>
                <br></br>
                <h5>INFOS:</h5>
                <h6>Um alle Trainings nutzen zu können, musst du angemeldet sein.</h6>
                {/* <h6>Um einen Eintrag in der Highscore machen zu können, musst angemeldet sein.</h6> */}
                {/* <h6>Um einer Gruppe beitreten zu können, musst du ebenfalls angemeldet sein.</h6> */}
                <h6>Die Anmeldung ist aber kostenlos und du benötigst auch keine E-Mailadresse.</h6>
                <h6>Die Abkürzung "rpm" bedeutet Rechnungen pro Minute</h6>
                <br></br>
                <h5 style={{color:"blue"}}>(-::-) Viel Spass! (-::-)</h5>
            </div>
        );
    }
}
