import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Layout, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {colors} from '../../../config/colors';
import {SlidesStackParams} from '../../navigation/StackSlidesNavigator';

export const ScanCodeScreen = () => {
/*   const [data, setData] = useState<string | null>(null); */
  const navigation = useNavigation<StackNavigationProp<SlidesStackParams>>();

  const formatData = (
    data: string,
  ): {dni: string; name: string; cuil: string} | null => {
    const parts = data.split('@');

    if (parts.length >= 8) {
      const dni = parts[4];
      const cuilStart = parts[8].substring(0, 2); // Los primeros 2 números del CUIL
      const cuilEnd = parts[8].substring(2); // El último número del CUIL

      const cuil = `${cuilStart}${dni}${cuilEnd}`;

      return {
        dni,
        name: `${parts[1]} ${parts[2]}`,
        cuil,
      };
    }

    return null;
  };

  const handleQRCodeRead = ({data}: {data: string}) => {
    const formattedData = formatData(data);

    if (formattedData) {
      navigation.navigate('ScanResultScreen', {
        dni: formattedData.dni,
        name: formattedData.name,
        cuil: formattedData.cuil,
      });
    } else {
      Alert.alert(
        'Error',
        'El código escaneado no es válido. Por favor, inténtalo de nuevo.',
      );
    }
  };

  return (
    <QRCodeScanner
      onRead={handleQRCodeRead}
      reactivate={true}
      reactivateTimeout={500}
      cameraStyle={styles.cameraStyle}
      containerStyle={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      markerStyle={{
        height: 100,
        borderColor: colors.primary,
      }}
      topContent={
        <Layout style={styles.container}>
          <Text style={styles.centerText}>
            Escanea el código de barras de tu Dni
          </Text>
        </Layout>
      }
      showMarker
      bottomContent={
        <Layout style={styles.containerBottom}>
          <Text
            style={{
              textAlign: 'center',
              padding: 10,
              fontSize: 16,
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: 'black',
            }}>
            Posicionalo bien en el centro
          </Text>
        </Layout>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
    fontSize: 30,
    padding: 20,
    marginBottom: 50,
  },
  cameraStyle: {
    width: 320,
    height: 250,
    borderRadius: 5,
    overflow: 'hidden',
  },
  containerBottom: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'red',
  },
});
