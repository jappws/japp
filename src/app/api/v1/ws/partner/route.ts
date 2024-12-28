import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type BodyRequestType = {
  code: string;
};

export async function POST(request: Request) {
  try {
    const body: BodyRequestType = await request.json();
    const createdPartner = await prisma.partner.create({
      data: {
        code: body.code,
        balance: 0,
      },
    });

    const res = {
      ...createdPartner,
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

