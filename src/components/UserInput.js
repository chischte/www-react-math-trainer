import React from "react";

export default class UserInput extends React.Component {
  state = { falseEntry: false };

  setEntryFalse() {
    this.setState(() => ({ falseEntry: true }));
  }

  setEntryTrue() {
    this.setState(() => ({ falseEntry: false }));
  }

  handleUserInput = (e) => {
    e.preventDefault();

    let userInput = e.target.elements.userinput.value.trim();
    this.keycount = Math.random(); // to clear input fueld

    if (userInput == this.props.solution) {
      this.props.getNewCalculation();
      this.props.countOneUp();
      this.setEntryTrue();
    } else {
      this.setEntryFalse();
    }
  };
  render() {
    return (
      <div key={this.keycount}>
        <form onSubmit={this.handleUserInput}>
          {this.state.falseEntry ? (
            <input
              className="input-field input-field__red"
              autoComplete="off"
              autoFocus
              type="text"
              name="userinput"
              defaultValue={""}
            />
          ) : (
              <input
                className="input-field input-field__black"
                autoFocus
                type="text"
                name="userinput"
                autoComplete="off"
                defaultValue={""}
              />
            )}
        </form>
      </div>
    );
  }
}
