import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button, Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {Image} from 'react-native';
import {colors} from '../../../config/colors';
import {SlidesStackParams} from '../../navigation/StackSlidesNavigator';

export const ScanInfoScreen = () => {
  const navigation = useNavigation<StackNavigationProp<SlidesStackParams>>();

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 100,
      }}>
      <Layout>
        <Text category="h3">Escanea el codigo de barras de tu DNI</Text>
        <Image
          source={require('../../assets/dni_muestra.png')}
          style={{
            width: 300,
            height: 200,
            padding: 20,
            marginTop: 80,
            backgroundColor: colors.background,
            borderRadius: 20,
            resizeMode: 'contain',
          }}
        />
        <Image
          source={require('../../assets/flecha_vector.png')}
          style={{
            width: 50,
            height: 50,
            position: 'absolute',
            bottom: -25,
            right: 90,
            resizeMode: 'contain',
            transform: [{rotate: '45deg'}],
          }}
        />
      </Layout>
      <Layout
        style={{
          width: '100%',
          alignItems: 'flex-end',
          marginTop: 200,
        }}>
        <Button
          style={{
            width: '50%',
            backgroundColor: colors.primary,
            borderWidth: 0,
          }}
          onPress={() => navigation.navigate('CodeScanScreen')}>
          Siguiente
        </Button>
      </Layout>
    </Layout>
  );
};
