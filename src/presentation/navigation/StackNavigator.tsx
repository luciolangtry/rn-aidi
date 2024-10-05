import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from '@react-navigation/stack';
import {useEffect, useState} from 'react';
import {StorageAdapter} from '../../config/adapters/storage-adapter';
import {LoadingScreen} from '../screens/loading/LoadingScreen';
import {OnboardingScreen} from '../screens/onboarding/OnboardingScreen';
import {BottomTabNavigator} from './BottomTabNavigator';
import {SlidesStackNavigator} from './StackSlidesNavigator';
import { InteractionDetailScreen } from '../screens/interactions/InteractionDetailScreen';

export type RootStackParams = {
  OnboardingScreen: undefined;
  SlidesStackNavigator: undefined;
  BottomTabNavigator: undefined;
  InteractionDetailScreen: {idInteraction: string};
};

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({current}) => {
  return {
    cardStyle: {
      opacity: current.progress,
    },
  };
};

export const StackNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParams | undefined
  >(undefined);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasCompletedOnboarding = await StorageAdapter.getItem(
          'onboardingCompleted',
        );

        if (hasCompletedOnboarding == 'true') {
          setInitialRoute('BottomTabNavigator');
        } else {
          setInitialRoute('OnboardingScreen');
        }
      } catch (error) {
        console.log('Error checking local storage', error);
        setInitialRoute('OnboardingScreen');
      }
    };

    checkOnboardingStatus();
  }, []);

  if (!initialRoute) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={{cardStyleInterpolator: fadeAnimation, headerShown: false}}
      />
      <Stack.Screen
        name="SlidesStackNavigator"
        component={SlidesStackNavigator}
        options={{cardStyleInterpolator: fadeAnimation, headerShown: false}}
      />
      <Stack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{cardStyleInterpolator: fadeAnimation, headerShown: false}}
      />
      <Stack.Screen
        name="InteractionDetailScreen"
        component={InteractionDetailScreen}
        options={{cardStyleInterpolator: fadeAnimation, headerShown: false}}
      />
    </Stack.Navigator>
  );
};
