import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors} from '../../config/colors';
import {MyIcon} from '../components/ui/MyIcon';
import {HomeScreen} from '../screens/home/HomeScreen';
import {StackInteractions} from './StackInteractions';

export type RootStackParamsBottom = {
  HomeScreen: undefined;
  InteraccionScreen: undefined;
  // ScanResultScreen: {dni: string; name: string};
};

const Tab = createBottomTabNavigator<RootStackParamsBottom>();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {height: 60},
        headerShown: false,
        tabBarLabelStyle:{fontSize:12, fontWeight:"bold"},
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarIcon: ({color, focused}) => {
          let iconName: string = '';

          switch (route.name) {
            case 'HomeScreen':
              iconName = 'home-outline';
              break;

            case 'InteraccionScreen':
              iconName = 'collapse-outline';
              break;
          }
          return (
            <MyIcon
              name={iconName}
              color={focused ? colors.primary : colors.text}
              style={{
                transform: [{scale: focused ? 1.05 : 1}],
              }}
            />
          );
        },
      })}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{title: 'Mis datos'}}
      />
      <Tab.Screen
        name="InteraccionScreen"
        component={StackInteractions}
        options={{title: 'Mis intereacciones'}}
      />
    </Tab.Navigator>
  );
};
