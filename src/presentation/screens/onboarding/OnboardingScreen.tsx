import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button, CheckBox, Layout, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import {Image, Linking, useWindowDimensions} from 'react-native';
import {colors} from '../../../config/colors';
import {RootStackParams} from '../../navigation/StackNavigator';

export const OnboardingScreen = () => {
  const {width, height} = useWindowDimensions();
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const [checked, setChecked] = useState(false);

  const handleLinkPress = () => {
    Linking.openURL('https://akveo.github.io/react-native-ui-kitten/');
  };

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Layout
        style={{
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/aidi_logo.png')}
          style={{
            width: width,
            height: height / 3,
            resizeMode: 'center',
          }}
        />
        <Text category="h1">AIDI</Text>
      </Layout>
      <Layout
        style={{
          padding: 10,
          marginTop: 20,
          flexDirection: 'row',
          gap: 4,
        }}>
        <CheckBox
          checked={checked}
          onChange={nextChecked => setChecked(nextChecked)}
        />
        <Text>
          Acepto las
          <Text style={{color: colors.primary}} onPress={handleLinkPress}>
            {' '}
            condiciones{' '}
          </Text>
          de servicio.
        </Text>
      </Layout>

      <Button
        status="primary"
        style={{
          marginTop: 40,
          right: -100,
          opacity: checked ? 1 : 0,
          backgroundColor: colors.primary,
          borderWidth: 0,
        }}
        // disabled={!checked}
        onPress={() => navigation.navigate('SlidesStackNavigator')}>
        Siguiente
      </Button>
    </Layout>
  );
};
