import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/container';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button/button';
import Image from 'next/image';
import Link from 'next/link';
import OpenModalButton from '@/components/ui/button/open-modal-button';
import { getSession } from '@/lib/session';
import { getAllProductPublic, getBookByCustomer, getBranchList, getInvoiceByCustomer, getSingleProductPublic } from '@/lib/data';
import moment from 'moment';
import { generateBasicToken } from '@/lib/helper';
import BookingList from './module/booking-list';
import Heading from '@/components/ui/heading';
import { BookingListLoader } from '@/components/partial/loader';
import InvoiceList from './module/invoice-list';

export const metadata: Metadata = {
  title: 'Trips',
  description: 'Sewa jetski, Rental Jetski, main jetski di semarang'
}

async function Trips() {
  const session = await getSession();
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
    </div>
  )
}

export default Trips;