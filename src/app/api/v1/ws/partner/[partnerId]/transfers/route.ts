import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { type NextRequest } from "next/server";

// ///////////////////////////////////////////////////////////////
// //////////// Récupérer les transferts et le partenaire /////////
// //////////////////////////////////////////////////////////////

export async function GET(
  request: NextRequest,
  { params }: { params: { partnerId: string } }
) {
  try {
    // Récupérer l'ID du partenaire à partir des paramètres
    const { partnerId } = await params;

    // Récupérer les transferts du partenaire
    const transfers = await prisma.transfer.findMany({
      where: { partnerId: Number(partnerId) },
      orderBy: { date: "asc" },
      include: { operator: true },
    });

    // Récupérer les informations du partenaire
    const partner = await prisma.partner.findUnique({
      where: { id: Number(partnerId) },
    });

    // Ajouter le solde après chaque transfert
    let balanceAfter = 0.0;
    const transfersWithBalanceAfter = transfers.map((transfer) => {
      // Calculer le solde après le transfert
      if (transfer.type === "GOLD_TRANSFER") {
        balanceAfter += transfer.amount;

      } else if (transfer.type === "MONEY_TRANSFER") {
        balanceAfter -= transfer.amount;
      }
      return {
        ...transfer,
        balanceAfter: balanceAfter,
      }
    });

    // Combiner les résultats en un seul objet de réponse
    const res = { partner, transfers: transfersWithBalanceAfter };

    // Retourner la réponse avec les transferts et les informations du partenaire
    return new Response(JSON.stringify(res), { status: 200 });
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

  // Retourner la réponse d'erreur
  return new Response(JSON.stringify(error_response), {
    status: e instanceof Prisma.PrismaClientKnownRequestError ? 400 : 500,
    headers: { "Content-Type": "application/json" },
  });
}

