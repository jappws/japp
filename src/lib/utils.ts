import { isNull } from "lodash";
import prisma from "./prisma";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AccountType, TransactionTypeType, TransferTypeType } from "./types/index.d";
import { SelectProps } from "antd";

///////////////////////////////////////////
/////////// classname ////////////////////
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//////////////////////////////////////////////
/////// get the existance of company ////////
export const getCompanyExistance = async () => {
  try {
    const company = await prisma.company.findUnique({ where: { id: 1 } });
    if (isNull(company)) return undefined;
    return company;
  } catch (e: any) {}
};

//////////////////////////////////////////
/////// get transaction title ///////////

export const getTransactionTitle = (transType: TransactionTypeType) => {
  switch (transType) {
    case "DEPOSIT":
      return "Dépôt d'argent sur le compte";
      break;
    case "WITHDRAWAL":
      return "Retrait d'argent sur le compte";
      break;
    case "LOAN_DISBURSEMENT":
      return "Décaissement de crédit";
      break;
    case "LOAN_PAYMENT":
      return "Rembourssement de crédit";
      break;
    case "TRANSFER":
      return "Virement";
      break;
    case "RECEIPT_OF_TRANSFER":
      return "Réception du virement";
      break;
    default:
      return "";
      break;
  }
};

export const getTransferTitle = (transType?: TransferTypeType) => {
  switch (transType) {
    case "MONEY_TRANSFER":
      return "Transfet d'argent";
      break;
    case "GOLD_TRANSFER":
      return "Expédition de l'or";
      break;
    default:
      return "";
      break;
  }
};

export const getInOrOutType = (transType?: TransactionTypeType) => {
  switch (transType) {
    case "DEPOSIT":
      return "Entrée";
      break;
    case "WITHDRAWAL":
      return "Sortie";
      break;
    case "LOAN_DISBURSEMENT":
      return "Sortie";
      break;
    case "LOAN_PAYMENT":
      return "Entrée";
      break;
    case "TRANSFER":
      return "Sortie";
      break;
    case "RECEIPT_OF_TRANSFER":
      return "Entrée";
      break;
    default:
      return "";
      break;
  }
};

export const getAccountsAsOptions = (data: AccountType[] | undefined) => {
  const options = data?.map((item) => {
    return {
      label: `${item?.owner.firstName} ${item?.owner.lastName} ${item?.owner.surname} #${item.accountNumber}`,
      value: item.id,
    };
  }) as SelectProps["options"];

  return options;
};

////////////////////////////////////////
///////// generate hslColor ///////////
const getHashOfString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return hash;
};

const normalizeHash = (hash: number, min: number, max: number) => {
  return Math.floor((hash % (max - min)) + min);
};

const generateHSL = (name: string) => {
  const hRange = [0, 360];
  const sRange = [50, 75];
  const lRange = [25, 60];
  const hash = getHashOfString(name);
  const h = normalizeHash(hash, hRange[0], hRange[1]);
  const s = normalizeHash(hash, sRange[0], sRange[1]);
  const l = normalizeHash(hash, lRange[0], lRange[1]);
  return [h, s, l];
};

export const getHSLColor = (name: string) => {
  const hsl = generateHSL(name);

  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};
