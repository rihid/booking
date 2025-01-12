'use client';

import React from 'react';
import Heading from '@/components/ui/heading';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Mail, Phone, SquarePen } from 'lucide-react';
import { useUiLayoutStore } from '@/store/ui-layout';
import CustomerDetailModal from './customer-detail-modal';
import CustomerEditModal from './customer-edit-modal';

export interface CustomerType {
  id: string | null,
  user_id: string | null,
  customer_no: string | null,
  type: string | null,
  customer_id: string | null,
  name: string | null,
  address: string | null,
  phone: string | null,
  email: string | null,
  identity_number: string | null,
  vat: string | null,
  org_no: string | null,
  rating: string | null,
  birthday: string | null,
  age: string | null,
  sosmeds: string | null,
  prospects: string | null,
  books: string | null,
}

function CustomerListClient({
  user,
  customerList,
}: {
  user: any;
  customerList: CustomerType[];
}) {
  const { openModal, setModalView, modalView } = useUiLayoutStore(state => state);
  const [selectedCustomer, setSelectedCustomer] = React.useState<CustomerType | null>(null);
  const handleClick = (value: CustomerType) => {
    const view = 'customer-list-view';
    setSelectedCustomer(value);
    setModalView(view);
    openModal(view);
  }
  const handelEdit = (value: CustomerType) => {
    console.log(value.customer_id)
    const view = 'customer-edit-view';
    setSelectedCustomer(value);
    setModalView(view)
    openModal(view)
  }
  return (
    <>
      {customerList.map((customer, index) => {
        return (
          <Card key={index} className="mb-4">
            <CardContent className="relative p-0 flex flex-col divide-y">
              <button type='button' onClick={() => handleClick(customer)} className="flex flex-col space-y-1.5 p-4">
                <Heading variant='base' className="font-semibold leading-none tracking-tight">{customer.name}</Heading>
                <p className="text-sm text-muted-foreground">{customer.address}</p>
              </button>
              <button
                type="button"
                onClick={() => handelEdit(customer)}
                className="absolute top-0 right-0 p-4 text-sm text-muted-foreground"
              >
                <SquarePen className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 divide-x items-center justify-center">
                <Link href={`mailto:${customer.email}`} className="flex items-center justify-center p-4">
                  <span className="text-muted-foreground">
                    <Mail className="h-5 w-5 mr-2" />
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">Email</span>
                </Link>
                <Link href={`tel:${customer.phone}`} className="flex items-center justify-center p-4">
                  <span className="text-muted-foreground">
                    <Phone className="h-5 w-5 mr-2" />
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">Phone</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        )
      })}
      {selectedCustomer !== null &&
        <>
          {modalView === 'customer-list-view' && <CustomerDetailModal customerData={selectedCustomer} />}
          {modalView === 'customer-edit-view' && <CustomerEditModal user={user} customer={selectedCustomer} />}
        </>
      }
    </>
  )
}

export default CustomerListClient;