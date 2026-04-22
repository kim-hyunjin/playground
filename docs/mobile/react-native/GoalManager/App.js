import { useCallback, useState } from 'react';
import { StyleSheet, View, FlatList, Button } from 'react-native';
import GoalItem from './components/GoalItem';
import GoalInput from './components/GoalInput';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [goals, setGoals] = useState([]);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const addGoalHandler = useCallback((enteredGoalText) => {
    setGoals((prev) => [{ id: enteredGoalText + Math.random(), value: enteredGoalText }, ...prev]);
    toggleInputVisible();
  }, []);

  const removeGoalHandler = useCallback((id) => {
    setGoals((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleInputVisible = useCallback(() => {
    setModalIsVisible((prev) => !prev);
  }, []);

  return (
    <>
      <StatusBar style='light' />
      <View style={styles.appContainer}>
        <View style={styles.addButton}>
          <Button title='Add new goal' color={'#a064ec'} onPress={toggleInputVisible} />
        </View>
        <GoalInput
          visible={modalIsVisible}
          onAddGoal={addGoalHandler}
          onCancel={toggleInputVisible}
        />
        <View style={styles.goalsContainer}>
          <FlatList
            data={goals}
            renderItem={({ item }) => <GoalItem item={item} onPress={removeGoalHandler} />}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  addButton: {
    paddingBottom: 24,
    borderBottomWidth: 2,
    borderColor: '#5e0acc',
    marginBottom: 16,
  },
  goalsContainer: {
    flex: 5,
  },
});
