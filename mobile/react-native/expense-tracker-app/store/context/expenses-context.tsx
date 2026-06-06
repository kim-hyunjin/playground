import { ReactNode, createContext, useReducer } from 'react';
import { Expense } from '../../types/expense';

type ExpenseContextProps = {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (newExpense: Expense) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (expense: Expense) => void;
};

export const ExpensesContext = createContext<ExpenseContextProps>({
  expenses: [],
  setExpenses: () => {},
  addExpense: () => {},
  deleteExpense: () => {},
  updateExpense: () => {},
});

export interface SetExpensesAction {
  type: 'set';
  payload: Expense[];
}
export interface AddExpenseAction {
  type: 'add';
  payload: Expense;
}
export interface DeleteExpenseAction {
  type: 'delete';
  payload: string;
}
export interface UpdateExpenseAction {
  type: 'update';
  payload: Expense;
}
export type ExpenseActions =
  | SetExpensesAction
  | AddExpenseAction
  | DeleteExpenseAction
  | UpdateExpenseAction;

function expensesReducer(expenses: Expense[], action: ExpenseActions) {
  switch (action.type) {
    case 'set':
      const inverted = action.payload.reverse();
      return inverted;
    case 'add':
      const id = new Date().toString() + Math.random().toString();
      return [{ ...action.payload, id }, ...expenses];
    case 'delete':
      return expenses.filter((ex) => ex.id !== action.payload);
    case 'update':
      const updatableIndex = expenses.findIndex((ex) => ex.id === action.payload.id);
      const updatableExpense = expenses[updatableIndex];
      const updatedItem = { ...updatableExpense, ...action.payload };
      const updatedExpenses = [...expenses];
      updatedExpenses[updatableIndex] = updatedItem;
      return updatedExpenses;
    default:
      return expenses;
  }
}

export default function ExpensesContextProvider({ children }: { children: ReactNode }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  const setExpenses = (expenses: Expense[]) => {
    dispatch({
      type: 'set',
      payload: expenses,
    });
  };
  const addExpense = (newExpense: Expense) => {
    dispatch({
      type: 'add',
      payload: newExpense,
    });
  };
  const deleteExpense = (id: string) => {
    dispatch({
      type: 'delete',
      payload: id,
    });
  };
  const updateExpense = (expense: Expense) => {
    dispatch({
      type: 'update',
      payload: expense,
    });
  };
  const value: ExpenseContextProps = {
    expenses: expensesState,
    setExpenses,
    addExpense,
    deleteExpense,
    updateExpense,
  };

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}
