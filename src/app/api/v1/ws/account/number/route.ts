import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const currentYear = new Date().getFullYear();
    const accountNumberPrefix = String(currentYear).substring(2);

    const accountNumbers = await prisma.user.findMany({
      where: { username: { startsWith: accountNumberPrefix } },
      select: { username: true },
    });

    let accountNumber: string;
    let accountNumbersEnds: number[] = [];

    accountNumbers.forEach((element) => {
      accountNumbersEnds.push(Number(element.username.substring(2)));
    });

    let accountNumberSuffix = String(accountNumbersEnds.length + 1).padStart(
      5,
      "0"
    );

    accountNumber = `${accountNumberPrefix}${accountNumberSuffix}`;

    const accountWithSameNewNumber = await prisma.account.findUnique({
      where: { accountNumber: accountNumber },
    });

    if (accountWithSameNewNumber) {
      const maxEndValue = Math.max(...accountNumbersEnds);
      accountNumberSuffix = String(maxEndValue + 1).padStart(5, "0");
      accountNumber = `${accountNumberPrefix}${accountNumberSuffix}`;

      return new Response(JSON.stringify({ accountNumber: accountNumber }));
    } else {
      return new Response(JSON.stringify({ accountNumber: accountNumber }));
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
