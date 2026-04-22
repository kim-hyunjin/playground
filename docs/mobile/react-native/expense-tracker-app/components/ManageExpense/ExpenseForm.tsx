import { View, StyleSheet, Text, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import Input from './Input';
import CustomButton from '../UI/CustomButton';

import { getFormattedDate } from '../../utils/date';
import { Expense, NewExpense } from '../../types/expense';

type Props = {
  defaultValue?: Expense;
  onCancel: () => void;
  onSubmit: (expenseData: NewExpense) => void;
};
export default function ExpenseForm({ defaultValue, onCancel, onSubmit }: Props) {
  const [inputValue, setInputValue] = useState({
    amount: defaultValue ? String(defaultValue.amount) : '',
    date: defaultValue ? getFormattedDate(defaultValue.date) : '',
    description: defaultValue?.description ?? '',
  });
  const [isInvalid, setIsInvalid] = useState({
    amount: false,
    date: false,
    description: false,
  });

  const amountChangeHandler = useCallback((enteredAmount: string) => {
    setInputValue((prev) => ({
      ...prev,
      amount: enteredAmount,
    }));
  }, []);

  const dateChangeHandler = useCallback((enteredDate: string) => {
    setInputValue((prev) => ({
      ...prev,
      date: enteredDate,
    }));
  }, []);

  const descriptionChangeHandler = useCallback((enteredDescriptoin: string) => {
    setInputValue((prev) => ({
      ...prev,
      description: enteredDescriptoin,
    }));
  }, []);

  const confirmHandler = () => {
    const expenseData = {
      amount: +inputValue.amount,
      date: new Date(inputValue.date),
      description: inputValue.description,
    };

    const amountIsInvalid = isNaN(expenseData.amount) || expenseData.amount === 0;
    const dateIsInvalid = expenseData.date.toString() === 'Invalid Date';
    const descriptionIsInvalid = expenseData.description.trim().length === 0;

    if (amountIsInvalid || dateIsInvalid || descriptionIsInvalid) {
      Alert.alert('Invalid input', 'Please check your input values');
      setIsInvalid({
        amount: amountIsInvalid,
        date: dateIsInvalid,
        description: descriptionIsInvalid,
      });
      return;
    }
    onSubmit(expenseData);
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your Expense</Text>
      <View style={styles.inputsRow}>
        <Input
          style={styles.rowInput}
          label={'Amount'}
          isInvalid={isInvalid.amount}
          textInputConfig={{
            keyboardType: 'decimal-pad',
            onChangeText: amountChangeHandler,
            value: inputValue.amount,
          }}
        />
        <Input
          style={styles.rowInput}
          label={'Date'}
          isInvalid={isInvalid.date}
          textInputConfig={{
            placeholder: 'YYYY-MM-DD',
            maxLength: 10,
            onChangeText: dateChangeHandler,
            value: inputValue.date,
          }}
        />
      </View>
      <Input
        label={'Description'}
        isInvalid={isInvalid.description}
        textInputConfig={{
          multiline: true,
          onChangeText: descriptionChangeHandler,
          value: inputValue.description,
          // autoCorrect: false // default is true
        }}
      />
      <View style={styles.buttonContainer}>
        <CustomButton mode='flat' onPress={onCancel} style={styles.button}>
          Cancel
        </CustomButton>
        <CustomButton onPress={confirmHandler} style={styles.button}>
          {defaultValue ? 'Update' : 'Add'}
        </CustomButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 24,
    textAlign: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});
