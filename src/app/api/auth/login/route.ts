import { NextResponse } from 'next/server';
import { checkUserCustomer, getCustomerByNo, getUserToken } from '@/lib/data';
import { createSession } from '@/lib/session';

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ message: 'Token is required' }, { status: 400 });
  }
  console.log(token)
  try {
    const user = await getUserToken(token)
    console.log(user?.id)
    user.token = token
    const uc = await checkUserCustomer(token, user)
    user.customer_no = uc.customer_no
    user.customers = uc.data
    const customerData = await getCustomerByNo(token, uc.customer_no)
    console.log('getCustomerByNo')
    console.log(customerData)
    user.customer = customerData
    await createSession(user)
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Login failed', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
