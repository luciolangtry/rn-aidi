import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button, Input, Layout, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {colors} from '../../../config/colors';
import {SlidesStackParams} from '../../navigation/StackSlidesNavigator';
import {useRegisterStore} from '../../store/useRegisterStore';

export const EmailScreen = () => {
  const navigation = useNavigation<StackNavigationProp<SlidesStackParams>>();
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const {sendEmail, token} = useRegisterStore();

  const handleEmailSubmit = async () => {
    try {
      await sendEmail(email);
      setModalMessage('Código enviado con éxito. Revisa tu email.');
      setIsError(false);
    } catch (err: any) {
      setModalMessage(err.message);
      setIsError(true);
    }

    setModalVisible(true);
  };

  const handleModalDismiss = () => {
    setModalVisible(false);
    if (!isError) {
      if (token) {
        navigation.replace('VerificationEmailScreen', {email});
      } else {
        setModalMessage('El token no está disponible.');
        setIsError(true);
        setModalVisible(true);
      }
    }
  };

  return (
    <Layout style={styles.container}>
      <Text style={styles.title}>Ingresa tu Email</Text>
      <Input
        style={styles.input}
        placeholder="Tu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button
        onPress={handleEmailSubmit}
        style={{backgroundColor: colors.primary, borderWidth: 0}}>
        Enviar Código
      </Button>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalDismiss}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontSize: 16}}>{modalMessage}</Text>
            <Pressable
              onPress={handleModalDismiss}
              style={{
                backgroundColor: colors.primary,
                padding: 10,
                borderRadius: 4,
                marginVertical: 10,
              }}>
              <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>
                {isError ? 'Cerrar' : 'Continuar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
