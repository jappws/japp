import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { isNull } from "lodash";
import { type NextRequest } from "next/server";
import { TransactionTypeType } from "@/lib/types";

// Type pour la requête du corps
type BodyRequestType = {
  date: Date;
  amount: number;
  goldQuantity?: string;
  title: string;
  message: string;
  operatorId: number;
  receiverAccountId?: number;
};

// Constantes pour les messages d'erreur et de succès
const TRANSACTION_NOT_FOUND = "transaction_not_found";
const TRANSACTION_DELETED_SUCCESS = "Transaction is deleted successfully";
const ACCOUNT_NOT_FOUND = "account_not_found";

////////////////////////////////////////////////////
//////////// Mettre à jour une transaction /////////
//////////////////////////////////////////////////

export async function PUT(
  request: NextRequest,
  { params }: { params: { accountId: string; transactionId: string } }
) {
  try {
    // Récupérer les paramètres de la requête
    const { accountId, transactionId } = params;
    const body: BodyRequestType = await request.json();
    const { receiverAccountId, ...bodyWithoutReceiverId } = body;

    // Trouver la transaction spécifiée
    const getTransaction = await prisma.transaction.findUnique({
      where: { id: Number(transactionId) },
    });

    // Si la transaction n'est pas trouvée, lever une erreur
    if (isNull(getTransaction)) {
      throw new Error(TRANSACTION_NOT_FOUND);
    }

    let res: any;
    await prisma.$transaction(async (tx) => {
      // Trouver le compte
      const account = await tx.account.findUnique({
        where: { id: Number(accountId) },
        select: { balance: true },
      });

      // Vérifier que le compte n'est pas nul
      if (!account) {
        throw new Error(ACCOUNT_NOT_FOUND);
      }

      // Récupérer la valeur actuelle du solde
      const currentBalance = account.balance;

      let balanceUpdateData;
      if (getTransaction.type === TransactionTypeType.DEPOSIT || getTransaction.type === TransactionTypeType.LOAN_PAYMENT) {
        // Condition 1: Dépôt ou paiement de prêt
        balanceUpdateData = currentBalance - getTransaction.amount + body.amount;
      } else if (getTransaction.type === TransactionTypeType.WITHDRAWAL || getTransaction.type === TransactionTypeType.LOAN_DISBURSEMENT) {
        // Condition 2: Retrait ou décaissement de prêt
        balanceUpdateData = currentBalance + getTransaction.amount - body.amount;
      } else {
        // Condition 3: Autres types de transactions (non supportés)
        throw new Error("Unsupported transaction type");
      }

      // Mettre à jour le solde du compte
      await tx.account.update({
        where: { id: Number(accountId) },
        data: { balance: balanceUpdateData },
      });

      // Mettre à jour la transaction
      const editedTransaction = await tx.transaction.update({
        where: { id: Number(transactionId) },
        data: {
          ...bodyWithoutReceiverId,
          accountId: Number(accountId),
        },
      });
      res = { ...editedTransaction };
    });

    return new Response(JSON.stringify(res));
  } catch (e: any) {
    return handleError(e);
  }
}

//////////////////////////////////////////////////////////
//////////// Supprimer une transaction //////////////////
////////////////////////////////////////////////////////

export async function DELETE(
  request: NextRequest,
  { params }: { params: { accountId: string; transactionId: string } }
) {
  try {
    // Récupérer les paramètres de la requête
    const { accountId, transactionId } = params;
    const getTransaction = await prisma.transaction.findUnique({
      where: { id: Number(transactionId) },
    });

    // Si la transaction n'est pas trouvée, lever une erreur
    if (isNull(getTransaction)) {
      throw new Error(TRANSACTION_NOT_FOUND);
    }

    let res: any;
    await prisma.$transaction(async (tx) => {
      // Trouver le compte
      const account = await tx.account.findUnique({
        where: { id: Number(accountId) },
        select: { balance: true },
      });

      // Vérifier que le compte n'est pas nul
      if (!account) {
        throw new Error(ACCOUNT_NOT_FOUND);
      }

      // Récupérer la valeur actuelle du solde
      const currentBalance = account.balance;

      let balanceUpdateData;
      if (getTransaction.type === TransactionTypeType.DEPOSIT || getTransaction.type === TransactionTypeType.LOAN_PAYMENT) {
        // Condition 1: Dépôt ou paiement de prêt
        balanceUpdateData = currentBalance - getTransaction.amount;
      } else if (getTransaction.type === TransactionTypeType.WITHDRAWAL || getTransaction.type === TransactionTypeType.LOAN_DISBURSEMENT) {
        // Condition 2: Retrait ou décaissement de prêt
        balanceUpdateData = currentBalance + getTransaction.amount;
      } else {
        // Condition 3: Autres types de transactions (non supportés)
        throw new Error("Unsupported transaction type");
      }

      // Mettre à jour le solde du compte
      await tx.account.update({
        where: { id: Number(accountId) },
        data: { balance: balanceUpdateData },
      });

      // Supprimer la transaction
      const deletedTransaction = await tx.transaction.delete({
        where: { id: Number(transactionId) },
      });
      res = {
        res_message: TRANSACTION_DELETED_SUCCESS,
        ...deletedTransaction,
      };
    });

    return new Response(JSON.stringify(res));
  } catch (e: any) {
    return handleError(e);
  }
}

//////////////////////////////////////////////////////////
//////////// Gestion des erreurs ////////////////////////
////////////////////////////////////////////////////////

function handleError(e: any) {
  let status = 500;
  let message = e.message;

  // Vérifier si l'erreur est une transaction non trouvée
  if (e.message === TRANSACTION_NOT_FOUND) {
    status = 404;
    message = TRANSACTION_NOT_FOUND;
  } else if (e.message === ACCOUNT_NOT_FOUND) {
    status = 404;
    message = ACCOUNT_NOT_FOUND;
  } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
    // Vérifier si l'erreur est une erreur connue de Prisma
    status = 400;
    message = e.message;
  }

  // Créer la réponse d'erreur
  const error_response = {
    status: status === 400 ? "fail" : "error",
    message,
    code: e.code,
    clientVersion: e.clientVersion,
  };

  return new Response(JSON.stringify(error_response), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}