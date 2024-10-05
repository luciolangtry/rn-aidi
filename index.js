/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {AidiApp} from './src/AidiApp';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Llego una notificacion:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => AidiApp);
