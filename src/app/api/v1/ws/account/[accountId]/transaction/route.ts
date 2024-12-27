import prisma from "@/lib/prisma";
import { TransactionTypeType } from "@/lib/types/index.d";

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
    let res: any;

    if (body.type === "DEPOSIT" || body.type === "LOAN_PAYMENT") {
      await prisma.$transaction(async (tx) => {
         await tx.account.update({
          where: { id: Number(params.accountId) },
          data: {
            balance: { increment: body.amount },
          },
          select: { balance: true },
        });

        const newTransaction = await tx.transaction.create({
          data: {
            ...bodyWithoutReceiverId,
            accountId: Number(params.accountId),
          },
        });
        res = { ...newTransaction };
      });

      return new Response(JSON.stringify(res));
    } else if (
      body.type === "WITHDRAWAL" ||
      body.type === "LOAN_DISBURSEMENT"
    ) {
      await prisma.$transaction(async (tx) => {
       await tx.account.update({
          where: { id: Number(params.accountId) },
          data: {
            balance: { decrement: body.amount },
          },
          select: { balance: true },
        });

        const newTransaction = await tx.transaction.create({
          data: {
            ...bodyWithoutReceiverId,
            accountId: Number(params.accountId),
          },
        });
        res = { ...newTransaction };
      });

      return new Response(JSON.stringify(res));
    } else if (body.type === "TRANSFER") {
      const {
        receiverAccountId,
        type,
        title,
        message,
        ...bodyWithoutReceiverIdTitleMessageAndType
      } = body;


      await prisma.$transaction(async (tx) => {
         await tx.account.update({
          where: { id: Number(params.accountId) },
          data: {
            balance: { decrement: body.amount },
          },
          select: { balance: true },
        });


         await tx.account.update({
          where: { id: Number(body.receiverAccountId) },
          data: {
            balance: { increment: body.amount },
          },
          select: { balance: true },
        });
      });

      await prisma.transaction.createMany({
        data: [
          {
            ...bodyWithoutReceiverId,
            accountId: Number(params.accountId),
          },
          {
            ...bodyWithoutReceiverIdTitleMessageAndType,
            type: "RECEIPT_OF_TRANSFER",
            accountId: Number(body.receiverAccountId),
            title: "Réception du virement",
          },
        ],
      });

      return new Response(JSON.stringify({ message: "Transfer succeded" }));
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
