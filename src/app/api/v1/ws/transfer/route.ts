import prisma from "@/lib/prisma";
import { TransactionTypeType, TransferTypeType } from "@/lib/types";

import { Prisma } from "@prisma/client";

type BodyRequestType = {
  date: Date;
  type: TransferTypeType;
  amount: number;
  goldQuantity?: string;
  sender: string;
  message?: string;
  operatorId: number;
};

export async function POST(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const body: BodyRequestType = await request.json();

    let balanceAfter: number = 0;

    if (body.type === "GOLD_TRANSFER") {
      const account = await prisma.transferBalance.upsert({
        where: { id: 1 },
        create: { balance: body.amount },
        update: {
          balance: { increment: body.amount },
        },
        select: { balance: true },
      });
      balanceAfter = account.balance;
    } else if (body.type === "MONEY_TRANSFER") {
      const account = await prisma.transferBalance.upsert({
        where: { id: 1 },
        create: { balance: -body.amount },
        update: {
          balance: { decrement: body.amount },
        },
        select: { balance: true },
      });
      balanceAfter = account.balance;
    }

    const newTransaction = await prisma.transfer.create({
      data: {
        ...body,
        balanceAfter: balanceAfter,
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
