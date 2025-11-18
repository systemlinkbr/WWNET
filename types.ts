export enum PaymentStatus {
  FORM,
  GENERATING,
  PENDING,
  SUCCESS,
  ERROR
}

export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export interface PixData {
  paymentId: string;
  qrCode: string;
  copiaECola: string;
}