import React, {useEffect} from 'react';
import {Text, View, StyleSheet, Alert, Button} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import notifee, {AndroidImportance} from '@notifee/react-native';
import BatteryOptimization from 'react-native-battery-optimization-check';

// Handle background task in Headless JS
const HeadlessTask = async ({taskId}) => {
  console.log('[HeadlessTask] Task ID:', taskId);

  // Display notification when background fetch event is triggered
  await notifee.displayNotification({
    title: 'Background Task Active',
    body: 'App terminated, but background task triggered this notification.',
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher',
    },
  });

  // Finish the task
  BackgroundFetch.finish(taskId);
};

// Register Headless JS task
BackgroundFetch.registerHeadlessTask(HeadlessTask);

// Main App Component
const App = () => {
  useEffect(() => {
    const initBackgroundFetch = async () => {
      // Configure Background Fetch
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // Fetch every 15 minutes
          stopOnTerminate: false, // Continue running even when the app is terminated
          startOnBoot: true, // Start on device boot
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
          requiresCharging: false,
          requiresDeviceIdle: false,
          requiresBatteryNotLow: false,
          requiresStorageNotLow: false,
        },
        async taskId => {
          console.log('[BackgroundFetch] Background fetch event received.');
          // Perform your background task here
          await onBackgroundFetch(taskId);
        },
        error => {
          console.log('[BackgroundFetch] Configuration error:', error);
        },
      );

      // Check if Background Fetch is available
      const status = await BackgroundFetch.status();
      console.log('[BackgroundFetch] Current status:', status);

      if (status === BackgroundFetch.STATUS_RESTRICTED) {
        console.log('[BackgroundFetch] Background fetch restricted by OS.');
      } else if (status === BackgroundFetch.STATUS_DENIED) {
        console.log('[BackgroundFetch] Background fetch denied.');
      } else if (status === BackgroundFetch.STATUS_AVAILABLE) {
        console.log('[BackgroundFetch] Background fetch is available.');
      }
    };

    // Initialize Background Fetch and set up the service
    initBackgroundFetch();
    checkBatteryOptimization();

    // Clean up the background service when the component is unmounted
    return () => {
      BackgroundFetch.stop();
    };
  }, []);

  // Display the notification
  const onDisplayNotification = async () => {
    await notifee.requestPermission();

    // Create a notification channel with HIGH importance
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH, // High priority for notifications
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  // Check battery optimization
  const checkBatteryOptimization = async () => {
    const isBatteryOptimizationEnabled =
      await BatteryOptimization.isBatteryOptimizationEnabled();
    if (isBatteryOptimizationEnabled) {
      Alert.alert(
        'Battery Optimization',
        'Battery optimization is enabled. Please disable it for the app to function properly in the background.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Open Settings',
            onPress: () =>
              BatteryOptimization.openBatteryOptimizationSettings(),
          },
        ],
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Background Fetch Example</Text>
      <Button
        title="Display Notification"
        onPress={() => onDisplayNotification()}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
