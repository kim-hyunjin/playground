import React from 'react';
import {Route} from 'react-router-dom';
import NewsPage from './pages/NewsPage';
import TestComponent from './components/TestComponent';

function App() {

  return (
    <div>
    <Route exact path="/test" component={TestComponent} />
    <Route path="/news/:category?" component={NewsPage} />
    </div>
  );
}

export default App;
