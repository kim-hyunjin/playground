import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import TagsInput from "./components/TagsInput";

function App() {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className="App">
      <TagsInput onTagsChange={setTags} />
      <ul>
        {tags.map((tag, i) => (
          <h1 key={i}>{tag}</h1>
        ))}
      </ul>
      <button
        onClick={() => {
          alert(tags);
        }}
      >
        SEND
      </button>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
