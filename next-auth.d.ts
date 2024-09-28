import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      username?: string | null;
      email: string | null;
      org_no?: string | null;
      type?: string | null;
      avatar?: string | null;
      greetings?: string | null;
      role?: string[] | null;
      permission?: { [key: string]: boolean } | null;
      customer_no?: string | null;
    };
  }

  interface User {
    id: string;
    name: string | null;
    username?: string | null;
    email: string | null;
    org_no?: string | null;
    type?: string | null;
    avatar?: string | null;
    greetings?: string | null;
    role?: string[] | null;
    permission?: { [key: string]: boolean } | null;
    customer_no?: string | null;
  }

  interface JWT {
    id: string;
    name: string | null;
    username?: string | null;
    email: string | null;
    org_no?: string | null;
    type?: string | null;
    avatar?: string | null;
    greetings?: string | null;
    role?: string[] | null;
    permission?: { [key: string]: boolean } | null;
    customer_no?: string | null;
  }
}
