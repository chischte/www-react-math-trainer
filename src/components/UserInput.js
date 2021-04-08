import React, {useState} from "react";

export default function UserInput(props) {

  const [falseEntry, setFalseEntry] = useState(false);
  const [keyCount, setKeyCount] = useState();

  const setEntryFalse = () => {
    setFalseEntry(true);
  }

  const setEntryTrue = () => {
    setFalseEntry(false);
  }

  const handleUserInput = (e) => {
    e.preventDefault();

    let userInput = e.target.elements.userinput.value.trim();
    setKeyCount(Math.random()); // to clear input fueld

    if (userInput === props.solution) {
      props.getNewCalculation();
      props.countOneUp();
      setEntryTrue();
    } else {
      setEntryFalse();
      props.markUserError();
    }
  };
  return (
    <div key={keyCount}>
      <form onSubmit={handleUserInput}>
        {falseEntry ? (
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
