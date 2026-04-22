import { Button, View, Alert, Image, Text, StyleSheet } from 'react-native';
import * as ImagePickerLib from 'expo-image-picker';
import { useState } from 'react';
import { Colors } from '../../constants/colors';
import OutlinedButton from '../UI/OutlinedButton';

type Props = {
  onTakeImage: (uri: string) => void;
};
export default function ImagePicker({ onTakeImage }: Props) {
  const [permessionInfo, requestPermission] = ImagePickerLib.useCameraPermissions();
  const [pickedImage, setPickedImage] = useState<string>('');

  async function verifyPermissions() {
    console.log('status', permessionInfo?.status);

    if (permessionInfo?.status === ImagePickerLib.PermissionStatus.UNDETERMINED) {
      const res = await requestPermission();

      return res.granted;
    }

    if (permessionInfo?.status === ImagePickerLib.PermissionStatus.DENIED) {
      Alert.alert('Insufficient Permissions', 'Permission to access camera roll is required!');
      const res = await requestPermission();
      return res.granted;
    }

    return true;
  }

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await ImagePickerLib.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    console.log(image);
    if (image.assets) {
      setPickedImage(image.assets[0].uri);
      onTakeImage(image.assets[0].uri);
    }
  };

  let imagePreview = <Text>No image taken yet</Text>;

  if (!!pickedImage) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton onPress={takeImageHandler} icon='camera'>
        Take Image
      </OutlinedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
