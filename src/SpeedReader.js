import React from "react";

export default class extends React.Component {
  initialState = {
    sentences:
      "You have a long list of things you know you should be doing regularly... But for some reason, you just don’t do them. What’s the deal? The solution is building habits. Doing hard things isn’t hard if you’re on autopilot. But how do we make building habits simple and painless?",
    words: [""],
    wordsPerMinute: 300,
    running: false,
    index: 0,
    interval: 200
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.onChange = this.onChange.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.nextWord = this.nextWord.bind(this);
    this.onRestart = this.onRestart.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    this.setState({
      ...this.initialState,
      words: this.sentencesToArray(this.initialState.sentences)
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  sentencesToArray(sentences) {
    return sentences.split(" ");
  }

  onChange(e) {
    const wordsPerMinute = e.target.value;
    this.setState({
      wordsPerMinute,
      interval: this.calculateIntervalTime(wordsPerMinute)
    });
  }

  calculateIntervalTime(wordsPerMinute) {
    return (60 / wordsPerMinute) * 1000;
  }

  nextWord() {
    if (this.state.index > this.state.words.length) {
      this.onRestart();
      return;
    }
    this.setState(state => ({ ...state, index: state.index + 1 }));
  }

  onStart() {
    this.setState({ running: true });
    this.timer = setInterval(this.nextWord, this.state.interval);
  }

  onStop() {
    clearInterval(this.timer);
    this.setState({ running: false });
  }

  onRestart() {
    clearInterval(this.timer);
    this.init();
  }

  render() {
    return (
      <div className="wrapper">
        <div className={"settings"}>
          <div className={"words-per-minute"}>
            <input
              type="tel"
              className={"input"}
              onChange={this.onChange}
              value={this.state.wordsPerMinute}
            />
            words per minute.
          </div>
          <div className={"buttons"}>
            {!this.state.running && (
              <button onClick={this.onStart}>Start</button>
            )}
            {this.state.running && <button onClick={this.onStop}>Stop</button>}
            <button onClick={this.onRestart}>Reset</button>
          </div>
        </div>
        <div className={"reader"}>
          <div className={"reader-content"}>
            {this.state.words[this.state.index]}
          </div>
        </div>
      </div>
    );
  }
}
