import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import BackgroundService from 'react-native-background-actions';
import BatteryOptimization from 'react-native-battery-optimization-check';


const veryIntensiveTask = async (taskDataArguments?: { delay: number }) => {
  const delay = taskDataArguments?.delay ?? 1000; // Default delay to 1000 if undefined
  for (let i = 0; BackgroundService.isRunning(); i++) {
    console.log(`Running background task iteration ${i}`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};

const options = {
  taskName: 'BackgroundTask',
  taskTitle: 'Background Task Example',
  taskDesc: 'This is an example of a background task running as a foreground service.',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'exampleScheme://chat/jane',
  parameters: {
    delay: 1000,
  },
};

const checkBatteryOptimization = async () => {
  const isBatteryOptimizationEnabled = await BatteryOptimization.isBatteryOptimizationEnabled();
  if (isBatteryOptimizationEnabled) {
    Alert.alert(
      'Battery Optimization',
      'Battery optimization is enabled. Please disable it for the app to function properly in the background.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => BatteryOptimization.openBatteryOptimizationSettings() },
      ]
    );
  }
};

const onBackgroundFetch = async (taskId: string) => {
  console.log('[BackgroundFetch] Task ID:', taskId);
  // Perform your background task here
  BackgroundFetch.finish(taskId);
};

const App = () => {
  useEffect(() => {
    const initBackgroundFetch = async () => {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15,
          stopOnTerminate: false,
          startOnBoot: true,
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
          requiresCharging: false,
          requiresDeviceIdle: false,
          requiresBatteryNotLow: false,
          requiresStorageNotLow: false,
        },
        async (taskId) => {
          console.log('[BackgroundFetch] Background fetch event received.');
          await onBackgroundFetch(taskId);
        },
        (error) => {
          console.log('[BackgroundFetch] Configuration error:', error);
        }
      );

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

    initBackgroundFetch();

    const startBackgroundService = async () => {
      try {
        await BackgroundService.start(veryIntensiveTask, options);
      } catch (e) {
        console.error('Error starting background service:', e);
      }
    };

    startBackgroundService();
    checkBatteryOptimization();

    return () => {
      BackgroundService.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Background Fetch Example</Text>
    </View>
  );
};

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

export default App;