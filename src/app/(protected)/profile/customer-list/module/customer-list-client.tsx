'use client';

import React from 'react';
import Heading from '@/components/ui/heading';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Mail, Phone, SquarePen } from 'lucide-react';
import { useUiLayoutStore } from '@/store/ui-layout';
import CustomerDetailModal from './customer-detail-modal';
import CustomerEditModal from './customer-edit-modal';
import CustomerAddModal from './customer-add-modal';
import OpenModalButton from '@/components/ui/button/open-modal-button';
import { CustomerListLoader } from '@/components/partial/loader';

export interface CustomerType {
  id: string | null,
  user_id?: string | null,
  customer_no: string | null,
  type: string | null,
  customer_id?: string | null,
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
  sosmeds?: string | null,
  prospects?: string | null,
  books?: string | null,
}

function CustomerListClient({
  user,
  customerList,
  revalidation,
}: {
  user: any;
  customerList: CustomerType[];
  revalidation: () => Promise<void>;
}) {
  const { openModal, setModalView, modalView } = useUiLayoutStore(state => state);
  const [selectedCustomer, setSelectedCustomer] = React.useState<CustomerType | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const handleClick = (value: CustomerType) => {
    const view = 'customer-list-view';
    setSelectedCustomer(value);
    setModalView(view);
    openModal(view);
  }
  const handelEdit = (value: CustomerType) => {
    console.log(value)
    const view = 'customer-edit-view';
    setSelectedCustomer(value);
    setModalView(view)
    openModal(view)
  }
  const handleRevalidation = async () => {
    setIsLoading(true);
    try {
      await revalidation();
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <CustomerListLoader />
      ) : (
        customerList.map((customer, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="relative p-0 flex flex-col divide-y">
              <button type='button' onClick={() => handleClick(customer)} className="flex flex-col space-y-1.5 p-4">
                <Heading variant='base' className="font-semibold leading-none tracking-tight capitalize">{customer.name}</Heading>
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
        ))
      )}
      <div className="flex-shrink flex flex-col w-full mt-6 gap-2">
        <OpenModalButton
          view="customer-add-view"
          variant='default'
          className='h-10 px-4 py-2'
        >
          Add New
        </OpenModalButton>
      </div>
      {modalView === 'customer-add-view' && <CustomerAddModal user={user} onRevalidate={handleRevalidation} />}
      {selectedCustomer !== null &&
        <>
          {modalView === 'customer-edit-view' && <CustomerEditModal user={user} customer={selectedCustomer} />}
          {modalView === 'customer-list-view' && <CustomerDetailModal customerData={selectedCustomer} />}
        </>
      }
    </div>
  )
}

export default CustomerListClient;