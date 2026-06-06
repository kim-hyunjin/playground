import { Platform } from 'react-native';

const shadow = {
  elevation: 4,
  shadowColor: 'black',
  shadowOpacity: 0.25,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
  overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
} as {
  elevation: number;
  shadowColor: string;
  shadowOpacity: number;
  shadowOffset: { width: number; height: number };
  shadowRadius: number;
  overflow: 'hidden' | 'visible';
};

export default shadow;
