import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Layout, Text} from '@ui-kitten/components';
import React, {useCallback, useEffect} from 'react';
import {Pressable, SectionList, StyleSheet} from 'react-native';
import {StorageAdapter} from '../../../config/adapters/storage-adapter';
import {Transaction} from '../../../interface/transaction.interface';
import {MyIcon} from '../../components/ui/MyIcon';
import {InteractionStackParams} from '../../navigation/StackInteractions';
import {useTransactionStore} from '../../store/useTransactionStore';

export const InteractionScreen = () => {
  const today = new Date().toLocaleDateString();
  const {getTransactionsUser, transactions} = useTransactionStore();
  const navigation =
    useNavigation<StackNavigationProp<InteractionStackParams>>();

  useFocusEffect(
    useCallback(() => {
      const fetchTransactions = async () => {
        console.log('Pantalla InteractionScreen en foco');
        try {
          const token = await StorageAdapter.getItem('tokenLogin');
          if (token) {
            await getTransactionsUser(token);
          } else {
            console.error('Token no disponible');
          }
        } catch (error: any) {
          console.error('Error al obtener transacciones:', error.message);
        }
      };

      fetchTransactions();
    }, [getTransactionsUser]),
  );

  const transactionsArray = transactions ? Object.values(transactions) : [];

  // Filtra transacciones de hoy
  const todayTransactions = transactionsArray.filter(transaction => {
    const transactionDate = new Date(transaction.date).toLocaleDateString();
    return transactionDate === today;
  });

  // Agrupa las transacciones por fecha
  const groupedTransactions = transactionsArray.reduce(
    (groups, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {} as {[key: string]: Transaction[]},
  );

  // Convierte a un array de secciones para SectionList
  const sections = [
    {
      title: 'Hoy',
      data: todayTransactions.length > 0 ? todayTransactions : [],
    },
    ...Object.keys(groupedTransactions).map(date => ({
      title: `Interacciones del ${date}`,
      data: groupedTransactions[date],
    })),
  ];

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

  // Función para truncar texto largo
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const renderTransaction = ({item}: {item: Transaction}) => {
    const transactionTime = new Date(item.date).toLocaleTimeString();

    const handlePress = () => {
      navigation.navigate('InteractionDetailScreen', {
        idInteraction: item.id.toString(),
      });
    };

    return (
      <Pressable style={styles.interactionContainer} onPress={handlePress}>
        <Layout style={styles.detailContainer1}>
          <MyIcon name="radio-button-off-outline" />
          <Layout>
            <Text style={styles.city}>Empresa</Text>
            <Text style={styles.city}>{truncateText(item.detail, 8)}</Text>
          </Layout>
          <Layout style={styles.statusContainer}>
            <Text style={styles.status}>{translateStatus(item.status)}</Text>
            <Text style={styles.time}>{transactionTime}</Text>
          </Layout>
        </Layout>
      </Pressable>
    );
  };

  const renderSectionHeader = ({section}: {section: {title: string}}) => (
    <Text style={styles.dateTitle}>{section.title}</Text>
  );

  return (
    <Layout style={styles.container}>
      {sections.length === 0 ||
      sections.every(section => section.data.length === 0) ? (
        <Text style={styles.noTransactionsText}>
          No hay interacciones disponibles
        </Text>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id.toString() + index}
          renderItem={renderTransaction}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.container}
        />
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  interactionContainer: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 5,
  },
  detailContainer1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statusContainer: {
    gap: 1,
  },
  city: {
    fontSize: 16,
    fontWeight: '500',
  },
  time: {
    fontSize: 14,
    color: 'gray',
  },
  status: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'blue',
  },
  noTransactionsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginVertical: 20,
  },
});
