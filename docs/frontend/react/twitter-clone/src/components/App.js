import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'myFirebase'

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        // setUserObj(user);
        setUserObj({
          displayName: user.displayName,
          uid:user.uid,
          updateProfile: (args) => user.updateProfile(args)
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    // setUserObj(Object.assign({}, user)); // 리액트가 새 객체임을 알 수 있게 해준다.

    setUserObj({
      displayName: user.displayName,
      uid:user.uid,
      updateProfile: (args) => user.updateProfile(args)
    }); // 객체의 크기가 너무 크면 리액트에서 상태를 비교하기 어려워 리렌더링 여부를 파악할 수 없다.
  };

  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser} /> : "Initializing..."}
    </>
  )
}


export default App;
