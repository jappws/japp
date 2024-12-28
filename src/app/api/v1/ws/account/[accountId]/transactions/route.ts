import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    // Récupérer l'accountId à partir des paramètres
    const { accountId } =  params;

    // Trouver toutes les transactions pour le compte spécifié
    const transactions = await prisma.transaction.findMany({
      where: { accountId: Number(accountId) },
      orderBy: { date: "asc"},
      include: { operator: {}, account: {} },
    });

    // Ajouter le solde après la transaction à chaque transaction
    let balanceAfter = 0.0;
    const trans =  transactions.map((transaction) => {

      switch (transaction.type) {
        case "DEPOSIT":
        case "LOAN_PAYMENT":
        case "RECEIPT_OF_TRANSFER":
          balanceAfter += transaction.amount; // Calculer le solde après la transaction
          break;
        case "WITHDRAWAL":
        case "LOAN_DISBURSEMENT":
        case "TRANSFER":
          balanceAfter -= transaction.amount; // Calculer le solde après la transaction
          break;
        default:
          throw new Error("Invalid transaction type");
      }

      return {
        ...transaction,
        balanceAfter: balanceAfter,
      };
    })

    // Retourner les transactions trouvées
    return new Response(JSON.stringify(trans), { status: 200 });
  } catch (e: any) {
    return handleError(e);
  }
}

// Fonction de gestion des erreurs
function handleError(e: any) {
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
