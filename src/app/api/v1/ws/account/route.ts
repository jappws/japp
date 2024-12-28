
import prisma from "@/lib/prisma";
import { SexType } from "@/lib/types";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { type NextRequest } from "next/server";

type BodyRequestType = {
  accountNumber: string;
  owner: {
    firstName: string;
    lastName: string;
    surname?: string | null;
    nickname?: string | null;
    phone: string;
    otherPhone?: string | null;
    sex: SexType;
    country?: string | null;
    province?: string | null;
    city?: string | null;
    address?: string | null;
    createdById?: number | null;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body: BodyRequestType = await request.json();

    // Utiliser une transaction Prisma pour la création de l'utilisateur et du compte
    const result = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          firstName: body.owner.firstName,
          lastName: body.owner.lastName,
          surname: body.owner.surname,
          username: body.accountNumber,
          email: `a.${body.accountNumber}@jappws.com`,
          phone: body.owner.phone,
          otherPhone: body.owner.otherPhone,
          sex: body.owner.sex,
          password: await bcrypt.hash(body.accountNumber, 10),
          country: body.owner.country,
          province: body.owner.province,
          city: body.owner.city,
          address: body.owner.address,
          createdById: body.owner.createdById,
          role: "CLIENT",
        },
      });

      const createdAccount = await tx.account.create({
        data: {
          accountNumber: body.accountNumber,
          balance: 0,
          ownerId: createdUser.id,
        },
      });

      return createdAccount;
    });

    return new Response(JSON.stringify(result), { status: 201 });
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
