import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSession } from '@/lib/session';
import { getAllProductPublic, getBookByCustomer, getBranchList, getInvoiceByCustomer, getSingleProductPublic } from '@/lib/data';
import BookingList from './module/booking-list';
import Heading from '@/components/ui/heading';
import { BookingListLoader } from '@/components/partial/loader';
import InvoiceList from './module/invoice-list';
import BookingDetailModal from './module/booking-detail-modal';
import moment from 'moment';
import { bookingUrl } from '@/lib/data/endpoints';
import axios from 'axios';
import { generateBasicToken } from '@/lib/helper';

export const metadata: Metadata = {
  title: 'Trips',
  description: 'Sewa jetski, Rental Jetski, main jetski di semarang'
}

async function Trips() {
  const session = await getSession();
  // @ts-ignore
  const { user } = session;
  const encodeToken = generateBasicToken(process.env.MIDTRANS_SERVER_KEY + ':');

  const getPaymentList = async () => {
    const startDate = moment().subtract(1, 'years').format('YYYY-MM-DD')
    const endDate = moment().format('YYYY-MM-DD')
    const url = bookingUrl + '/book/payment' + '?begin=' + startDate + '&end=' + endDate;
    const res = axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + user.token
      }
    }).then(response => {
      const data = response.data.data;
      return data
    }).catch(error => {
      console.log(error);
      throw error;
    })
    return res;
  }
  const payments = await getPaymentList();
  const products = await getAllProductPublic();
  return (
    <div className="flex flex-col min-h-screen">

      <Tabs defaultValue='on-progress'>
        <Container className="py-6 sticky top-0 z-30 bg-background w-full flex justify-between items-center shrink-0">
          {/* <button type="button">
            <ChevronLeft className="w-5 h-5" />
          </button> */}
          <div></div>
          <Heading variant="sm" className="text-foreground ml-4">Trips</Heading>
          <div></div>
        </Container>
        <Container el="nav" className="sticky top-0 z-30 bg-background pb-3 pt-1 border-b shadow-sm rounded-3xl">
          <TabsList className="flex gap-6 justify-start bg-background text-foreground/50">
            <TabsTrigger value='on-progress' className="font-bold">On Progress</TabsTrigger>
            <TabsTrigger value='history' className="font-bold">History</TabsTrigger>
          </TabsList>
        </Container>
        <div className="relative mt-6 mb-20">
          {/* Tab on progress */}
          <TabsContent value='on-progress'>
            <Suspense fallback={<BookingListLoader />}>
              <BookingList
                payments={payments}
                products={products}
                user={session?.user}
              />
            </Suspense>
          </TabsContent>
          {/* Tab history */}
          <TabsContent value='history'>
            <Suspense fallback={<BookingListLoader />}>
              <InvoiceList user={session?.user} products={products} />
            </Suspense>
          </TabsContent>
        </div>
      </Tabs>
      <BookingDetailModal />
    </div>
  )
}

export default Trips;