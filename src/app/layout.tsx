import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "@/components/provider";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

// export async function generateMetadata(): Promise<Metadata> {
//   // fetch data
//   const company = await prisma.company.findUnique({
//     where: { id: 1 },
//   });

//   return {
//     title: company?.name,
//     description: company?.description,
//     icons: { icon: company?.icon ?? "" },
//     robots: "noindex",
//   };
// }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="fr">
      <body className={cn(inter.className, "min-h-screen min-w-screen")}>
        <Provider session={session}>{children}</Provider>
      </body>
    </html>
  );
}
