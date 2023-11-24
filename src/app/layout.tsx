import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "@/components/provider";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Japp",
  description: "Gérer et contrôler le flux james ",
  robots: "noindex",
};

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
