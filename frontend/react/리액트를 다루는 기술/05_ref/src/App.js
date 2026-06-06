import React from 'react';
import ScrollBox from './ScrollBox';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <ScrollBox ref={(ref) => {this.scrollBox = ref}}></ScrollBox>
        <button onClick={() => this.scrollBox.scrollToBottom()}>맨 밑으로</button>
      </div>
    );
  }
}

export default App;
