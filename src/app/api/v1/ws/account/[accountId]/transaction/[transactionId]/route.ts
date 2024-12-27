import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { isNull } from "lodash";

type BodyRequestType = {
  date: Date;
  amount: number;
  goldQuantity?: string;
  title: string;
  message: string;
  operatorId: number;
  receiverAccountId?: number;
};

////////////////////////////////////////////////////
//////////// Update a Transaction /////////////////
//////////////////////////////////////////////////
export async function PUT(
  request: Request,
  { params }: { params: { accountId: string; transactionId: string } }
) {
  try {
    const body: BodyRequestType = await request.json();
    const { receiverAccountId, ...bodyWithoutReceiverId } = body;

    const getTransaction = await prisma.transaction.findUnique({
      where: { id: Number(params.transactionId) },
    });
    if (!isNull(getTransaction)) {
      let res: any;
      if (
        getTransaction.type === "DEPOSIT" ||
        getTransaction.type === "LOAN_PAYMENT"
      ) {
        await prisma.$transaction(async (tx) => {
          await tx.account.update({
            where: { id: Number(params.accountId) },
            data: { balance: { decrement: getTransaction.amount } },
          });

          const account = await tx.account.update({
            where: { id: Number(params.accountId) },
            data: {
              balance: { increment: body.amount },
            },
            select: { balance: true },
          });

          const editedTransaction = await tx.transaction.update({
            where: { id: Number(params.transactionId) },
            data: {
              ...bodyWithoutReceiverId,
              accountId: Number(params.accountId),
            },
          });
          res = { ...editedTransaction };
        });

        return new Response(JSON.stringify(res));
      } else if (
        getTransaction.type === "WITHDRAWAL" ||
        getTransaction.type === "LOAN_DISBURSEMENT"
      ) {
        await prisma.$transaction(async (tx) => {
          await tx.account.update({
            where: { id: Number(params.accountId) },
            data: { balance: { increment: getTransaction.amount } },
          });
         await tx.account.update({
            where: { id: Number(params.accountId) },
            data: {
              balance: { decrement: body.amount },
            },
            select: { balance: true },
          });

          const editedTransaction = await tx.transaction.update({
            where: { id: Number(params.transactionId) },
            data: {
              ...bodyWithoutReceiverId,
              accountId: Number(params.accountId),
            },
          });
          res = { ...editedTransaction };
        });

        return new Response(JSON.stringify(res));
      } else if (getTransaction.type === "TRANSFER") {
        // const {
        //   receiverAccountId,
        //   title,
        //   message,
        //   ...bodyWithoutReceiverIdTitleMessageAndType
        // } = body;
        // let senderBalanceAfter: number = 0;
        // let receiverBalanceAfter: number = 0;
        // await prisma.$transaction(async (tx) => {
        //   const senderAccount = await tx.account.update({
        //     where: { id: Number(params.accountId) },
        //     data: {
        //       balance: { decrement: body.amount },
        //     },
        //     select: { balance: true },
        //   });
        //   senderBalanceAfter = senderAccount.balance;
        //   const receiverAccount = await tx.account.update({
        //     where: { id: Number(body.receiverAccountId) },
        //     data: {
        //       balance: { increment: body.amount },
        //     },
        //     select: { balance: true },
        //   });
        //   receiverBalanceAfter = receiverAccount.balance;
        // });
        // await prisma.transaction.createMany({
        //   data: [
        //     {
        //       ...bodyWithoutReceiverId,
        //       balanceAfter: senderBalanceAfter,
        //       accountId: Number(params.accountId),
        //     },
        //     {
        //       ...bodyWithoutReceiverIdTitleMessageAndType,
        //       balanceAfter: receiverBalanceAfter,
        //       type: "RECEIPT_OF_TRANSFER",
        //       accountId: Number(body.receiverAccountId),
        //       title: "Réception du virement",
        //     },
        //   ],
        // });
        // return new Response(JSON.stringify({ message: "Transfer succeded" }));
      }
    } else {
      return new Response(JSON.stringify({ message: "transaction_not_found" }));
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

//////////////////////////////////////////////////////////
//////////// Delete a transaction ///////////////////////
////////////////////////////////////////////////////////

export async function DELETE(
  request: Request,
  { params }: { params: { accountId: string; transactionId: string } }
) {
  try {
    const getTransaction = await prisma.transaction.findUnique({
      where: { id: Number(params.transactionId) },
    });
    if (!isNull(getTransaction)) {
      // let balanceAfter: number = 0;
      let res: any;

      if (
        getTransaction.type === "DEPOSIT" ||
        getTransaction.type === "LOAN_PAYMENT"
      ) {
        await prisma.$transaction(async (tx) => {
          const account = await tx.account.update({
            where: { id: Number(params.accountId) },
            data: {
              balance: { decrement: getTransaction.amount },
            },
          });

          const deletedTransaction = await tx.transaction.delete({
            where: { id: Number(params.transactionId) },
          });
          res = {
            res_message: "Transaction is deleted succefully",
            ...deletedTransaction,
          };
        });

        return new Response(JSON.stringify(res));
      } else if (
        getTransaction.type === "WITHDRAWAL" ||
        getTransaction.type === "LOAN_DISBURSEMENT"
      ) {
        await prisma.$transaction(async (tx) => {
          const account = await tx.account.update({
            where: { id: Number(params.accountId) },
            data: {
              balance: { increment: getTransaction.amount },
            },
          });
          // balanceAfter = account.balance;

          const deletedTransaction = await tx.transaction.delete({
            where: { id: Number(params.transactionId) },
          });
          res = {
            res_message: "Transaction is deleted succefully",
            ...deletedTransaction,
          };
        });

        return new Response(JSON.stringify(res));
      } else  {
        // const {
        //   receiverAccountId,
        //   type,
        //   title,
        //   message,
        //   ...bodyWithoutReceiverIdTitleMessageAndType
        // } = body;
        // let senderBalanceAfter: number = 0;
        // let receiverBalanceAfter: number = 0;

        // await prisma.$transaction(async (tx) => {
        //   const senderAccount = await tx.account.update({
        //     where: { id: Number(params.accountId) },
        //     data: {
        //       balance: { decrement: body.amount },
        //     },
        //     select: { balance: true },
        //   });

        //   senderBalanceAfter = senderAccount.balance;

        //   const receiverAccount = await tx.account.update({
        //     where: { id: Number(body.receiverAccountId) },
        //     data: {
        //       balance: { increment: body.amount },
        //     },
        //     select: { balance: true },
        //   });
        //   receiverBalanceAfter = receiverAccount.balance;
        // });

        // await prisma.transaction.createMany({
        //   data: [
        //     {
        //       ...bodyWithoutReceiverId,
        //       balanceAfter: senderBalanceAfter,
        //       accountId: Number(params.accountId),
        //     },
        //     {
        //       ...bodyWithoutReceiverIdTitleMessageAndType,
        //       balanceAfter: receiverBalanceAfter,
        //       type: "RECEIPT_OF_TRANSFER",
        //       accountId: Number(body.receiverAccountId),
        //       title: "Réception du virement",
        //     },
        //   ],
        // });

        return new Response(JSON.stringify({}));
      }

      return new Response(JSON.stringify({}));
    } else {
      return new Response(JSON.stringify({ message: "transaction_not_found" }));
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
