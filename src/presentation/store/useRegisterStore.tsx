import { URL_BACK } from '@env';
import axios from 'axios';
import { create } from 'zustand';
import { StorageAdapter } from '../../config/adapters/storage-adapter';

export interface RegisterState {
  token: string;
  tokenApp: string;

  sendEmail: (email: string) => Promise<boolean>;
  validateOtp: (otpCode: string) => Promise<void>;
  setTokenApp: (fcmToken: string) => void;
}

export const useRegisterStore = create<RegisterState>()((set, get) => ({
  token: '',
  tokenApp: '',

  sendEmail: async (email: string) => {
    try {
      const response = await axios.post(`${URL_BACK}/api/users/sendEmailOtp`, {
        email,
      });

      if (response.status === 200) {
        set({token: response.data.token});
      }

      await StorageAdapter.setItem('userEmail', email);

      return true;
    } catch (err: any) {
      throw new Error(
        err.response.data.message || 'Ocurrió un error al enviar el email',
      );
    }
  },

  validateOtp: async (otpCode: string) => {
    const {token} = get();

    if (!token) {
      throw new Error('Token no disponible.');
    }

    try {
      const response = await axios.post(
        // 'http://192.168.0.6:3003/api/users/validateEmailOtp',
        `${URL_BACK}/api/users/validateEmailOtp`,
        {otpCode},
        {
          headers: {
            authorization: token,
          },
        },
      );

      if (response.status === 200) {
        set({token: response.data.token});
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          'Ocurrió un error al validar el código OTP',
      );
    }
  },

  setTokenApp: (fcmToken: string) => {
    set({tokenApp: fcmToken});
  },
  
}));
