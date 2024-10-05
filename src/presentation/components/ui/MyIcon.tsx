import {Icon, useTheme} from '@ui-kitten/components';
import {StyleSheet, ViewStyle} from 'react-native';

interface Props {
  name: string;
  color?: string;
  white?: boolean;
  style?: ViewStyle;
}

export const MyIcon = ({name, color, white = false, style}: Props) => {
  const theme = useTheme();
  /*   console.log(theme["color-primary-400"]); */

/*   if (white) {
    color = theme['color-info-100'];
  } else if (!color) {
    color = theme['text-basic-color'];
  } else {
    color = theme[color] ?? theme['text-basic-color'];
  } */

  return <Icon style={[styles.icon, style]} fill={color} name={name} />;
};

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});
