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

/**
 * Gère les requêtes POST pour les transctions (transferts) avec les partenaires.
 *
 * @param {Request} request - La requête HTTP entrante.
 * @param {Object} context - Le contexte de la requête.
 * @param {Object} context.params - Les paramètres de la requête.
 * @param {string} context.params.partnerId - L'identifiant du partenaire.
 * @returns {Promise<Response>} La réponse HTTP avec le résultat de la transaction.
 *
 * @throws {Error} Si le type de transfert n'est pas pris en charge.
 */
export async function POST(
  request: Request,
  { params }: { params: { partnerId: string } }
) {
  try {
    const body: BodyRequestType = await request.json();
    const partnerId = Number(params.partnerId);

    let balanceUpdate;
    switch (body.type) {
      case TransferTypeType.GOLD_TRANSFER:
      balanceUpdate = { increment: body.amount };
      break;
      case TransferTypeType.MONEY_TRANSFER:
      balanceUpdate = { decrement: body.amount };
      break;
      default:
      throw new Error(`Unsupported transfer type: ${body.type}`);
    }

    const response = await prisma.$transaction(async (tx) => {

      await tx.partner.update({
        where: { id: partnerId },
        data: { balance: balanceUpdate },
      });

      const newTransaction = await tx.transfer.create({
        data: { ...body, partnerId },
      });

      return newTransaction;
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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