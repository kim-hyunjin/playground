import React from 'react';
import {useState} from 'react';
import TestChild from './TestChild';

const TestComponent = () => {
  const [company, setCompany] = useState(['삼성', '현대']);

  const handleSetCompany = (data) => {
    setCompany(data)
  };

  return (
    <div>
      <TestChild data={company} setCompany={handleSetCompany}></TestChild>
    </div>
  );
};

export default TestComponent;