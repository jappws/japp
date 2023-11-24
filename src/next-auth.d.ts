import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      surname: string;
      username: string;
      phone: string;
      sex: SexType;
      otherPhone: string;
      email: string;
      blocked: boolean;
      deleted: boolean;
      country: string;
      province: string;
      city: string;
      address: string;
      createdById: number;
      role: RoleType;
      createdAt: Date;
      updatedAt: Date;
    } & DefaultSession["user"];
  }
}
