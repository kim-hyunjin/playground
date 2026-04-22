import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';

const List = ({ data }: { data: any[] }) => {
  return (
    <>
      {data.map((d) => (
        <View key={d} style={styles.listItem}>
          <Text style={styles.itemText}>{d}</Text>
        </View>
      ))}
    </>
  );
};

export default List;

const styles = StyleSheet.create({
  listItem: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 4,
    marginHorizontal: 12,
    backgroundColor: Colors.brown100,
  },
  itemText: {
    color: Colors.brown500,
    textAlign: 'center',
  },
});
