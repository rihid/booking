import type { NextAuthConfig } from "next-auth"
import Credentials from 'next-auth/providers/credentials';
import { LoginSchema, UserTokenSchema } from "@/lib/schema";
import { getuser } from "@/lib/data";
import axios from "axios";
import { userTokenUrl } from "@/lib/config/api";
 
export default { 
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { username, password } = validatedFields.data;
          // const user = await getUserByEmail(email);
          // if (!user || !user.password) return null;

          // const passwordsMatch = await bcrypt.compare(password, user.password);

          // if (passwordsMatch) return user;
          const user = await getuser(validatedFields.data);
          if(!user) {
            throw new Error('user not found');
          } else {
            return user
          }
          
        }
        return null;
      },
    }),
  ] 
} satisfies NextAuthConfig;