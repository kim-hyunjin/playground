import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Text, View, StyleSheet, ScrollView, Button } from 'react-native';
import { StackParamList } from '../App';
import { MEALS } from '../data/dummy-data';
import MealDetails from '../components/MealDetails';
import Colors from '../constants/Colors';
import Subtitle from '../components/MealDetail/Subtitle';
import List from '../components/MealDetail/List';
import { useContext, useLayoutEffect } from 'react';
import IconButton from '../components/IconButton';
import { FavoritesContext } from '../store/context/favorites-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/redux/store';
import { isFavorite } from '../store/redux/favorite';
import { addFavorite, removeFavorite } from '../store/redux/favorite';

const MealsDetailScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<StackParamList, 'MealDetail'>) => {
  // const favoriteMealCtx = useContext(FavoritesContext);
  const favoriteMeals = useSelector((state: RootState) => state.favoriteMeals);
  const dispatch = useDispatch();

  const { mealId } = route.params;
  const displayMeal = MEALS.find((meal) => meal.id === mealId);

  // const mealIsFavorite = favoriteMealCtx.isFavorite(mealId);
  const mealIsFavorite = isFavorite(favoriteMeals, mealId);

  const changeFavoriteStatusHandler = () => {
    if (mealIsFavorite) {
      // favoriteMealCtx.removeFavorite(mealId);
      dispatch(removeFavorite(mealId));
    } else {
      // favoriteMealCtx.addFavorite(mealId);
      dispatch(addFavorite(mealId));
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <IconButton
            icon={mealIsFavorite ? 'star' : 'star-outline'}
            color='white'
            onPress={changeFavoriteStatusHandler}
          />
        );
      },
    });
  }, [mealIsFavorite]);

  if (!displayMeal) {
    return (
      <View>
        <Text>not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.rootContainer}>
      <Image source={{ uri: displayMeal.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{displayMeal.title}</Text>
      <MealDetails meal={displayMeal} textStyle={styles.detailText} />
      <View style={styles.listOuterContainer}>
        <View style={styles.listInnerContainer}>
          <Subtitle>Ingredients</Subtitle>
          <List data={displayMeal.ingredients} />
          <Subtitle>Steps</Subtitle>
          <List data={displayMeal.steps} />
        </View>
      </View>
    </ScrollView>
  );
};

export default MealsDetailScreen;

const styles = StyleSheet.create({
  rootContainer: {
    marginBottom: 32,
  },
  image: {
    width: '100%',
    height: 350,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    margin: 8,
    textAlign: 'center',
    color: 'white',
  },
  detailText: {
    color: 'white',
  },
  listOuterContainer: {
    alignItems: 'center',
  },
  listInnerContainer: {
    width: '80%',
  },
});
