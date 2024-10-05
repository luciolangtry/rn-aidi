import axios from 'axios';
import { create } from 'zustand';
import {URL_BACK} from '@env';

export interface RegisterState {
  transactions: any[];
  transactionId: any;

  getTransactionsUser: (token: string) => Promise<void>;
  getTransactionId: (token: string, id: string) => Promise<void>;
  putTransactionId: (
    token: string,
    id: string,
    status: string,
  ) => Promise<{success: boolean; updatedTransaction?: any; message?: string}>;
}

export const useTransactionStore = create<RegisterState>()(set => ({
  transactions: [],
  transactionId: {},

  getTransactionsUser: async (token: string) => {
    if (!token) {
      throw new Error('Token no disponible.');
    }

    try {
      const response = await axios.get(
        `${URL_BACK}/api/transactions/user`,
        {
          headers: {
            authorization: token,
          },
        },
      );
 

      if (response.status === 200) {
        set({transactions: response.data?.transactions});
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          'Ocurrió un error al obtener las transacciones',
      );
    }
  },

  getTransactionId: async (token: string, id: string) => {
    if (!id) {
      throw new Error('Token no disponible.');
    }

    try {
      const response = await axios.get(
        `${URL_BACK}/api/transactions/${id}`,
        {
          headers: {
            authorization: token,
          },
        },
      );

      if (response.status === 200) {
        set({transactionId: response.data.transaction});
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          'Ocurrió un error al obtener las transacciones',
      );
    }
  },

  putTransactionId: async (
    token: string,
    id: string,
    status: string,
  ): Promise<{
    success: boolean;
    updatedTransaction?: any;
    message?: string;
  }> => {
    if (!id) {
      throw new Error('ID no disponible.');
    }

    try {
      const response = await axios.put(
        `${URL_BACK}/api/transactions/${id}`,
        {status},
        {
          headers: {
            authorization: token,
          },
        },
      );

      if (response.status === 200) {
        return {
          success: true,
          updatedTransaction: response.data.transaction,
        };
      }
      
    } catch (err: any) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          'Error al cambiar el estado de la transacción',
      };
    }

    // En caso de que no se cumpla ninguna de las condiciones
    return {
      success: false,
      message: 'No se pudo cambiar el estado de la transacción.',
    };
  },
}));
