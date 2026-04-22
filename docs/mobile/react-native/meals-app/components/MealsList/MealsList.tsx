import Meal from '../../models/meal';
import MealItem from './MealItem';

import { View, FlatList, StyleSheet } from 'react-native';

const MealsList = ({ meals }: { meals: Meal[] }) => {
  const renderMealItem = (item: Meal) => {
    return <MealItem meal={item} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderMealItem(item)}
      />
    </View>
  );
};

export default MealsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
