import React from 'react';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Mail, Phone } from 'lucide-react';
import { getSession } from '@/lib/session';
import { getCustomerByNoMulti, getUserCustomerList } from '@/lib/data';
import CustomerListClient from './module/customer-list-client';

async function CustomerList() {
  const session = await getSession();
  // @ts-ignore
  const { user } = session;
  const userCustomers = await getUserCustomerList(user.token, user);
  let customerNo = []
  for (let i = 0; i < userCustomers.length; i++) {
    customerNo.push(userCustomers[i].customer_no)
  }
  const customers = await getCustomerByNoMulti(user.token, customerNo);
  const customerList = [];
  for (let j = 0; j < userCustomers.length; j++) {
    const dataCustomers = customers.find((c: any) => c.customer_no === userCustomers[j].customer_no);
    customerList.push({
      id: userCustomers[j].id,
      user_id: userCustomers[j].user_id,
      customer_no: userCustomers[j].customer_no,
      type: userCustomers[j].type,
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
  console.log(customerList)
  return (
    <div className="flex flex-col min-h-screen mb-20">
      <Container className="py-6 sticky top-0 z-30 bg-background w-full border-b border-foreground-muted flex justify-between items-center shrink-0">
        <Link href="/profile">
          <button
            type="button"
          >
            <span>
              <ChevronLeft className="w-5 h-5" />
            </span>
          </button>
        </Link>
        <h3 className="font-bold text-sm text-foreground/75">Customer List</h3>
        <div></div>
      </Container>
      <Container className="mt-4">
        <CustomerListClient customerList={customerList} />
      </Container>
    </div>
  )
}

export default CustomerList;