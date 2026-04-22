import React, { useEffect, useState } from 'react';

const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {}, // dummy function for better IDE auto complition
  onLogin: (email, password) => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // data fetching, storing data in storage is not directly associated with UI
  useEffect(() => {
    const storedUserLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedUserLoggedIn === '1') {
      setIsLoggedIn(true);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.setItem('isLoggedIn', '0');
    setIsLoggedIn(false);
  };

  const loginHandler = () => {
    localStorage.setItem('isLoggedIn', '1');
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, onLogout: logoutHandler, onLogin: loginHandler }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
