// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import axios from "axios";

// const loginUrl = 'http://localhost:8000/api/v1/auth';
// const userTokenUrl = 'http://localhost:8000/api/v1/auth-service/user/token';

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//       credentials: {
//         username: {},
//         password: {},
//       },
// authorize: async (credentials) => {
//   try {
//     const body = {
//       username: credentials.username,
//       password: credentials.password,
//     };
//     const loginRes = await axios.post(loginUrl, body);

//     if (!loginRes.data.data || !loginRes.data.data.token) {
//       throw new Error("Invalid credentials");
//     }

//     const headers = {
//       Accept: 'application/json',
//       Authorization: `Bearer ${loginRes.data.data.token}`,
//     };

//     const userRes = await axios.get(userTokenUrl, { headers: headers });

//     const user = userRes.data.data;

//     return user;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Authentication failed");
//   }
// },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: '/login'
//   }
// });


import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
// import bcrypt from 'bcrypt';
import { z } from 'zod';
import { authConfig } from './auth.config';
import axios from 'axios';

const loginUrl = 'http://localhost:8000/api/v1/auth';
const userTokenUrl = 'http://localhost:8000/api/v1/auth-service/user/token';

async function getUser(data: any) {
  const { username, password } = data;

  try {
    const body = {
      username: username,
      password: password,
    };
    const loginRes = await axios.post(loginUrl, body);
    console.log("Login Res:",loginRes.data)
    if (!loginRes.data || !loginRes.data.token) {
      throw new Error("Invalid credentials");
    }

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${loginRes.data.token}`,
    };

    const userRes = await axios.get(userTokenUrl, { headers: headers });

    const user = userRes.data;
    console.log("User Res:", userRes.data)
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Authentication failed");
  }

}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log('Credential:', credentials)
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const authUser = parsedCredentials.data
          const user = await getUser(authUser);
          if (!user) return null;
          return user

        }
        return null;
      },
    }),
  ],
});