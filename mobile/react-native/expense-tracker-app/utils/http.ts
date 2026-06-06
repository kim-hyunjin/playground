import axios from 'axios';
import { Expense, NewExpense } from '../types/expense';

const instance = axios.create({
  baseURL: 'https://test-7f765-default-rtdb.asia-southeast1.firebasedatabase.app/',
});

export async function storeExpense(expenseData: NewExpense) {
  const { data } = await instance.post('expenses.json', expenseData);
  const id = data.name;
  return String(id);
}

export async function fetchExpenses() {
  const { data } = await instance.get('expenses.json');

  const expenses: Expense[] = [];

  for (const key in data) {
    const expenseObj = {
      id: key,
      amount: data[key].amount,
      date: new Date(data[key].date),
      description: data[key].description,
    };
    expenses.push(expenseObj);
  }

  return expenses;
}

export function updateExpense(expenseData: Expense) {
  return instance.put(`expenses/${expenseData.id}.json`, expenseData);
}

export async function deleteExpense(id: string) {
  return instance.delete(`expenses/${id}.json`);
}
