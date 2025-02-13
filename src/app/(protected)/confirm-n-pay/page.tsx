
import React from 'react';
import { Metadata } from 'next';
import { getSession } from '@/lib/session';
import ConfirmNPayClient from './module/confirm-n-pay-client';
import { getCustomerByNo, getCustomerByNoMulti, getCustomerList, getUserCustomerList } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Confirm & Pay',
  description: 'Sewa jetski, Rental Jetski, main jetski di Semarang'
}

async function ConfirmNPay() {
  const session = await getSession();
  // @ts-ignore
  const { token, customer_no } = session?.user;
  
  let customerData = {};
  if(customer_no) {
    customerData = await getCustomerByNo(token, customer_no)
  }

  return <ConfirmNPayClient user={session?.user} customerData={customerData} />;
}

export default ConfirmNPay;
