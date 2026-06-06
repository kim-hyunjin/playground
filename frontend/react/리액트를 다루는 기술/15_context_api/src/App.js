import React from 'react';
import ColorBox from './components/ColorBox';
import SelectColors from './components/SelectColor';
import { ColorProvider } from './contexts/color';

function App() {
  return (
    <ColorProvider>
      <div className="App">
        <SelectColors />
        <ColorBox />
      </div>
    </ColorProvider>
  );
}

export default App;
