// backgroundTask.js
import BackgroundService from 'react-native-background-actions';
import { sleep } from 'react-native-background-actions';

// Very simple task that logs to console periodically
const veryIntensiveTask = async (taskDataArguments) => {
  const { delay } = taskDataArguments;
  for (let i = 0; BackgroundService.isRunning(); i++) {
    console.log(`Running background task iteration ${i}`);
    await sleep(delay); // Sleep for specified delay
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
  linkingURI: 'exampleScheme://chat/jane', // Optional
  parameters: {
    delay: 1000, // Time between each iteration
  },
  notifications: {
    priority: BackgroundService.NotificationPriority.HIGH, // (Optional) Set notification priority
  }
};

export { veryIntensiveTask, options };
