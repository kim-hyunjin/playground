import React, {createContext, useState} from 'react';

const ColorContext = createContext({ // Provider 미제공시 사용될 기본값
  state: {color: 'black', subcolor: 'red'},
  actions: {
    setColor: () => {},
    setSubcolor: () => {}
  }
});

const ColorProvider = ({children}) => {
  const [color, setColor] = useState('black');
  const [subcolor, setSubcolor] = useState('red');

  const value = {
    state: {color, subcolor},
    actions: {setColor, setSubcolor}
  };

  return (
    <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
  );
};

const {Consumer: ColorConsumer} = ColorContext; // const ColorConsumer = ColorContext.Consumer

export {ColorProvider, ColorConsumer};

export default ColorContext;