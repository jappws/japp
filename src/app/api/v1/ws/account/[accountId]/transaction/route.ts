import prisma from "@/lib/prisma";
import { TransactionTypeType } from "@/lib/types";

import { Prisma } from "@prisma/client";

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

export async function POST(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const body: BodyRequestType = await request.json();
    const { receiverAccountId, ...bodyWithoutReceiverId } = body;

    let balanceAfter: number = 0;

    if (body.type === "DEPOSIT" || body.type === "LOAN_PAYMENT") {
      const account = await prisma.account.update({
        where: { id: Number(params.accountId) },
        data: {
          balance: { increment: body.amount },
        },
        select: { balance: true },
      });
      balanceAfter = account.balance;

      const newTransaction = await prisma.transaction.create({
        data: {
          ...bodyWithoutReceiverId,
          balanceAfter: balanceAfter,
          accountId: Number(params.accountId),
        },
      });
      return new Response(JSON.stringify({ ...newTransaction }));
    } else if (
      body.type === "WITHDRAWAL" ||
      body.type === "LOAN_DISBURSEMENT"
    ) {
      const account = await prisma.account.update({
        where: { id: Number(params.accountId) },
        data: {
          balance: { decrement: body.amount },
        },
        select: { balance: true },
      });
      balanceAfter = account.balance;

      const newTransaction = await prisma.transaction.create({
        data: {
          ...bodyWithoutReceiverId,
          balanceAfter: balanceAfter,
          accountId: Number(params.accountId),
        },
      });

      return new Response(JSON.stringify({ ...newTransaction }));
    } else if ("TRANSFER") {
      
      const { receiverAccountId, type, ...bodyWithoutReceiverIdAndType } = body;
      let senderBalanceAfter: number = 0;
      let receiverBalanceAfter: number = 0;

      await prisma.$transaction(async (tx) => {
        const senderAccount = await tx.account.update({
          where: { id: Number(params.accountId) },
          data: {
            balance: { decrement: body.amount },
          },
          select: { balance: true },
        });

        senderBalanceAfter = senderAccount.balance;

        const receiverAccount = await tx.account.update({
          where: { id: Number(body.receiverAccountId) },
          data: {
            balance: { increment: body.amount },
          },
          select: { balance: true },
        });
        receiverBalanceAfter = receiverAccount.balance;
      });

      const newTrans = await prisma.transaction.createMany({
        data: [
          {
            ...bodyWithoutReceiverId,
            balanceAfter: senderBalanceAfter,
            accountId: Number(params.accountId),
          },
          {
            ...bodyWithoutReceiverIdAndType,
            balanceAfter: receiverBalanceAfter,
            type: "RECEIPT_OF_TRANSFER",
            accountId: Number(body.receiverAccountId),
          },
        ],
      });

      return new Response(JSON.stringify(newTrans));
    }

    return new Response(JSON.stringify({}));
  } catch (e: any) {
    //Tracking prisma error
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      const error_response = {
        status: "fail",
        code: e.code,
        message: e.message,
        clientVersion: e.clientVersion,
      };
      return new Response(JSON.stringify(error_response), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    // tracking other internal server
    const error_response = {
      status: "error",
      message: e.message,
    };
    return new Response(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
