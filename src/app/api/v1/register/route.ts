import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { IsoCodeCurrencyType, SexType } from "@/lib/types";

type BodyRequestType = {
  company: {
    name: string;
    shortName: string;
    description?: string | null;
    logo?: string | null;
    icon?: string | null;
    currency: IsoCodeCurrencyType;
    country: string | null;
    province?: string | null;
    city?: string | null;
    address?: string | null;
    webSiteUrl?: string | null;
    motto?: string | null;
    phone1?: string | null;
    phone2?: string | null;
    email?: string | null;
  };
  user: {
    firstName: string;
    lastName: string;
    surname?: string | null;
    email: string;
    phone: string;
    otherPhone?: string | null;
    sex: SexType;
    password: string;
  };
};

export async function POST(request: Request) {
  try {
    // get data from the body request and check them for adaptation
    const body: BodyRequestType = await request.json();

    // create a company for the first time or update if it exists
    const company = await prisma.company.upsert({
      where: { id: 1 },
      create: { id: 1, code: "WS-769653", ...body.company, status: "ENABLED" },
      update: { id: 1, code: "WS-769653", ...body.company, status: "ENABLED" },
    });

    //generate a user code as a username
    const currentYear = new Date().getFullYear();
    const yearSuffix = String(currentYear).substring(-2);
    const randomPrefix = String(Math.floor(Math.random() * 1000)).padStart(
      3,
      "0"
    );
    const username = randomPrefix + yearSuffix;

    // create an admin user of the company
    const user = await prisma.user.create({
      data: {
        firstName: body.user.firstName,
        lastName: body.user.lastName,
        surname: body.user.surname,
        username: username,
        email: body.user.email,
        phone: body.user.phone,
        otherPhone: body.user.otherPhone,
        sex: body.user.sex,
        password: await bcrypt.hash(body.user.password, 10),
        role: "ADMIN",
      },
    });

    const { password, ...userWithoutPassword } = user;

    return new Response(
      JSON.stringify({
        ...company,
        user: userWithoutPassword,
      }),
      { status: 201 }
    );
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
