import {StackScreenProps} from '@react-navigation/stack';
import {Button, Layout, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {StorageAdapter} from '../../../config/adapters/storage-adapter';
import {SlidesStackParams} from '../../navigation/StackSlidesNavigator';
import {colors} from '../../../config/colors';

interface Props
  extends StackScreenProps<SlidesStackParams, 'TakePhotoScreen'> {}

export const TakePhotoScreen = ({navigation}: Props) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Función para solicitar permisos en Android
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso para usar la cámara',
            message:
              'Esta aplicación necesita acceso a la cámara para tomar fotos.',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Función para capturar una foto
  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permiso denegado', 'No se puede acceder a la cámara');
      return;
    }

    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'front',
      quality: 1,
      saveToPhotos: true,
    });

    if (result.didCancel) {
      Alert.alert('Cancelado', 'No se tomó ninguna foto');
      return;
    }

    if (result.errorCode) {
      console.log(result.errorMessage);
      Alert.alert('Error', result.errorMessage || 'Error al tomar la foto');
      return;
    }

    if (result.assets && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      await StorageAdapter.setItem('userAvatar', uri);
    }
  };

  const goToNextScreen = () => {
    if (photoUri) {
      navigation.navigate('ScanInfoScreen');
    } else {
      Alert.alert('Error', 'Por favor, toma una foto antes de continuar');
    }
  };

  return (
    <Layout style={styles.container}>
      <Text category="h1" style={{marginBottom: 20}}>
        Sacate una selfie
      </Text>
      <Layout style={styles.containerAction}>
        {photoUri ? (
          <Image
            source={{uri: photoUri}}
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              marginBottom: 20,
            }}
          />
        ) : (
          <Text category="p1">Aún no has tomado una foto</Text>
        )}

        <Button onPress={takePhoto} style={styles.button}>
          Tomar Foto
        </Button>
        {photoUri && (
          <Button onPress={goToNextScreen} style={styles.button}>
            Continuar
          </Button>
        )}
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerAction: {
    gap: 30,
    alignItems: 'center',
  },
  button: {width: 150, backgroundColor: colors.primary, borderWidth: 0},
});
