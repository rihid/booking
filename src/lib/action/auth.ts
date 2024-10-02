'use server';

import { createSession, deleteSession } from "../session";
import { redirect } from "next/navigation";
import { getUserToken } from "../data";

export async function login(token: string) {
  
  let user;
  if (token) {
    user = await getUserToken(token);
    user.token = token
  }
  await createSession(user)
  redirect('/explore')
}

export async function logout() {
  await deleteSession()
  redirect('/');
}