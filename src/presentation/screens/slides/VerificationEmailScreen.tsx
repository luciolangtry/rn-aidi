import {StackScreenProps} from '@react-navigation/stack';
import React, {useState} from 'react';
import {Text, TextInput, View, Button, Modal} from 'react-native';
import {SlidesStackParams} from '../../navigation/StackSlidesNavigator';
import {useRegisterStore} from '../../store/useRegisterStore';

interface Props
  extends StackScreenProps<SlidesStackParams, 'VerificationEmailScreen'> {}

export const VerificationEmailScreen = ({navigation, route}: Props) => {
  const {email} = route.params;
  const {validateOtp} = useRegisterStore();
  const [otpCode, setOtpCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleVerifyOtp = async () => {
    try {
      await validateOtp(otpCode);
      setModalMessage('Verificación exitosa de correo');
      setIsError(false);
      setModalVisible(true);
    } catch (err: any) {
      setModalMessage(err.message || 'Ocurrió un error al verificar el código');
      setIsError(true);
      setModalVisible(true);
    }
  };

  // Función para ocultar el modal y redirigir si la verificación fue exitosa
  const handleModalDismiss = () => {
    setModalVisible(false);
    
    if (!isError) {
      navigation.replace('TakePhotoScreen');
    }
  };

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 20, marginBottom: 20}}>
        Ingresa el código enviado a {email}
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 20,
        }}
        placeholder="Código de verificación"
        value={otpCode} // Almacena el valor en el estado otpCode
        onChangeText={setOtpCode} // Almacena el código OTP en el estado
        keyboardType="numeric"
      />

      {/* Botón para verificar el OTP */}
      <Button title="Verificar Código" onPress={handleVerifyOtp} />

      {/* Modal para mostrar mensajes */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <Text>{modalMessage}</Text>
            <Button
              title={isError ? 'Cerrar' : 'Continuar'}
              onPress={handleModalDismiss}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
