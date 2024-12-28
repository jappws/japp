import prisma from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { isNull } from "lodash";
import { Prisma } from "@prisma/client";

type BodyRequestType = {
  code?: string;
};

///////////////////////////////////////////////////////////////
///////////// Mise à jour du partenaire ///////////////////////
//////////////////////////////////////////////////////////////

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ partnerId: string }> }
) {
  try {
    // Récupérer l'ID du partenaire à partir des paramètres
    const { partnerId } = await params;
    const body: BodyRequestType = await request.json();

    // Mettre à jour le partenaire avec les nouvelles données
    const updatedPartner = await prisma.partner.update({
      where: { id: Number(partnerId) },
      data: {
        code: body.code,
      },
    });

    // Retourner la réponse avec les informations du partenaire mis à jour
    return new Response(JSON.stringify(updatedPartner), { status: 201 });
  } catch (e: any) {
    return handleError(e);
  }
}

//////////////////////////////////////////////////////////////
//////////// Suppression du compte partenaire ////////////////
////////////////////////////////////////////////////////////

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ partnerId: string }> }
) {
  try {
    // Récupérer l'ID du partenaire à partir des paramètres
    const { partnerId } = await params;

    // Trouver le partenaire existant
    const getPartner = await prisma.partner.findUnique({
      where: { id: Number(partnerId) },
    });

    // Si le partenaire n'est pas trouvé, renvoyer une réponse 404
    if (isNull(getPartner)) {
      return new Response(JSON.stringify({ message: "partner_not_found" }), { status: 404 });
    }

    // Utiliser une transaction Prisma pour supprimer les transferts associés et le partenaire
    const result = await prisma.$transaction(async (tx) => {
      // Supprimer les transferts associés au partenaire
      await tx.transfer.deleteMany({
        where: { partnerId: Number(partnerId) },
      });

      // Supprimer le partenaire
      const deletedPartner = await tx.partner.delete({
        where: { id: Number(partnerId) },
      });

      return deletedPartner;
    });

    // Retourner la réponse avec la confirmation de suppression
    return new Response(
      JSON.stringify({
        message: "Partner deleted successfully",
        ...result,
      }),
      { status: 200 }
    );
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