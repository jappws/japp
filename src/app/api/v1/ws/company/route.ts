import prisma from "@/lib/prisma";
import { IsoCodeCurrencyType } from "@/lib/types/index.d";
import { Prisma } from "@prisma/client";

type BodyRequestType = {
    name?: string;
    shortName?: string;
    description?: string | null;
    logo?: string | null;
    icon?: string | null;
    currency?: IsoCodeCurrencyType;
    country?: string | null;
    province?: string | null;
    city?: string | null;
    address?: string | null;
    webSiteUrl?: string | null;
    motto?: string | null;
    phone1?: string | null;
    phone2?: string | null;
    email?: string | null;
};

export async function PUT(
  request: Request,
) {
  try {
    const body: BodyRequestType = await request.json();
    const editedCompany = await prisma.company.update({
      where: { id: 1 },
      data: {
        ...body,
      },
    });
    const res = {
      ...editedCompany,
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

export async function GET(
  request: Request
) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: 1 },
    });
    const res = {
      ...company,
    };
    return new Response(JSON.stringify(res), { status: 200 });
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