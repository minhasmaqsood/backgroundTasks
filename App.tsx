// import React, {useEffect} from 'react';
// import {AppState, Text, View, StyleSheet} from 'react-native';
// import BackgroundService from 'react-native-background-actions';
// import BackgroundFetch from 'react-native-background-fetch';

// // Define the background task
// const veryIntensiveTask = async taskDataArguments => {
//   const {delay} = taskDataArguments;
//   for (let i = 0; BackgroundService.isRunning(); i++) {
//     console.log(`Running background task iteration ${i}`);
//     await sleep(delay); // Sleep for specified delay
//   }
// };
// ////
// // const initBackgroundFetch = async () => {
// //   BackgroundFetch.configure(
// //     {
// //       minimumFetchInterval: 15, // Fetch interval in minutes
// //       stopOnTerminate: false, // Continue after app termination
// //       startOnBoot: true, // Start after device reboot
// //       requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Network type
// //       requiresCharging: false, // Charging required
// //       requiresDeviceIdle: false, // Device idle required
// //       requiresBatteryNotLow: false, // Battery not low required
// //       requiresStorageNotLow: false, // Storage not low required
// //     },
// //     async (taskId) => {
// //       console.log('[BackgroundFetch] event received:', taskId);
// //       onBackgroundFetch(taskId);
// //     },
// //     (error) => {
// //       console.log('[BackgroundFetch] configure error:', error);
// //     }
// //   );

// const performBackgroundTask = async () => {
//   // Code that needs to be executed in the background
//   const startTime = new Date().getTime();
//   console.log('in')
//   try {
//     await BackgroundService.start(veryIntensiveTask, options);
//   } catch (e) {
//     console.error('Error starting background service:', e);
//   }
//   // Code to execute the background task

//   const endTime = new Date().getTime();
//   const timeTaken = endTime - startTime;
//   console.log(`Time taken: ${timeTaken}ms`);
// };

// // Sleep function
// const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

// // Options for the background task
// const options = {
//   taskName: 'BackgroundTask',
//   taskTitle: 'Background Task Example',
//   taskDesc:
//     'This is an example of a background task running as a foreground service.',
//   taskIcon: {
//     name: 'ic_launcher',
//     type: 'mipmap',
//   },
//   color: '#ff00ff',
//   linkingURI: 'exampleScheme://chat/jane', // Optional
//   parameters: {
//     delay: 1000, // Time between each iteration
//   },
//   // notifications: {
//   //   priority: BackgroundService.NotificationPriority.HIGH, // (Optional) Set notification priority
//   // }
// };

// const App = () => {
//   useEffect(() => {
//     const handleAppStateChange = async nextAppState => {
//       if (nextAppState === 'background') {
//         console.log('App is in the background');
//         try {
//           await BackgroundService.start(veryIntensiveTask, options);
//         } catch (e) {
//           console.error('Error starting background service:', e);
//         }
//       } else if (nextAppState === 'active') {
//         console.log('App is in the foreground');
//         try {
//           await BackgroundService.stop();
//         } catch (e) {
//           console.error('Error stopping background service:', e);
//         }
//       }
//     };

//     const subscription = AppState.addEventListener(
//       'change',
//       handleAppStateChange,
//     );
//     BackgroundFetch.configure(
//       {
//         minimumFetchInterval: 15, // Minimum fetch interval in minutes
//         stopOnTerminate: false, // Whether to stop background fetch on app termination
//         startOnBoot: true, // Whether to start background fetch on device boot
//         enableHeadless: true, // Whether to run the task even if the app is not running
//       },
//       () => {
//         console.log('started')
//         performBackgroundTask();
//       },
//       error => {
//         console.log('Background fetch failed to start', error);
//       },
//     );
//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Background Task Example</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 20,
//   },
// });

// export default App;

////// background fetch





import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';

// Define the background task
const onBackgroundFetch = async (taskId) => {
  console.log('[BackgroundFetch] Task received:', taskId);

  // Perform your background task here.
  console.log(`Background task running at ${new Date().toLocaleTimeString()}`);

  // Call finish to let the OS know the task is complete.
  BackgroundFetch.finish(taskId);
};

const App = () => {
  useEffect(() => {
    // Initialize BackgroundFetch
    const initBackgroundFetch = async () => {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // Fetch interval in minutes
          stopOnTerminate: false, // Continue after app termination
          startOnBoot: true, // Start after device reboot
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Network type
          requiresCharging: false, // Charging required
          requiresDeviceIdle: false, // Device idle required
          requiresBatteryNotLow: false, // Battery not low required
          requiresStorageNotLow: false, // Storage not low required
        },
        async (taskId) => {
          console.log('[BackgroundFetch] Background fetch event received.');
          await onBackgroundFetch(taskId);
        },
        (error) => {
          console.log('[BackgroundFetch] Configuration error:', error);
        }
      );

      // Optional: Query current status.
      const status = await BackgroundFetch.status();
      console.log('[BackgroundFetch] Current status:', status);

      // Optional: Check if background fetch is enabled
      if (status === BackgroundFetch.STATUS_RESTRICTED) {
        console.log('[BackgroundFetch] Background fetch restricted by OS.');
      } else if (status === BackgroundFetch.STATUS_DENIED) {
        console.log('[BackgroundFetch] Background fetch denied.');
      } else if (status === BackgroundFetch.STATUS_AVAILABLE) {
        console.log('[BackgroundFetch] Background fetch is available.');
      }
    };

    initBackgroundFetch();
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
