'use server';

import { createSession } from "../session";
import { redirect } from "next/navigation";
import { getUserToken } from "../data";

export async function login(token: string) {
  
  let user;
  if (token) {
    user = await getUserToken(token);
  }
  await createSession(user)
  // 5. Redirect user
  redirect('/explore')
}