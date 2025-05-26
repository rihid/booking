'use server';

import { cookies } from "next/headers";
import { createSession, deleteSession, getSession, encrypt } from "../session";
import { redirect } from "next/navigation";
import { getCustomerByNo, getUserToken } from "../data";

export async function login(token: string) {
  let user;
  if (token) {
    const userToken = await getUserToken(token);
    const {permission, customers, ...rest} = userToken;
    user = rest;
    user.token = token
    // const userCustomer = await getCustomerByNo(token, user?.customer_no)
    // console.log(userCustomer)
    // user.customer = userCustomer
  }
  await createSession(user)
  redirect('/explore')
}

export async function logout() {
  await deleteSession()
  redirect('/');
}

export async function extendSessionData(payload: Partial<any>) {
  const session = await getSession(); // Retrieve the current session
  if (!session) {
    return null;
  }

  // Update the user data inside the session
  const updatedUser = {
    // @ts-ignore
    ...session.user,   // Keep the existing user data
    ...payload         // Extend it with the new data (payload)
  };

  // Keep the original session structure, updating the user and expiration
  const updatedSession = {
    ...session,        // Keep other session data (like expiresAt)
    user: updatedUser  // Update the user data
  };

  // Encrypt the updated session
  const newSession = await encrypt(updatedSession); // Await the encryption

  // Set the cookie with the new session and updated expiration time
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration
  cookies().set('session', newSession, {
    httpOnly: false,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}