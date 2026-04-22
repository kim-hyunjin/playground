import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigation from './navigation/StackNavigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { init } from './utils/database';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await init();
        setAppIsReady(true);
      } catch (error) {
        console.error(error);
      }
    }

    prepare();
  }, []);

  useLayoutEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return (
    <>
      <StatusBar style='dark' />
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({});
