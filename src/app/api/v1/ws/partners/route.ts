import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: {} }) {
  try {
    const accounts = await prisma.partner.findMany({
      where: { deleted: false },
      orderBy: { createdAt: "desc" },
    });

    const res = accounts;
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
