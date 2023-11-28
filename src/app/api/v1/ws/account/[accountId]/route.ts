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
    // get a account
    const account = await prisma.account.findUnique({
      where: { id: Number(params.accountId) },
      include: { owner: { include: { createdBy: {} } } },
    });

    return new Response(JSON.stringify(account));
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

export async function PUT(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const body: BodyRequestType = await request.json();

    const editedAccount = await prisma.account.update({
      where: { id: Number(params.accountId) },
      data: {},
    });

    const editedUser = await prisma.user.update({
      where: { id: body.ownerId },
      data: { ...body.owner },
    });

    return new Response(JSON.stringify(editedUser));
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
