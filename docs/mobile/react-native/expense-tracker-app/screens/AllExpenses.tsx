import { useContext } from 'react';
import ExpensesOutput from '../components/Expenses/ExpensesOutput';
import { ExpensesContext } from '../store/context/expenses-context';

export default function AllExpenses() {
  const expenseCtx = useContext(ExpensesContext);
  return (
    <ExpensesOutput
      expenses={expenseCtx.expenses}
      expensePeriod='Total'
      fallbackText='No registered expenses found'
    />
  );
}
