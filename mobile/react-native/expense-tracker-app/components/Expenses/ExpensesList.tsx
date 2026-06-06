import { FlatList, ListRenderItemInfo } from 'react-native';
import { Expense } from '../../types/expense';
import ExpenseItem from './ExpenseItem';

type Props = {
  expenses: Expense[];
};
export default function ExpensesList({ expenses }: Props) {
  const renderExpenseItem = ({ item }: ListRenderItemInfo<Expense>) => {
    return <ExpenseItem expense={item} />;
  };

  return <FlatList data={expenses} renderItem={renderExpenseItem} keyExtractor={keyExtractor} />;
}

function keyExtractor(item: Expense, index: number) {
  return item.id;
}
