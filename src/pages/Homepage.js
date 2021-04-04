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
            </div>
        );
    }
}
