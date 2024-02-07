import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { isNull } from "lodash";

type BodyRequestType = {
  date: Date;
  amount: number;
  goldQuantity?: string;
  sender: string;
  message?: string;
  operatorId: number;
};

///////////////////////////////////////////////////////////////
///////////// Update a transfer ///////////////////////////////
//////////////////////////////////////////////////////////////

export async function PUT(
  request: Request,
  { params }: { params: { partnerId: string; transferId: string } }
) {
  try {
    const body: BodyRequestType = await request.json();
    const getTransfer = await prisma.transfer.findUnique({
      where: { id: Number(params.transferId) },
    });

    if (!isNull(getTransfer)) {
      let balanceAfter: number = 0;
      let res: any;
      if (getTransfer.type === "GOLD_TRANSFER") {
        await prisma.$transaction(async (tx) => {
          await tx.partner.update({
            where: { id: Number(params.partnerId) },
            data: { balance: { decrement: getTransfer.amount } },
          });

          const account = await tx.partner.update({
            where: { id: Number(params.partnerId) },
            data: {
              balance: { increment: body.amount },
            },
            select: { balance: true },
          });
          balanceAfter = account.balance;

          const editedTransfer = await tx.transfer.update({
            where: { id: Number(params.transferId) },
            data: {
              ...body,
              balanceAfter: balanceAfter,
              partnerId: Number(params.partnerId),
            },
          });
          res = {
            ...editedTransfer,
          };
        });
        return new Response(JSON.stringify(res));
      } else if (getTransfer.type === "MONEY_TRANSFER") {
        await prisma.$transaction(async (tx) => {
          await tx.partner.update({
            where: { id: Number(params.partnerId) },
            data: { balance: { increment: getTransfer.amount } },
          });
          const account = await tx.partner.update({
            where: { id: Number(params.partnerId) },
            data: {
              balance: { decrement: body.amount },
            },
            select: { balance: true },
          });
          balanceAfter = account.balance;

          const editedTransfer = await tx.transfer.update({
            where: { id: Number(params.transferId) },
            data: {
              ...body,
              balanceAfter: balanceAfter,
              partnerId: Number(params.partnerId),
            },
          });
          res = {
            ...editedTransfer,
          };
        });
        return new Response(JSON.stringify(res));
      }
    } else {
      return new Response(JSON.stringify({ message: "transfer_not_found" }));
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

//////////////////////////////////////////////////////////////
//////////// Delete a transfer //////////////////////////////
////////////////////////////////////////////////////////////
export async function DELETE(
  request: Request,
  { params }: { params: { partnerId: string; transferId: string } }
) {
  try {
    const getTransfer = await prisma.transfer.findUnique({
      where: { id: Number(params.transferId) },
    });

    if (!isNull(getTransfer)) {
      let res: any;

      if (getTransfer.type === "GOLD_TRANSFER") {
        await prisma.$transaction(async (tx) => {
          const partner = await tx.partner.update({
            where: { id: Number(params.partnerId) },
            data: {
              balance: { decrement: getTransfer.amount },
            },
          });

          const deletedTransfer = await tx.transfer.delete({
            where: { id: Number(params.transferId) },
          });

          res = {
            res_message: "Transfer is deleted succefully",
            ...deletedTransfer,
          };
        });
        return new Response(JSON.stringify(res));
      } else if (getTransfer.type === "MONEY_TRANSFER") {
        await prisma.$transaction(async (tx) => {
          const partner = await tx.partner.update({
            where: { id: Number(params.partnerId) },
            data: {
              balance: { increment: getTransfer.amount },
            },
          });

          const deletedTransfer = await tx.transfer.delete({
            where: { id: Number(params.transferId) },
          });

          res = {
            res_message: "Transfer is deleted succefully",
            ...deletedTransfer,
          };
        });

        return new Response(JSON.stringify(res));
      }
    } else {
      return new Response(JSON.stringify({ message: "transfer_not_found" }));
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
