import { signJwtAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";

type RequestBody = {
  email: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (
      user &&
      (await bcrypt.compare(body.password, user.password)) &&
      !user.blocked &&
      !user.deleted
    ) {
      const { password, ...userWithoutPass } = user;
      const accessToken = signJwtAccessToken(userWithoutPass);

      const result = {
        ...userWithoutPass,
        accessToken,
      };
      return new Response(JSON.stringify(result));
    } else {
      return new Response(JSON.stringify(null));
    }
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
