
import prisma from "@/lib/prisma";
import { TransferTypeType } from "@/lib/types";
import { Prisma } from "@prisma/client";
import { type NextRequest } from "next/server";

type BodyRequestType = {
  date: Date;
  amount: number;
  goldQuantity?: string;
  sender: string;
  message?: string;
  operatorId: number;
};

///////////////////////////////////////////////////////////////
///////////// Mettre à jour un transfert //////////////////////
//////////////////////////////////////////////////////////////

export async function PUT(
  request: NextRequest,
  { params }: { params: { partnerId: string; transferId: string } }
) {
  try {
    // Récupérer les paramètres de la requête
    const { partnerId, transferId } = params;
    const body: BodyRequestType = await request.json();

    // Trouver le transfert existant
    const getTransfer = await prisma.transfer.findUnique({
      where: { id: Number(transferId) },
    });

    // Si le transfert n'est pas trouvé, renvoyer une réponse 404
    if (!getTransfer) {
      return new Response(JSON.stringify({ message: "transfer_not_found" }), { status: 404 });
    }

    let res: any;
    // Utiliser une transaction Prisma pour garantir l'atomicité des opérations
    await prisma.$transaction(async (tx) => {
      // Trouver le partenaire
      const partner = await tx.partner.findUnique({
        where: { id: Number(partnerId) },
        select: { balance: true },
      });

      // Vérifier que le partenaire n'est pas nul
      if (!partner) {
        throw new Error("Partner not found");
      }

      // Récupérer la valeur actuelle du solde
      const currentBalance = partner.balance;

      // Calculer le nouveau solde en fonction du type de transfert
      let newBalance;
      switch (getTransfer.type) {
        case TransferTypeType.GOLD_TRANSFER:
          newBalance = currentBalance - getTransfer.amount + body.amount;
          break;
        case TransferTypeType.MONEY_TRANSFER:
          newBalance = currentBalance + getTransfer.amount - body.amount;
          break;
        default:
          throw new Error(`Unsupported transfer type: ${getTransfer.type}`);
      }

      // Mettre à jour le solde du partenaire
      await tx.partner.update({
        where: { id: Number(partnerId) },
        data: { balance: newBalance },
      });

      // Mettre à jour le transfert avec le nouveau solde
      const editedTransfer = await tx.transfer.update({
        where: { id: Number(transferId) },
        data: {
          ...body,
          partnerId: Number(partnerId),
        },
      });

      res={...editedTransfer};
    });

    // Retourner la réponse avec le transfert mis à jour
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (e: any) {
    return handleError(e);
  }
}

//////////////////////////////////////////////////////////////
//////////// Supprimer un transfert //////////////////////////
////////////////////////////////////////////////////////////

export async function DELETE(
  request: NextRequest,
  { params }: { params: { partnerId: string; transferId: string } }
) {
  try {
    // Récupérer les paramètres de la requête
    const { partnerId, transferId } =  params;

    // Trouver le transfert existant
    const getTransfer = await prisma.transfer.findUnique({
      where: { id: Number(transferId) },
    });

    // Si le transfert n'est pas trouvé, renvoyer une réponse 404
    if (!getTransfer) {
      return new Response(JSON.stringify({ message: "transfer_not_found" }), { status: 404 });
    }

    // Définir la mise à jour du solde en fonction du type de transfert
    let balanceUpdate;
    switch (getTransfer.type) {
      case TransferTypeType.GOLD_TRANSFER:
      balanceUpdate = { decrement: getTransfer.amount };
      break;
      case TransferTypeType.MONEY_TRANSFER:
      balanceUpdate = { increment: getTransfer.amount };
      break;
      default:
      throw new Error(`Unsupported transfer type: ${getTransfer.type}`);
    }

    // Utiliser une transaction Prisma pour garantir l'atomicité des opérations
    const result = await prisma.$transaction(async (tx) => {
      // Mettre à jour le solde du partenaire
      await tx.partner.update({
        where: { id: Number(partnerId) },
        data: { balance: balanceUpdate },
      });

      // Supprimer le transfert
      const deletedTransfer = await tx.transfer.delete({
        where: { id: Number(transferId) },
      });

      // Retourner la réponse avec le transfert supprimé
      return {
        ...deletedTransfer,
      };
    });

    // Retourner la réponse avec le transfert supprimé
    return new Response(JSON.stringify(result), { status: 200 });
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