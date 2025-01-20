import Container from '@/components/ui/container';
import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import EditInfoForm from './module/edit-info-form';
import axios from 'axios';
import { customerUrl } from '@/lib/data/endpoints';
import { getSession } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Edit Info',
  description: 'Sewa jetski, Rental Jetski, main jetski di semarang'
}



async function EditInfoPage() {
  const session = await getSession();
  // @ts-ignore
  const { user } = session;

  async function getCustomer() {
    try {
      const response = await axios.get(customerUrl + "/" + user.id, { headers: { Accept: 'application/json', Authorization: 'Bearer ' + user.token } })
      const data = response.data.data
      return data;
    } catch (error: any) {
      // console.log(error)
      return {
        error: error.response?.data,
      };
    }
  }
  const costumer = await getCustomer();

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
        <h3 className="font-bold text-sm text-foreground/75">Edit Information</h3>
        <div></div>
      </Container>
      <Container className="mt-4">
        <EditInfoForm user={user} customer={costumer} />
      </Container>
    </div>
  )
}

export default EditInfoPage