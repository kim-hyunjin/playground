import Card from '../UI/Card';
import ExpensesFilter from './ExpensesFilter';
import ExpenseList from './ExpenseList';
import './Expenses.css';
import { useMemo, useState } from 'react';
import ExpensesChart from './ExpensesChart';

function Expenses({ expenses }) {
  const [selectedYear, setSelectedYear] = useState('2022');

  const filterChangeHandler = (selected) => {
    setSelectedYear(selected);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      return expense.date.getFullYear().toString() === selectedYear;
    });
  }, [expenses, selectedYear]);

  return (
    <Card className="expenses">
      <ExpensesFilter selected={selectedYear} onFilterChange={filterChangeHandler} />
      <ExpensesChart expenses={filteredExpenses} />
      <ExpenseList items={filteredExpenses} />
    </Card>
  );
}

export default Expenses;
