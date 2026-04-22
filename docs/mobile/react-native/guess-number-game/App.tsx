import { ImageBackground, StyleSheet, SafeAreaView } from 'react-native';
import StartGameScreen from './screens/StartGameScreen';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useCallback } from 'react';
import GameScreen from './screens/GameScreen';
import Colors from './constants/color';
import GameOverScreen from './screens/GameOverScreen';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  });
  const [pickedNumber, setPickedNumber] = useState<number | null>(null);
  const [gameIsOver, setGameIsOver] = useState(true);
  const [guessRound, setGuessRound] = useState(0);

  const pickNumberHandler = useCallback((number: number) => {
    setPickedNumber(number);
    setGameIsOver(false);
  }, []);

  const gameOverHandler = useCallback((numberOfRounds: number) => {
    setGameIsOver(true);
    setGuessRound(numberOfRounds);
  }, []);

  const startNewGameHandler = useCallback(() => {
    setPickedNumber(null);
    setGuessRound(0);
  }, []);

  if (!fontsLoaded) return <AppLoading />;

  let screen = <StartGameScreen onPickNumber={pickNumberHandler} />;

  if (pickedNumber) {
    screen = <GameScreen userNumber={pickedNumber} onGameOver={gameOverHandler} />;
  }
  if (gameIsOver && pickedNumber) {
    screen = (
      <GameOverScreen
        rounds={guessRound}
        userNumber={pickedNumber}
        onStartNewGame={startNewGameHandler}
      />
    );
  }

  return (
    <LinearGradient style={styles.rootScreen} colors={[Colors.primary200, Colors.accent500]}>
      <ImageBackground
        source={require('./assets/images/background.png')}
        resizeMode='cover'
        style={styles.rootScreen}
        imageStyle={styles.backgroundImage}
      >
        <SafeAreaView style={styles.rootScreen}>{screen}</SafeAreaView>
      </ImageBackground>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.15,
  },
});
