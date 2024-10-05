import {createStackNavigator} from '@react-navigation/stack';
import {EmailScreen} from '../screens/slides/EmailScreen';
import {ScanInfoScreen} from '../screens/slides/ScanInfoScreen';
import {SlidesScreen} from '../screens/slides/SlidesScreen';
import {TakePhotoScreen} from '../screens/slides/TakePhotoScreen';
import {VerificationEmailScreen} from '../screens/slides/VerificationEmailScreen';
import {ScanCodeScreen} from '../screens/slides/ScanCodeScreen';
import {ScanResultScreen} from '../screens/slides/ScanResultScreen';

export type SlidesStackParams = {
  SlidesScreen: undefined;
  EmailScreen: undefined;
  VerificationEmailScreen: {email: string};
  TakePhotoScreen: undefined;
  ScanInfoScreen: undefined;
  CodeScanScreen: undefined;
  ScanResultScreen: {dni: string; name: string; cuil: string};
};

const SlidesStack = createStackNavigator<SlidesStackParams>();

export const SlidesStackNavigator = () => {
  return (
    <SlidesStack.Navigator>
      <SlidesStack.Screen
        name="SlidesScreen"
        component={SlidesScreen}
        options={{headerShown: false}}
      />
      <SlidesStack.Screen
        name="EmailScreen"
        component={EmailScreen}
        options={{headerShown: false}}
      />
      <SlidesStack.Screen
        name="VerificationEmailScreen"
        component={VerificationEmailScreen}
        options={{headerShown: false}}
      />
      <SlidesStack.Screen
        name="TakePhotoScreen"
        component={TakePhotoScreen}
        options={{headerShown: false}}
      />
      <SlidesStack.Screen
        name="ScanInfoScreen"
        component={ScanInfoScreen}
        options={{headerShown: false}}
      />
      <SlidesStack.Screen
        name="CodeScanScreen"
        component={ScanCodeScreen}
        options={{headerShown: false}}
      />
      <SlidesStack.Screen
        name="ScanResultScreen"
        component={ScanResultScreen}
        options={{headerShown: false}}
      />
    </SlidesStack.Navigator>
  );
};
