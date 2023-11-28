import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
