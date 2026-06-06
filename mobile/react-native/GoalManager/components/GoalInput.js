import { View, TextInput, Button, StyleSheet, Modal, Image } from 'react-native';
import { useState, useCallback } from 'react';

function GoalInput({ visible, onAddGoal, onCancel }) {
  const [enteredGoalText, setEnteredGoalText] = useState('');

  const goalInputHandler = useCallback((text) => {
    setEnteredGoalText(text);
  }, []);

  const addGoalHandler = () => {
    onAddGoal(enteredGoalText);
    setEnteredGoalText('');
  };

  const cancelHandler = useCallback(() => {
    onCancel();
    setEnteredGoalText('');
  }, [onCancel]);

  return (
    <Modal visible={visible} animationType='slide'>
      <View style={styles.inputContainer}>
        <Image source={require('../assets/images/goal.png')} style={styles.image} />
        <TextInput
          style={styles.textInput}
          placeholder='Your Goal'
          value={enteredGoalText}
          onChangeText={goalInputHandler}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title='Cancel' onPress={cancelHandler} color={'#f31282'} />
          </View>
          <View style={styles.button}>
            <Button title='Add Goal' onPress={addGoalHandler} color={'#b180f0'} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default GoalInput;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    backgroundColor: '#311b6b',
  },
  image: {
    width: 100,
    height: 100,
    margin: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e4d0ff',
    backgroundColor: '#e4d0ff',
    width: '100%',
    marginRight: 8,
    padding: 8,
    borderRadius: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    width: '40%',
  },
});
