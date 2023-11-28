import prisma from "@/lib/prisma";
import { RoleType, SexType } from "@/lib/types";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";

type BodyRequestType = {
    firstName: string;
    lastName: string;
    surname?: string | null;
    email: string;
    phone: string;
    sex: SexType;
    password: string;
    role:RoleType
    createdById:number
};

export async function POST(request: Request) {
  try {
    const body: BodyRequestType = await request.json();

    //generate a user code as a username
    const currentYear = new Date().getFullYear();
    const yearSuffix = String(currentYear).substring(2);
    const randomPrefix = String(Math.floor(Math.random() * 1000)).padStart(
      4,
      "0"
    );
    const username = randomPrefix + yearSuffix;

    const createdUser = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        surname: body.surname,
        username: username,
        email: body.email,
        phone: body.phone,
        sex: body.sex,
        password: await bcrypt.hash(body.password, 10),
        role: body.role,
        createdById:body.createdById
      },
    });

    const res = {
      ...createdUser,
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
