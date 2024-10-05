import 'react-native-gesture-handler';

import * as eva from '@eva-design/eva';
import {NavigationContainer} from '@react-navigation/native';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {useEffect} from 'react';
import {useColorScheme} from 'react-native';
import usePushNotification from './presentation/hooks/usePushNotification';

import {StackNavigator} from './presentation/navigation/StackNavigator';
import {navigationRef} from './presentation/navigation/navigationRef';
import { URL_BACK } from '@env';

export const AidiApp = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? eva.dark : eva.light;

  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  useEffect(() => {
    const listenToNotifications = () => {
      try {
        getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToForegroundNotifications();
        listenToBackgroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        console.log(error);
      }
    };

    listenToNotifications();
  }, []);

  {
    /*    <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      /> */
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={theme}>
        <NavigationContainer ref={navigationRef}>
          <StackNavigator />
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
};
