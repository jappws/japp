import { type } from "os";

//Define LoginType enum
export enum LoginType {
  PHONE = "PHONE",
  EMAIL = "EMAIL",
}

// Define the User type model
export type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  surname: string;
  username: string;
  nickname: string;
  phone: string;
  sex: SexType;
  otherPhone: string;
  email: string;
  avatar: string;
  password: string;
  blocked: boolean;
  deleted: boolean;
  country: string;
  province: string;
  city: string;
  address: string;
  account: AccountType;
  usersCreated: UserType[];
  createdBy: UserType;
  createdById: number;
  role: RoleType;
  createdTransactionsOperations: TransactionType[];
  createdTransfersOperations: TransferType[];
  createdAt: Date;
  updatedAt: Date;
};

//Define the SexType enum
export enum SexType {
  M = "M",
  F = "F",
}

// Define the RoleType enum
export enum RoleType {
  CLIENT = "CLIENT",
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

// Define the Account Type model
export type AccountType = {
  id: number;
  accountNumber: string;
  balance: number;
  owner: UserType;
  ownerId: number;
  transactions: TransactionType[];
  createdAt: Date;
  updatedAt: Date;
};

// Define the Transaction type model
export type TransactionType = {
  id: number;
  date: string;
  amount: number;
  balanceAfter: number;
  goldQuantity: string;
  title: string;
  message: string; // Un commentaire, une observation sur la transaction
  type: TransactionTypeType;
  account: AccountType;
  accountId: number;
  operator: UserType;
  operatorId: number;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

//Define the TransactionType enum
export enum TransactionTypeType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRANSFER = "TRANSFER", //Virement
  RECEIPT_OF_TRANSFER = "RECEIPT_OF_TRANSFER", // Réception du virement
  LOAN_DISBURSEMENT = "LOAN_DISBURSEMENT", // Décaissement de prêt
  LOAN_PAYMENT = "LOAN_PAYMENT", // Rembourssement de prêt
}

// Define the company type model
export type CompanyType = {
  id: number;
  code: string;
  name: string;
  shortName: string;
  description: string;
  logo: string;
  motto: string;
  icon: string;
  currency: IsoCodeCurrencyType;
  webSiteUrl: string;
  phone1: string;
  phone2: string;
  email: string;
  country: string;
  province: string;
  city: string;
  address: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
};
// Define the statusType enum
export enum StatusType {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
}

//Define the IsoCodeCurrencyType enum
export enum IsoCodeCurrencyType {
  USD = "USD",
  CDF = "CDF",
}

// Define transfer type model
export type TransferType = {
  id: number;
  date: Date;
  type: TransferTypeType;
  amount: number;
  balanceAfter: number;
  goldQuantity: string;
  sender: string;
  message: string; // Un commentaire, une observation sur le transfer
  partner: PartnerType;
  partnerId: number;
  operator: UserType;
  operatorId: number;
  createdAt: Date;
  updatedAt: Date;
};

//Define the TransferType enum
export enum TransferTypeType {
  MONEY_TRANSFER = "MONEY_TRANSFER",
  GOLD_TRANSFER = "GOLD_TRANSFER",
}

// Define boss partner type model
export type PartnerType = {
  id: number;
  code: string;
  balance: number;
  transfers: TransferType[];
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// rangeValue type (ant.design DatePicker)
export type RangeValue = [Dayjs | null, Dayjs | null] | null;
