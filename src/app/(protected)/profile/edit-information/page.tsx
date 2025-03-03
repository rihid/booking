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

export const metadata: Metadata = {
  title: 'Edit Info',
  description: 'Sewa jetski, Rental Jetski, main jetski di Semarang'
}

async function EditInfoPage() {
  const session = await getSession();
  // @ts-ignore
  const { user } = session;

  const costumer = await getCustomerByNo(user.token, { customer_no: user.customer_no });
  console.log('costumer', costumer)

  return (
    <Container className="mt-4">
      <EditInfoForm user={user} customer={costumer} />
    </Container>
  )
}

export default EditInfoPage