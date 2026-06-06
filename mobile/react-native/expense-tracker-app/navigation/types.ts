import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RouteName } from './route-name';

export type ButtomTabParamList = {
  [RouteName.RECENT_EXPENSE]: undefined;
  [RouteName.ALL_EXPENSE]: undefined;
};

export type StackParamList = {
  [RouteName.EXPENSE_OVERVIEW]: undefined;
  [RouteName.MANAGE_EXPENSE]: {
    expenseId: string;
  };
};

export type RecentExpenseScreenProps = BottomTabScreenProps<
  ButtomTabParamList,
  RouteName.RECENT_EXPENSE
>;

export type AllExpenseScreenProps = BottomTabScreenProps<ButtomTabParamList, RouteName.ALL_EXPENSE>;

export type ManageExpenseScreenProps = NativeStackScreenProps<
  StackParamList,
  RouteName.MANAGE_EXPENSE
>;
