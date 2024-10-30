import React from 'react';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';
import { getSession } from '@/lib/session';
import { getCustomerByNoMulti, getUserCustomerList } from '@/lib/data';

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
  const costumerList = [];
  for (let j = 0; j < userCustomers.length; j++) {
    const dataCustomers = customers.find((c: any) => c.customer_no === userCustomers[j].customer_no);
    costumerList.push({
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
  console.log(costumerList)
  return (
    <div className="flex flex-col min-h-screen py-6 gap-6">
      <Container>
        {costumerList.map((customer, index) => {
          return (
            <Card className="mb-4">
              <CardContent className="p-0 flex flex-col divide-y">
                <div className="flex flex-col space-y-1.5 p-4">
                  <Heading variant='base' className="font-semibold leading-none tracking-tight">{customer.name}</Heading>
                  <p className="text-sm text-muted-foreground">{customer.customer_no}</p>
                </div>
                <div className="grid grid-cols-2 divide-x items-center justify-center">
                  <div className="flex items-center justify-center p-4">
                    <span>
                      <Mail className="h-4 w-4 mr-2" />
                    </span>
                    <span>Email</span>
                  </div>
                  <div className="flex items-center justify-center p-4">
                    <span>
                      <Phone className="h-4 w-4 mr-2" />
                    </span>
                    <span>Phone</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </Container>
    </div>
  )
}

export default CustomerList;