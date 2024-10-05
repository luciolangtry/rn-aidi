import {Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {Alert, Image} from 'react-native';
import {colors} from '../../../config/colors';
import {StorageAdapter} from '../../../config/adapters/storage-adapter';
import {LoadingScreen} from '../loading/LoadingScreen';
import {URL_BACK} from '@env';

interface UserData {
  email: string;
  phone: string;
}

export const HomeScreen = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtén los datos del almacenamiento
        const name = await StorageAdapter.getItem('nameUser');
        const storedDni = await StorageAdapter.getItem('dniUser');
        const avatar = await StorageAdapter.getItem('userAvatar');

        // Si no hay DNI, muestra una alerta y no procede con el fetch
        if (!storedDni) {
          Alert.alert('Error', 'No se encontró el DNI del usuario');
          setLoading(false);
          return;
        }

        // Actualiza el estado para mostrar la UI de usuario
        setUserName(name);
        setUserAvatar(avatar);

        // Realiza la llamada fetch después de asegurar que el DNI existe
        const response = await fetch(`${URL_BACK}/api/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({dni: storedDni}), 
        });

        const result = await response.json();


        // Manejo de la respuesta del servidor
        if (response.ok) {
          setUserData({
            email: result.user.email,
            phone: result.user.phone,
          });

          // Guarda el token en el Storage
          await StorageAdapter.setItem('tokenLogin', result.token);
          console.log('Token guardado del login:', result.token);
        } else {
          Alert.alert(
            'Error',
            result.message || 'Error al obtener los datos del usuario',
          );
        }
      } catch (error) {
        Alert.alert('Error', 'Error de red o servidor');
      } finally {
        setLoading(false); 
      }
    };

    fetchUserData();
  }, []); 

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout style={{flex: 1, backgroundColor: colors.background}}>
      <Layout
        style={{
          padding: 10,
          backgroundColor: colors.primary,
        }}>
        <Image
          source={{
            uri: userAvatar || 'https://i.pravatar.cc/300',
          }}
          style={{width: 100, height: 100, borderRadius: 50}}
        />
      </Layout>

      <Layout
        style={{
          marginHorizontal: 20,
          gap: 30,
          backgroundColor: colors.background,
        }}>
        <Layout style={{backgroundColor: colors.background}}>
          <Text category="h5">Nombre:</Text>
          <Text>{userName ? `Hola ${userName}` : 'Cargando...'}</Text>
        </Layout>
        <Layout style={{backgroundColor: colors.background}}>
          <Text category="h5">Email:</Text>
          <Text>{userData?.email || 'Cargando...'}</Text>
        </Layout>
        <Layout style={{backgroundColor: colors.background}}>
          <Text category="h5">Teléfono:</Text>
          <Text>{userData?.phone || 'Cargando...'}</Text>
        </Layout>
      </Layout>
    </Layout>
  );
};
