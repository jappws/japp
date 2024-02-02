import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { isNull } from "lodash";

type BodyRequestType = {
  code?: string;
};

export async function PUT(
  request: Request,
  { params }: { params: { partnerId: string } }
) {
  try {
    const body: BodyRequestType = await request.json();
    const updatedPartner = await prisma.partner.update({
      where: { id: Number(params.partnerId) },
      data: {
        code: body.code,
      },
    });

    const res = {
      ...updatedPartner,
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


//Delete client account API
export async function DELETE(
  request: Request,
  { params }: { params: { partnerId: string } }
) {
  try {
    const getPartner = await prisma.partner.findUnique({
      where: { id: Number(params.partnerId) },
    });

    if (!isNull(getPartner)) {
      await prisma.transfer.deleteMany({
        where: { partnerId: Number(params.partnerId) },
      });
      let res: any;

      await prisma.$transaction(async (tx) => {
        const deletedPartner = await tx.partner.delete({
          where: { id: Number(params.partnerId) },
        });

        res = { ...deletedPartner };
      });
      return new Response(
        JSON.stringify({
          message: "Partner deleted succefully",
          ...res,
        })
      );
    } else {
      return new Response(JSON.stringify({ message: "partner_not_found" }));
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

