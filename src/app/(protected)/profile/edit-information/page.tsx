import Container from '@/components/ui/container';
import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import EditInfoForm from './module/edit-info-form';
import axios from 'axios';
import { customerUrl } from '@/lib/data/endpoints';
import { getSession } from '@/lib/session';
import { getCustomerByNo } from '@/lib/data';
import PageHeader from './module/page-header';

export const metadata: Metadata = {
  title: 'Edit Info',
  description: 'Sewa jetski, Rental Jetski, main jetski di Semarang'
}

async function EditInfoPage() {
  const session = await getSession();
  // @ts-ignore
  const { user } = session;

  // async function getCustomer() {
  //   try {
  //     const response = await axios.post(customerUrl + "/get-by-no", { customer_no: user.customer_no }, { headers: { Accept: 'application/json', Authorization: 'Bearer ' + user.token } })
  //     const data = response.data.data
  //     return data;
  //   } catch (error: any) {
  //     // console.log(error)
  //     console.log(error.response?.data.message)
  //   }
  // }

  const costumer = await getCustomerByNo(user.token, { customer_no: user.customer_no });
  console.log('costumer', costumer)

  return (
    <div className="flex flex-col min-h-screen mb-20">
      <PageHeader />
      <Container className="mt-4">
        <EditInfoForm user={user} customer={costumer} />
      </Container>
    </div>
  )
}

export default EditInfoPage