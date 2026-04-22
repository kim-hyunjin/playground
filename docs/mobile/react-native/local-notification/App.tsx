import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    async function configurePushNotifications() {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Permission required', 'Push notifications need the appropriate permissions.');
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      console.log({ token });
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }
    configurePushNotifications();

    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('notification received');
      console.log(notification);
      const userName = notification.request.content.data.userName;
      console.log(userName);
    });

    const sub2 = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('notification response received');
      console.log(response);
      const userName = response.notification.request.content.data.userName;
      console.log(userName);
    });

    return () => {
      subscription.remove();
      sub2.remove();
    };
  }, []);

  const scheduleNotificationHandler = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here', userName: 'hyunjin' },
      },
      trigger: { seconds: 2 },
    });
  };

  const sendPushNotificationHandler = async () => {
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'ExponentPushToken[lOJ3wMFXepEsxoqmNa2oqM]',
        title: 'hello',
        body: 'world',
      }),
    });
  };

  return (
    <View style={styles.container}>
      <Button title='Schedule Notification' onPress={scheduleNotificationHandler} />
      <Button title='Send Push Notification' onPress={sendPushNotificationHandler} />
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
