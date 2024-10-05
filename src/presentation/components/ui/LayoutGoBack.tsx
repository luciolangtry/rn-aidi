import {useNavigation} from '@react-navigation/native';
import {Divider, Layout} from '@ui-kitten/components';
import React from 'react';
import {Pressable} from 'react-native';
import {MyIcon} from './MyIcon';

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const LayoutGoBack = ({title, children}: Props) => {
  const {goBack} = useNavigation();

  return (
    <Layout style={{marginBottom: 20}}>
      <Layout style={{height: 30}}>
        <Pressable onPress={goBack}>
          <MyIcon name="arrow-back-outline" style={{width: 26, height: 26}} />
        </Pressable>
      </Layout>

      <Divider />
      <Layout>{children}</Layout>
    </Layout>
  );
};
