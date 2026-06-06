import { FlatList } from 'react-native';
import { CATEGORIES } from '../data/dummy-data';
import Category from '../models/category';
import CategoryGridTile from '../components/CategoryGridTile';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerParamList, StackParamList } from '../App';
import { DrawerScreenProps } from '@react-navigation/drawer';

import type { CompositeScreenProps } from '@react-navigation/native';

type CategoriesScreenProps = CompositeScreenProps<
  DrawerScreenProps<DrawerParamList, 'Categories'>,
  NativeStackScreenProps<StackParamList, 'MealsOverview'>
>;

const CategoriesScreen = ({ navigation }: CategoriesScreenProps) => {
  const renderCategoryItem = (item: Category) => {
    const pressHandler = () => {
      navigation.navigate('MealsOverview', {
        categoryId: item.id,
      });
    };
    return <CategoryGridTile title={item.title} color={item.color} onPress={pressHandler} />;
  };

  return (
    <FlatList
      data={CATEGORIES}
      renderItem={({ item }) => renderCategoryItem(item)}
      keyExtractor={(item) => item.id}
      numColumns={2}
    />
  );
};

export default CategoriesScreen;
