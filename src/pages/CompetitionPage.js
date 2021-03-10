import React from "react";
import Header from "../components/Header";
import Example from "../components/Example"

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
                <Example/>
                WETTKAMPF
            </div>
        );
    }
}
