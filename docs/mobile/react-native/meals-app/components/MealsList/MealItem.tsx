import { Text, Pressable, View, Image, StyleSheet } from 'react-native';
import Meal, { Affordability, Complexity } from '../../models/meal';
import shadow from '../../styles/shadow';
import CustomPressable from '../CustomPressable';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StackParamList } from '../../App';
import MealDetails from '../MealDetails';

const MealItem = ({ meal }: { meal: Meal }) => {
  const { id, title, imageUrl } = meal;
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const handlePress = () => {
    navigation.navigate('MealDetail', {
      mealId: id,
    });
  };

  return (
    <View style={styles.mealItem}>
      <CustomPressable onPress={handlePress}>
        <View style={styles.innerContainer}>
          <View>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Text style={styles.title}>{title}</Text>
          </View>
          <MealDetails meal={meal} />
        </View>
      </CustomPressable>
    </View>
  );
};

export default MealItem;

const styles = StyleSheet.create({
  mealItem: {
    margin: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    ...shadow,
  },
  innerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    margin: 8,
  },
});
