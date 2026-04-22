import { View, Text, StyleSheet, FlatList } from 'react-native';
import { CATEGORIES, MEALS } from '../data/dummy-data';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '../App';
import Meal from '../models/meal';
import MealItem from '../components/MealsList/MealItem';
import { useEffect, useLayoutEffect } from 'react';
import MealsList from '../components/MealsList/MealsList';

const MealsOverviewScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<StackParamList, 'MealsOverview'>) => {
  const { categoryId } = route.params;

  const displayMeals = MEALS.filter((mealItem) => mealItem.categoryIds.indexOf(categoryId) !== -1);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: CATEGORIES.find((category) => category.id === categoryId)?.title,
    });
  }, [categoryId, navigation]);

  return <MealsList meals={displayMeals} />;
};

export default MealsOverviewScreen;
