import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const currentYear = new Date().getFullYear();
    const accountNumberPrefix = String(currentYear).substring(2);

    // Récupérer tous les numéros de compte qui commencent par le préfixe de l'année actuelle
    const accountNumbers = await prisma.user.findMany({
      where: { username: { startsWith: accountNumberPrefix } },
      select: { username: true },
    });

    // Extraire les suffixes des numéros de compte existants
    const accountNumbersEnds = accountNumbers.map(element =>
      Number(element.username.substring(2))
    );

    // Calculer le nouveau suffixe basé sur le maximum des suffixes existants
    const maxEndValue = accountNumbersEnds.length ? Math.max(...accountNumbersEnds) : 0;
    const newAccountNumberSuffix = String(maxEndValue + 1).padStart(5, "0");

    // Générer le nouveau numéro de compte
    const newAccountNumber = `${accountNumberPrefix}${newAccountNumberSuffix}`;

    // Vérifier l'unicité du nouveau numéro de compte une seule fois
    const accountWithSameNewNumber = await prisma.account.findUnique({
      where: { accountNumber: newAccountNumber },
    });

    // Si le numéro de compte généré n'est pas unique, lancer une exception
    if (accountWithSameNewNumber) {
      throw new Error("Generated account number is not unique, please try again.");
    }

    return new Response(JSON.stringify({ accountNumber: newAccountNumber }), { status: 200 });
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