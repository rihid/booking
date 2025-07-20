'use server';

import { cookies } from "next/headers";
import { createSession, deleteSession, getSession, encrypt } from "../session";
import { redirect } from "next/navigation";
import { getCustomerByNo, getUserToken, userStoreCustomer, validateCustomer } from "../data";

/*
export async function login(token: string) {
  let user;
  if (token) {
    user = await getUserToken(token);
    user.token = token
    const userCustomer = await getCustomerByNo(token, user?.customer_no)
    console.log(userCustomer)
    user.customer = userCustomer
  }
  await createSession(user)
  redirect('/explore')
}

*/
export async function login(token: string) {
  try {
    const user = await getUserToken(token as string);
    console.log('User data:', user);
    if (!user) {
      throw new Error('Failed to retrieve user data');
    }

    user.token = token;
    const enrichedUser = await handleCustomerData(user);
    console.log('Login successful:', enrichedUser);

    await createSession(enrichedUser);
    redirect('/explore');

  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logout() {
  await deleteSession()
  redirect('/');
}

export async function getHeaders() {
  const session = await getSession();
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  // @ts-ignore
  if (session && session.user && session.user.token) {
    // @ts-ignore
    headers['Authorization'] = `Bearer ${session.user.token}`;
  }
  return headers;
}

const handleCustomerData = async (user: any) => {
  if (user.customer_no === null) {
    return await handleNewCustomer(user);
  } else {
    return await handleExistingCustomer(user);
  }
};

const handleNewCustomer = async (user: any) => {
  try {
    const validateUser = await validateCustomer(user.token, user);
    console.log('Customer validation result:', validateUser);

    user.customer_no = validateUser.data.customer_no;
    user.customer = validateUser.data;

    if (user.customer_no) {
      const userCustomer = await userStoreCustomer(user.token, user);
      console.log('Customer stored:', userCustomer);
      user.customers = [userCustomer.data];
    }

    return user;
  } catch (error) {
    console.error('Error handling new customer:', error);
    throw new Error('Failed to process new customer data');
  }
};

const handleExistingCustomer = async (user: any) => {
  try {
    const customerData = await getCustomerByNo(user.token, user.customer_no);
    console.log('Existing customer data:', customerData);

    user.customer = customerData;
    return user;
  } catch (error) {
    console.error('Error retrieving existing customer:', error);
    throw new Error('Failed to retrieve customer data');
  }
};