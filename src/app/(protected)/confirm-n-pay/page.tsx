
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getSession } from '@/lib/session';
import ConfirmNPayClient from './module/confirm-n-pay-client';
import { getCustomerByNo } from '@/lib/data';
import { ConfirmPayLoader } from '@/components/partial/loader';
import axios from 'axios';
import { masterUrl } from '@/lib/data/endpoints';

export const metadata: Metadata = {
  title: 'Confirm & Pay',
  description: 'Sewa jetski, Rental Jetski, main jetski di Semarang'
}

async function PageContent() {
  const session = await getSession();
  // @ts-ignore
  const { token, customer_no } = session?.user;

  let customerData = {};
  if (customer_no) {
    customerData = await getCustomerByNo(token, customer_no)
  }
  return (
    <>
      <ConfirmNPayClient user={session?.user} customerData={customerData} />
    </>
  )
}
async function ConfirmNPay() {

  return (
    <Suspense fallback={<ConfirmPayLoader />}>
      <PageContent />
    </Suspense>
  )
}

export default ConfirmNPay;
