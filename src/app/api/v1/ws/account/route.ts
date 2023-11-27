import prisma from "@/lib/prisma";
import { SexType } from "@/lib/types";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";

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
    createdById?: number | null;
  };
};

export async function POST(request: Request) {
  try {
    const body: BodyRequestType = await request.json();
    const createdUser = await prisma.user.create({
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
        createdById: body.owner.createdById,
        role: "CLIENT",
      },
    });

    const createdAccount = await prisma.account.create({
      data: {
        accountNumber: body.accountNumber,
        balance: 0,
        ownerId: createdUser.id,
      },
    });

    const res = {
      ...createdAccount,
    };
    return new Response(JSON.stringify(res), { status: 201 });
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
