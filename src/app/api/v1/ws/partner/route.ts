

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { type NextRequest } from "next/server";

type BodyRequestType = {
  code: string;
};

///////////////////////////////////////////////////////////////
///////////// Création d'un nouveau partenaire ////////////////
//////////////////////////////////////////////////////////////

export async function POST(request: NextRequest) {
  try {
    // Extraire les données du corps de la requête
    const body: BodyRequestType = await request.json();

    // Créer un nouveau partenaire avec un solde initial de 0
    const createdPartner = await prisma.partner.create({
      data: {
        code: body.code,
        balance: 0,
      },
    });

    // Retourner la réponse avec le partenaire créé
    return new Response(JSON.stringify(createdPartner), { status: 201 });
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
