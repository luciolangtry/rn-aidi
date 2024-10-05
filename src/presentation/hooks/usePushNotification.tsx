import messaging from '@react-native-firebase/messaging';
import {Linking, PermissionsAndroid, Platform} from 'react-native';
import {navigationRef} from '../navigation/navigationRef';
import {useRegisterStore} from '../store/useRegisterStore';

const usePushNotification = () => {
  const {setTokenApp} = useRegisterStore();

  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      //Request iOS permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } else if (Platform.OS === 'android') {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  };

  // Para obtener el Token
  const getFCMToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
      setTokenApp(fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  // Cuandos se recibe el msj en primer plano
  const listenToForegroundNotifications = async () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'Llego un nuevo msj. La app esta en PRIMER PLANO!',
        JSON.stringify(remoteMessage),
      );

      // Redirigir al usuario solo cuando llega una notificación en primer plano
      Linking.openURL('https://www.google.com').catch(err =>
        console.error('An error occurred', err),
      );
    });

    return unsubscribe;
  };

  // Cuandos se recibe el msj en segundo plano o cerrada
  const listenToBackgroundNotifications = async () => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log(
          'Llego un nuevo msj. La app esta en SEGUNDO PLANO o CERRADA!',
          JSON.stringify(remoteMessage),
        );
      },
    );
    return unsubscribe;
  };

  // Cuando la app esta en segundo plano
  const onNotificationOpenedAppFromBackground = async () => {
    const unsubscribe = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        console.log(
          'La app esta en segundo plano, se procede a la navegacion:',
          JSON.stringify(remoteMessage.data),
        );

        // Cuando recibe la notificacion redirige
        const interval = setInterval(() => {
          if (navigationRef.isReady()) {
            navigationRef.navigate('InteractionDetailScreen', {
              idInteraction: remoteMessage.data!.transactionId.toString(),
            });
            clearInterval(interval);
          } else {
            console.log('Esperando a que navigationRef esté listo...');
          }
        }, 100); // Verifica cada 100ms
      },
    );
    return unsubscribe;
  };

  // Cuando la app esta cerrada
  const onNotificationOpenedAppFromQuit = async () => {
    const message = await messaging().getInitialNotification();

    if (message) {
      console.log(
        'Se abrió la aplicación desde la notificación',
        JSON.stringify(message),
      );

      const interval = setInterval(() => {
        if (navigationRef.isReady()) {
          navigationRef.navigate('InteractionDetailScreen', {
            idInteraction: message.data!.transactionId.toString(),
          });
          clearInterval(interval);
        } else {
          console.log('Esperando a que navigationRef esté listo...');
        }
      }, 100); 
    }
  };

  return {
    requestUserPermission,
    getFCMToken,
    listenToForegroundNotifications,
    listenToBackgroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  };
};

export default usePushNotification;
