import prisma from "@/lib/prisma";
import { TransactionTypeType } from "@/lib/types/index.d";
import { Prisma } from "@prisma/client";
import { type NextRequest } from "next/server";

type BodyRequestType = {
  date: Date;
  amount: number;
  goldQuantity?: string;
  title: string;
  message: string;
  type: TransactionTypeType;
  operatorId: number;
  receiverAccountId?: number;
};

async function handleTransaction(
  accountId: string,
  body: BodyRequestType,
  updateBalance: (tx: Prisma.TransactionClient, accountId: number, amount: number) => Promise<void>
) {
  let res: any;

  await prisma.$transaction(async (tx) => {
    // Mettre à jour le solde du compte
    await updateBalance(tx, Number(accountId), body.amount);

    // Créer une nouvelle transaction 
    const newTransaction = await tx.transaction.create({
      data: {
        ...body,
        accountId: Number(accountId),
      },
    });
    res = { ...newTransaction };
  });

  return new Response(JSON.stringify(res), { status: 201 });
}

// Fonctions utilitaires pour incrémenter et décrémenter le solde
const incrementBalance = async (tx: Prisma.TransactionClient, accountId: number, amount: number): Promise<void> => {
  await tx.account.update({
    where: { id: accountId },
    data: { balance: { increment: amount } },
  });
};

const decrementBalance = async (tx: Prisma.TransactionClient, accountId: number, amount: number): Promise<void> => {
  await tx.account.update({
    where: { id: accountId },
    data: { balance: { decrement: amount } },
  });
};

async function handleError(e: any) {
  const error_response = {
    status: e instanceof Prisma.PrismaClientKnownRequestError ? "fail" : "error",
    code: e.code,
    message: e.message,
    clientVersion: e.clientVersion,
  };
  return new Response(JSON.stringify(error_response), {
    status: e instanceof Prisma.PrismaClientKnownRequestError ? 400 : 500,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const { accountId } = params;
    const body: BodyRequestType = await request.json();

    switch (body.type) {
      case TransactionTypeType.DEPOSIT:
      case TransactionTypeType.LOAN_PAYMENT:
        return await handleTransaction(accountId, body, incrementBalance);

      case TransactionTypeType.WITHDRAWAL:
      case TransactionTypeType.LOAN_DISBURSEMENT:
        return await handleTransaction(accountId, body, decrementBalance);

      case TransactionTypeType.TRANSFER:
        const { receiverAccountId, ...bodyWithoutReceiverId } = body;
        if (!receiverAccountId) throw new Error("Receiver account ID is required for transfer");

        await prisma.$transaction(async (tx) => {
          // Mettre à jour le solde du compte expéditeur
          await decrementBalance(tx, Number(accountId), body.amount);

          // Mettre à jour le solde du compte destinataire
          await incrementBalance(tx, Number(receiverAccountId), body.amount);
        });

        // Créer les transactions pour le transfert
        await prisma.transaction.createMany({
          data: [
            {
              ...bodyWithoutReceiverId,
              accountId: Number(accountId),
            },
            {
              ...bodyWithoutReceiverId,
              type: TransactionTypeType.RECEIPT_OF_TRANSFER,
              accountId: Number(receiverAccountId),
              title: "Réception du virement",
            },
          ],
        });

        return new Response(JSON.stringify({ message: "Transfer succeeded" }), { status: 201 });

      default:
        throw new Error("Invalid transaction type");
    }
  } catch (e: any) {
    return handleError(e);
  }
}