import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: {} }) {
  try {
    const totalPartnersCredit = await prisma.partner.aggregate({
      _sum: { balance: true },
    });

    const bankAggregations = await prisma.account.aggregate({
      where: { owner: { deleted: false } },
      _avg: { balance: true },
      _max: { balance: true },
      _min: { balance: true },
      _sum: { balance: true },
      _count: true,
    });


    const totalBanck = await prisma.account.aggregate({
      where: { owner: { deleted: false },balance:{gt:0} },
      _sum: { balance: true },
      _count: true,
    });

    const totalCredit = await prisma.account.aggregate({
      where: { owner: { deleted: false },balance:{lt:0} },
      _sum: { balance: true },
      _count: true,
    });

    const res = {
      banckAndCredits: {
        numberOfAccounts: bankAggregations._count,
        maxBalance: bankAggregations._max.balance,
        avgBalance: bankAggregations._avg.balance,
        minBalance: bankAggregations._min.balance,
        totalBanck:totalBanck._sum.balance,
        totalCredit:totalCredit._sum.balance,
      },
      transferAndCredits: totalPartnersCredit._sum.balance,
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
