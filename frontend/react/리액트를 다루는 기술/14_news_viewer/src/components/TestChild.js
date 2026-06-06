import React from 'react';

const TestChild = ({data, setCompany}) => {

  const handleClick = () => {
    setCompany(['현대', '삼성'])
  }

  return (
    <>
    <h1>{data}</h1>
    <button onClick={handleClick}>부모 상태 값 바꾸기</button>
    </>
  );
}

export default TestChild