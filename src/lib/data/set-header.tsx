import { getSession } from "../session";

export const setHeader = async() => {
  const session = await getSession();
  const headers: { [key: string]: any} = {
    Accept: 'application/json',
  }
  if(session) {
    // @ts-ignore
    headers.Authorization = 'Bearer ' + session.user.token
  }

  return headers;
}