# Diving Deeper

## React fragment, custom wrapper

- we don't need to use unnecessary div tag  
  => use React.Fragment or <></>

## potals

react-dom의 createPortal을 사용해 다른 dom에 리액트 컴포넌트를 렌더링할 수 있다.  
modal과 같이 컴포넌트가 따로 떨어져서 노는 경우 다른 dom으로 분리하면 좋음

## Ref

입력값을 state로 관리해야하는 특별한 이유가 없다면 ref를 사용하는 것도 좋다. (더 적은 코드로 동일한 동작을 할 수 있음)
