import React, { useState } from 'react';

import ExpenseForm from './ExpenseForm';
import './NewExpense.css';

const NewExpense = ({ onAddExpense }) => {
  const [showForm, setShowForm] = useState(false);

  const saveExpenseDataHandler = (data) => {
    const expenseData = {
      ...data,
      id: Math.random().toString(),
    };
    onAddExpense(expenseData);
  };

  const cancelHandler = () => {
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm((val) => {
      return !val;
    });
  };

  return (
    <div className="new-expense">
      {showForm && (
        <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} onCancel={cancelHandler} />
      )}
      {!showForm && <button onClick={() => toggleForm()}>Add New Expense</button>}
    </div>
  );
};

export default NewExpense;
