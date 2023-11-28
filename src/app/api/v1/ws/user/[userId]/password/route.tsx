import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";

type BodyRequestType = {
  password: string;
};

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body: BodyRequestType = await request.json();

    const editedUser = await prisma.user.update({
      where: { id: Number(params.userId) },
      data: { password: await bcrypt.hash(body.password, 10) },
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
