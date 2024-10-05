import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {StorageAdapter} from '../../../config/adapters/storage-adapter';
import {LayoutGoBack} from '../../components/ui/LayoutGoBack';
import {RootStackParamsBottom} from '../../navigation/BottomTabNavigator';
import {InteractionStackParams} from '../../navigation/StackInteractions';
import {useTransactionStore} from '../../store/useTransactionStore';

export const InteractionDetailScreen = () => {
  const {idInteraction} =
    useRoute<RouteProp<InteractionStackParams, 'InteractionDetailScreen'>>()
      .params;
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamsBottom>>();
  const {
    getTransactionId,

    putTransactionId,
    transactionId,
  } = useTransactionStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  const translateStatus = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'disapproved':
        return 'Rechazado';
      case 'network_error':
        return 'Error de red';
      case 'user_not_found':
        return 'Usuario no encontrado';
      case 'waiting_user':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const getToken = async () => {
    try {
      const token = await StorageAdapter.getItem('tokenLogin');
      return token;
    } catch (err) {
      setError('Error al obtener el token.');
      return null;
    }
  };

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      const token = await getToken();
      if (!token) {
        setError('Token no disponible.');
        setLoading(false);
        return;
      }

      try {
        await getTransactionId(token, idInteraction);
      } catch (err) {
        setError('Error al obtener los detalles de la transacción.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [idInteraction]);

  const handleAccept = async () => {
    const token = await getToken();
    if (!token) {
      setError('Token no disponible.');
      return;
    }

    try {
      await putTransactionId(token, idInteraction, 'approved');
      setModalMessage('Transacción aceptada con éxito.');
    } catch (err) {
      setModalMessage('Error.');
    } finally {
      setModalVisible(true);
    }
  };

  const handleReject = async () => {
    const token = await getToken();
    if (!token) {
      setError('Token no disponible.');
      return;
    }

    try {
      await putTransactionId(token, idInteraction, 'disapproved');
      setModalMessage('Transacción rechazada con éxito.');
    } catch (err) {
      setModalMessage('Error al rechazar la transacción.');
    } finally {
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsNavigating(true);
    setTimeout(() => {
      /*    navigation.reset({
        index: 0,
        routes: [{name: 'HomeScreen'}],
      }); */
      navigation.navigate('HomeScreen');
    }, 300);
  };

  if (loading || isNavigating) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredView}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LayoutGoBack title="Volver" />
      <Text style={styles.title}>Detalles de la Transacción</Text>
      <Text style={styles.detail}>N° de operación: {transactionId?.id}</Text>
      <Text style={styles.detail}>
        Id de la empresa:
        {transactionId?.id_company_origin
          ? transactionId.id_company_origin
          : '  Null'}
      </Text>
      <Text style={styles.detail}>Detalle: {transactionId?.detail}</Text>
      <Text style={styles.detail}>
        Estado: {translateStatus(transactionId?.status)}
      </Text>

      {transactionId?.status === 'network_error' ||
      transactionId?.status === 'user_not_found' ||
      transactionId?.status === 'waiting_user' ? (
        <View style={styles.buttonContainer}>
          <Button title="Aceptar" onPress={handleAccept} />
          <Button title="Rechazar" onPress={handleReject} />
        </View>
      ) : null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Button title="Cerrar" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detail: {
    fontSize: 18,
    marginVertical: 8,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: 250,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
