//easy file
import { authOptions } from "./options";
import NextAuth from "next-auth/next";

const handler=NextAuth(authOptions);           //next auth ek methhod hai jo sirf options leta hai

export {handler as GET, handler as POST}