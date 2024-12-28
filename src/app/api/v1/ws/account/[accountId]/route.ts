import prisma from "@/lib/prisma";
import { SexType } from "@/lib/types";
import { Prisma } from "@prisma/client";

type BodyRequestType = {
  ownerId: number;
  owner: {
    firstName?: string;
    lastName?: string;
    surname?: string | null;
    nickname?: string | null;
    phone?: string;
    otherPhone?: string | null;
    sex: SexType;
    country?: string | null;
    province?: string | null;
    city?: string | null;
    address?: string | null;
  };
};

export async function GET(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    // Récupérer l'accountId à partir des paramètres
    const { accountId } = params;

    // Trouver le compte avec les informations du propriétaire
    const account = await prisma.account.findUnique({
      where: { id: Number(accountId) },
      include: { owner: { include: { createdBy: {} } } },
    });

    // Si le compte n'est pas trouvé, lancer une erreur
    if (!account) {
      throw new Error("account_not_found");
    }

    return new Response(JSON.stringify(account), { status: 200 });
  } catch (e: any) {
    return handleError(e);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const body: BodyRequestType = await request.json();
    const { accountId } = params;

    // Vérifier l'existence du compte
    const existingAccount = await prisma.account.findUnique({
      where: { id: Number(accountId) },
    });

    // Si le compte n'existe pas, lancer une erreur
    if (!existingAccount) {
      throw new Error("account_not_found");
    }

    // Utiliser une transaction pour mettre à jour le compte et l'utilisateur
    const result = await prisma.$transaction(async (tx) => {
      const editedAccount = await tx.account.update({
        where: { id: Number(accountId) },
        data: {},
      });

      const editedUser = await tx.user.update({
        where: { id: body.ownerId },
        data: { ...body.owner },
      });

      return { editedAccount, editedUser };
    });

    return new Response(JSON.stringify(result.editedUser), { status: 200 });
  } catch (e: any) {
    return handleError(e);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const { accountId } = params;

    // Trouver le compte
    const getAccount = await prisma.account.findUnique({
      where: { id: Number(accountId) },
    });

    // Si le compte n'existe pas, lancer une erreur
    if (!getAccount) {
      throw new Error("account_not_found");
    }

    await prisma.transaction.deleteMany({
      where: { accountId: Number(accountId) },
    });

    const result = await prisma.$transaction(async (tx) => {
      const deletedAccount = await tx.account.delete({
        where: { id: Number(accountId) },
      });
      const deletedUser = await tx.user.delete({
        where: { id: getAccount.ownerId },
      });
      return { account: deletedAccount, user: deletedUser };
    });

    return new Response(
      JSON.stringify({
        message: "Account and User deleted successfully",
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

  // Si l'erreur est "account_not_found", retourner une réponse avec un statut 404
  if (e.message === "account_not_found") {
    return new Response(
      JSON.stringify({ status: "fail", message: e.message }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify(error_response), {
    status: e instanceof Prisma.PrismaClientKnownRequestError ? 400 : 500,
    headers: { "Content-Type": "application/json" },
  });
}