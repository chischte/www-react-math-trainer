import React from "react";

export default class Stopwatch extends React.Component {
  state = {
    timeElapsed: "5",
  };

  clockInterval = 1000; // [ms]

  componentDidMount() {
    this.setState({
      timeElapsed: 55,
    },
      () => (this.interval = setInterval(this.clockTasks, this.clockInterval))
    )
  }
  componentWillUnmount(){
    clearInterval(this.interval);
  }

  clockTasks = () => {
    let timeElapsed = this.state.timeElapsed + this.clockInterval / 1000;

    let clockResolution = 1 / (this.clockInterval / 1000);

    timeElapsed = Math.round(timeElapsed * clockResolution) / clockResolution;

    this.setState({timeElapsed:timeElapsed});
    
    this.props.updateTimeElapsed(timeElapsed);
  }

  render() {

    return (
      <div>
          <div className="countdown">{Math.ceil(this.state.timeElapsed)}</div>
      </div>
    );
  }
}
