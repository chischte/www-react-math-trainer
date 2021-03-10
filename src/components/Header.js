import React from "react";
import { NavLink } from "react-router-dom";

export default class Header extends React.Component {
    state = {};

    componentDidMount() { }

    componentDidUpdate() { }

    render() {
        return (
            <div className="header">
                <NavLink to="/" exact={true}>
                    home
                </NavLink>

                <NavLink to="/training" >
                    training
                 </NavLink>

                <NavLink to="/competition" >
                    wettkampf
                 </NavLink>

                <NavLink to="/highscore">
                    highscore
                </NavLink>


                <NavLink to="/account" className="header_link" activeClassName="is-active">
                    account
                </NavLink>

            </div>
        );
    }
}