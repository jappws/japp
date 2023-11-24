import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    const token = await getToken({ req });

    if (
      (pathname.startsWith("/login") || pathname.startsWith("/register")) &&
      token
    ) {
      return NextResponse.redirect(new URL("/ws", req.url));
    }

    if (pathname.startsWith(`/api/v1/ws`) && token === null) {
      return new NextResponse(JSON.stringify("Unauthorized"), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname.startsWith("/ws") && token === null) {
          return false;
        }

        return true;
      },
    },
  }
);
