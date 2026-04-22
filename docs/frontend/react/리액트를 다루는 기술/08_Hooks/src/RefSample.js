import React, {useRef} from 'react';

const RefSample = () => {
  // 로컬변수를 사용할 때도 useRef를 활용할 수 있다. *로컬변수 = 렌더링과 상관없이 바뀔 수 있는 값
  const id = useRef(1);
  const setId = (n) => {
    id.current = n;
  }
  const printId = () => {
    console.log(id.current);
  }
  return (
    <div>
      RefSample
    </div>
  );
};

export default RefSample;