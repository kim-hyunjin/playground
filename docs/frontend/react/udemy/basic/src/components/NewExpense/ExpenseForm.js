import React, { useState } from 'react';

import './ExpenseForm.css';

const ExpenseForm = ({ onSaveExpenseData, onCancel }) => {
  // const [title, setTitle] = useState('');
  // const [amount, setAmount] = useState(0);
  // const [date, setDate] = useState('');
  const [userInput, setUserInput] = useState({
    title: '',
    amount: 0,
    date: '',
  });
  const titleChangeHandler = (event) => {
    // setTitle(event.target.value);
    // setUserInput({
    //   ...userInput,
    //   title: event.target.value,
    // });

    // 아래와 같이 하면 prevState가 최신 state임을 보장할 수 있다.
    setUserInput((prevState) => {
      return {
        ...prevState,
        title: event.target.value,
      };
    });
  };
  const amountChangeHandler = (event) => {
    // setAmount(Number(event.target.value));÷
    setUserInput({
      ...userInput,
      amount: Number(event.target.value),
    });
  };
  const dateChangeHandler = (event) => {
    // setDate(event.target.value);
    setUserInput({
      ...userInput,
      date: event.target.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const expenseData = {
      title: userInput.title,
      amount: userInput.amount,
      date: new Date(userInput.date),
    };
    onSaveExpenseData(expenseData);
    setUserInput({
      title: '',
      amount: 0,
      date: '',
    });
  };

  const cancleHander = (event) => {
    event.preventDefault();
    onCancel();
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="new-expense__controls">
        <div className="new-expense__control">
          <label>Title</label>
          <input type={'text'} value={userInput.title} onChange={titleChangeHandler} />
        </div>
        <div className="new-expense__control">
          <label>Amount</label>
          <input
            type={'number'}
            value={userInput.amount}
            onChange={amountChangeHandler}
            min="0.01"
            step={'0.01'}
          />
        </div>
        <div className="new-expense__control">
          <label>Date</label>
          <input
            type={'date'}
            value={userInput.date}
            onChange={dateChangeHandler}
            min="2019-01-01"
            max="2022-12-31"
          />
        </div>
      </div>
      <div className="new-expense__actions">
        <button onClick={cancleHander}>Cancel</button>
        <button type="submit">Add Expense</button>
      </div>
    </form>
  );
};

export default ExpenseForm;
