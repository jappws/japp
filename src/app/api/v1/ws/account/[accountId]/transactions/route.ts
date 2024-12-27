import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { accountId: Number(params.accountId) },
      orderBy: { date: "asc" },
      include: { operator: {}, account: {} },
    });
     // Ajouter le solde après la transaction à chaque transaction
     let balanceAfter = 0.0;
     const trans =  transactions.map((transaction) => {
 
       if (transaction.type === "DEPOSIT" || transaction.type === "LOAN_PAYMENT" || transaction.type === "RECEIPT_OF_TRANSFER") {
         balanceAfter += transaction.amount; // Calculer le solde après la transaction
       } else if (transaction.type === "WITHDRAWAL" || transaction.type==="LOAN_DISBURSEMENT" || transaction.type==="TRANSFER" ) {
         balanceAfter -= transaction.amount; // Calculer le solde après la transaction
       }
 
       return {
        balanceAfter: balanceAfter,
         ...transaction,
       };
     })
    return new Response(JSON.stringify(trans), { status: 200 });
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
