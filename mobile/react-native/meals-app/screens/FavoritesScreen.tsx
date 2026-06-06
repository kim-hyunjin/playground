import { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FavoritesContext } from '../store/context/favorites-context';
import MealsList from '../components/MealsList/MealsList';
import { MEALS } from '../data/dummy-data';
import { useSelector } from 'react-redux';
import { RootState } from '../store/redux/store';
import { isFavorite } from '../store/redux/favorite';

const FavoritesScreen = () => {
  // const favoriteMealCtx = useContext(FavoritesContext);
  const favoriteMealState = useSelector((state: RootState) => state.favoriteMeals);

  const favoriteMeals = MEALS.filter((meal) => isFavorite(favoriteMealState, meal.id));

  if (favoriteMeals.length === 0) {
    return (
      <View style={styles.rootContainer}>
        <Text style={styles.text}>You have no favorite meals yet.</Text>
      </View>
    );
  }

  return <MealsList meals={favoriteMeals} />;
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
