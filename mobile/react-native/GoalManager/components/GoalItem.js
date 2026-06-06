import { useCallback } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';

function GoalItem({ item, onPress }) {
  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item, onPress]);

  return (
    <View style={styles.goalItem}>
      <Pressable
        onPress={handlePress}
        android_ripple={{ color: '#21064' }}
        style={({ pressed }) => pressed && styles.pressedItem}
      >
        <Text style={styles.goalItemText}>{item.value}</Text>
      </Pressable>
    </View>
  );
}

export default GoalItem;

const styles = StyleSheet.create({
  goalItem: {
    margin: 8,
    borderRadius: 6,
    backgroundColor: '#5e0acc',
  },
  goalItemText: {
    color: 'white',
    padding: 8,
  },
  pressedItem: {
    opacity: 0.7,
  },
});
