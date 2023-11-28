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
};

export async function POST(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const body: BodyRequestType = await request.json();

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
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        ...body,
        balanceAfter: balanceAfter,
        accountId: Number(params.accountId),
      },
    });
    const res = {
      ...newTransaction,
    };

    return new Response(JSON.stringify(res));
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
