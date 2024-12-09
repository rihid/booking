
import React from 'react';
import { Metadata } from 'next';
import { getSession } from '@/lib/session';
import ConfirmNPayClient from './module/confirm-n-pay-client';
import { getCustomerByNoMulti, getCustomerList, getUserCustomerList } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Confirm & Pay',
  description: 'Sewa jetski, Rental Jetski, main jetski di semarang'
}

async function ConfirmNPay() {
  const session = await getSession();
  let user;
  let customerList: any = []
  let customerMulti: any = []
  const customerArr = [];
  if (session) {
    user = session.user;
    // @ts-ignore
    customerList = await getUserCustomerList(user.token, user);
    let customerNo = []
    for (let i = 0; i < customerList.length; i++) {
      customerNo.push(customerList[i].customer_no)
    }
    // @ts-ignore
    customerMulti = await getCustomerByNoMulti(user.token, customerNo);

    for (let j = 0; j < customerList.length; j++) {
      const dataCustomers = customerMulti.find((c: any) => c.customer_no === customerList[j].customer_no);
      customerArr.push({
        id: customerList[j].id,
        user_id: customerList[j].user_id,
        customer_no: customerList[j].customer_no,
        type: customerList[j].type,
        customer_id: dataCustomers.id,
        name: dataCustomers.name,
        address: dataCustomers.address,
        phone: dataCustomers.phone,
        email: dataCustomers.email,
        identity_number: dataCustomers.identity_number,
        vat: dataCustomers.vat,
        org_no: dataCustomers.org_no,
        rating: dataCustomers.rating,
        birthday: dataCustomers.birthday,
        age: dataCustomers.age,
        sosmeds: dataCustomers.sosmeds,
        prospects: dataCustomers.prospects,
        books: dataCustomers.books,
      })
    }
  }
  
  return <ConfirmNPayClient user={user} userCustomer={customerArr} />;
}

export default ConfirmNPay;
