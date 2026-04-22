import React, { useMemo, useState } from 'react';
import { useCallback } from 'react';

import './App.css';
import DemoList from './components/Demo/DemoList';
import DemoOutput from './components/Demo/DemoOutput';
import Button from './components/UI/Button/Button';

function App() {
  const [showParagraph, setShowParagraph] = useState();
  const [allowToggle, setAllowToggle] = useState(false);
  const [listTitle, setListTitle] = useState('My List');

  console.log('APP running');

  const toggleParagraphHandler = useCallback(() => {
    if (allowToggle) {
      setShowParagraph((prev) => !prev);
    }
  }, [allowToggle]); // allowToggle 값이 바뀔 때마다 새로운 함수를 만들어야 한다. 메모리에 저장되어 있는 함수는 이전 allowToggle값을 가지고 있다.(클로저)
  // CHECK THIS : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures

  const allowToggleHandler = useCallback(() => {
    setAllowToggle(true);
  }, []);

  const changeTitleHandler = useCallback(() => {
    setListTitle('New Title');
  }, []);

  // we don't have to make same array every time. so, memorize it!
  const listItems = useMemo(() => [5, 3, 1, 10, 9], []);

  return (
    <div className="app">
      <h1>Hi there!</h1>
      <DemoList title={listTitle} items={listItems} />
      <DemoOutput show={showParagraph} />
      <Button onClick={allowToggleHandler}>Allow Toggle</Button>
      <Button onClick={toggleParagraphHandler}>Show Paragraph!</Button>
      <Button onClick={changeTitleHandler}>Change List Title</Button>
    </div>
  );
}

export default App;
