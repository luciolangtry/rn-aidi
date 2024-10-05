import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '@ui-kitten/components';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors } from '../../../config/colors';
import { SlidesStackParams } from '../../navigation/StackSlidesNavigator';

interface Slide {
  title: string;
  desc: string;
  img: string;
}

const items: Slide[] = [
  {
    title: '¡Regístrate para Comenzar!',
    desc: 'Para empezar a usar la app, es necesario que te registres. Esto nos permitirá brindarte una experiencia personalizada.',
    img: require('../../assets/Start.json'),
  },
  {
    title: 'Registra tu Correo Electrónico',
    desc: 'Necesitamos tu correo para poder enviarte actualizaciones y confirmar tu identidad.',
    img: require('../../assets/Email.json'),
  },
  {
    title: 'Tómate una Selfie',
    desc: 'Para mayor seguridad, te pedimos que te tomes una selfie. Solo te llevará unos segundos.',
    img: require('../../assets/Selfie.json'),
  },
  {
    title: 'Escanea el Código de Barras',
    desc: 'Finalmente, escanea el código de barras del documento para completar el registro.',
    img: require('../../assets/Scan.json'),
  },
];

export const SlidesScreen = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<StackNavigationProp<SlidesStackParams>>();

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {contentOffset, layoutMeasurement} = event.nativeEvent;

    const currentIndex = Math.floor(contentOffset.x / layoutMeasurement.width);

    setCurrentSlideIndex(currentIndex > 0 ? currentIndex : 0);
  };

  const scrollToSlide = (index: number) => {
    if (!flatListRef.current) return;

    flatListRef.current.scrollToIndex({index: index, animated: true});
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
      <FlatList
        ref={flatListRef}
        data={items}
        keyExtractor={item => item.title}
        renderItem={({item}) => <SlideItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        /* Para que no pueda ir de una página a la otra asi sin más */
        scrollEnabled={false}
        /* Referencia al
         scroll */
        onScroll={onScroll}
      />

      {currentSlideIndex === items.length - 1 ? (
        <Button
          onPress={() => navigation.navigate('EmailScreen')}
          style={{
            position: 'absolute',
            bottom: 60,
            right: 30,
            width: 150,
            backgroundColor: colors.primary,
            borderWidth: 0,
          }}>
          Finalizar
        </Button>
      ) : (
        <Button
          onPress={() => scrollToSlide(currentSlideIndex + 1)}
          style={{
            position: 'absolute',
            bottom: 60,
            right: 30,
            width: 150,
            backgroundColor: colors.primary,
            borderWidth: 0,
          }}>
          Siguiente
        </Button>
      )}
    </View>
  );
};

interface SlideItemProps {
  item: Slide;
}

const SlideItem = ({item}: SlideItemProps) => {
  const {width} = useWindowDimensions();
  const {title, desc, img} = item;

  return (
    <View style={[styles.container, {width}]}>
      {/*      <Image
        source={img}
        style={{
          width: width * 0.7,
          height: width * 0.7,
          resizeMode: 'center',
          alignSelf: 'center',
        }}
      /> */}
      <View style={styles.containerLottie}>
        <LottieView
          source={img}
          autoPlay
          loop
          style={{
            width: width,
            height: width / 1.5,
          }}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 5,
    padding: 40,
    justifyContent: 'center',
  },
  containerLottie: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 22,
  },
  desc: {
    color: colors.text,
    marginTop: 20,
    fontWeight: 'semibold',
    fontSize: 16,
    lineHeight: 24,
  },
});
