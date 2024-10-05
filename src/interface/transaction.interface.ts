export interface Transactions {
  message: string;
  transactions: {[key: string]: Transaction};
}

export interface Transaction {
  id: number;
  id_company_origin: null;
  cuit_company_origin: null;
  id_user_origin: number;
  cuil_user_origin: null;
  id_operator_origin: null;
  cuil_operator_origin: null;
  id_customer: number;
  data_customer: string;
  date: Date;
  status: string;
  interaction: string;
  onSite: string;
  detail: string;
  ip_origin: string;
  ip_answer: string;
  geolocation: string;
}
