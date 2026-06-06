import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteName } from './route-name';
import ManageExpense from '../screens/ManageExpense';
import BottomTabsNavigator from './ButtomTabsNavigator';
import { GlobalStyles } from '../constants/styles';
import { StackParamList } from './types';

const Stack = createNativeStackNavigator<StackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name={RouteName.EXPENSE_OVERVIEW}
        component={BottomTabsNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={RouteName.MANAGE_EXPENSE}
        component={ManageExpense}
        options={{
          title: 'Manage Expense',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
