import prisma from "@/lib/prisma";
import { TransferTypeType } from "@/lib/types/index.d";

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
  { params }: { params: { partnerId: string } }
) {
  try {
    const body: BodyRequestType = await request.json();

    let res: any;

    if (body.type === "GOLD_TRANSFER") {
      await prisma.$transaction(async (tx) => {
         await tx.partner.update({
          where: { id: Number(params.partnerId) },
          data: {
            balance: { increment: body.amount },
          },
          select: { balance: true },
        });

        const newTransaction = await tx.transfer.create({
          data: {
            ...body,
            partnerId: Number(params.partnerId),
          },
        });
        res = {
          ...newTransaction,
        };
      });
      return new Response(JSON.stringify(res));
    } else if (body.type === "MONEY_TRANSFER") {
      await prisma.$transaction(async (tx) => {
       await tx.partner.update({
          where: { id: Number(params.partnerId) },
          data: {
            balance: { decrement: body.amount },
          },
          select: { balance: true },
        });
       
        const newTransaction = await tx.transfer.create({
          data: {
            ...body,
            partnerId: Number(params.partnerId),
          },
        });
        res = {
          ...newTransaction,
        };
      });
      return new Response(JSON.stringify(res));
    }
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
