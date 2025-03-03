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

export const metadata: Metadata = {
  title: 'Trips',
  description: 'Sewa jetski, Rental Jetski, main jetski di Semarang'
}

async function Trips() {
  const session = await getSession();
  // @ts-ignore
  const { user } = session;

  const products = await getAllProductPublic();
  return (
    <>
      <div className="relative mt-6 mb-20">
        {/* Tab on progress */}
        <TabsContent value='on-progress'>
          <Suspense fallback={<BookingListLoader />}>
            <BookingList
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
      <BookingDetailModal />
    </>
  )
}

export default Trips;