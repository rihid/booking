import React from 'react';
import { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { Badge, BadgeCheck, BadgeAlert } from 'lucide-react';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button/button';
import { generateBasicToken } from '@/lib/helper';
import { getSession } from '@/lib/session';
import axios from 'axios';
import moment from 'moment';
import { bookingUrl, masterUrl } from '@/lib/data/endpoints';
import { getAllProductPublic, getBookbyNo } from '@/lib/data';
import { midtransServerKey } from '@/lib/constants';
import ActionComp from './module/action-comp';
import ConfirmationContent from './module/confirmation-content';
import ConfirmationContent2 from './module/confirmation-content2';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Confirmation',
  description: 'Sewa jetski, Rental Jetski, main jetski di Semarang'
}

async function Confirmation({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | null };
}) {
  const session = await getSession();
  // @ts-ignore 
  const { token, customer_no } = session.user
  const orderId = searchParams['order_id'] || null;
  const formatOrderID = orderId ? (orderId as string).replace(/_/g, '/') : null;
  const transactionId = searchParams['transaction_id'] || null;
  const encodeToken = generateBasicToken(process.env.MIDTRANS_SERVER_KEY + ':');
  // actions
  const getPaymentStatus = () => {
    const midtransUrl = (process.env.NEXT_PUBLIC_MIDTRANS_API as string) + transactionId + '/status';
    const res = axios.get(midtransUrl, {
      headers: {
        accept: 'application/json',
        authorization: 'Basic ' + encodeToken,
      }
    }).then(response => {
      const data = response.data;
      console.log('status', response.data)
      return data;
    }).catch(error => {
      console.log(error);
      throw error;
    })

    return res;
  }
  const getPaymentMethod = () => {
    const res = axios.get(masterUrl + '/payment-method', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      }
    }).then(response => {
      const data = response.data.data;
      return data;
    }).catch(error => {
      console.log(error);
      throw error;
    })

    return res;
  }
  const getPaymentList = async () => {
    const startDate = moment().subtract(7, 'days').format('YYYY-MM-DD')
    const endDate = moment().format('YYYY-MM-DD')
    const url = bookingUrl + '/book/payment' + '?begin=' + startDate + '&end=' + endDate;
    const res = axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
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
  // data
  const products = await getAllProductPublic();
  let booking: any = null;
  let productVal: any = null;
  if (formatOrderID) {
    booking = await getBookbyNo(token, formatOrderID);
    if (booking) {
      productVal = products.find(p => p.product_no === booking?.product_no);
    }
  }
  const paymentMethod = await getPaymentMethod();
  const paymentStatus = await getPaymentStatus();
  const paymentList = await getPaymentList();

  function StatusCard() {
    const { status_code } = paymentStatus;
    switch (status_code) {
      case '404':
        return (
          <>
            {booking ?
              <Card className="flex flex-col items-center justify-center border-none p-8 shadow">
                <div>
                  <BadgeCheck className="w-32 h-32 text-brand" />
                </div>
                <Heading variant='xl' className="text-muted-foreground my-2.5">Thanks</Heading>
                <div className="mt-1 text-foreground/50 text-sm font-normal text-center w-full max-w-[220px]">
                  <span>Congratulations! your order have been
                    sucessfully process.</span>
                </div>
              </Card>
              :
              <Card className="flex flex-col items-center justify-center border-none p-8 shadow">
                <div>
                  <BadgeAlert className="w-32 h-32 text-brand" />
                </div>
                <Heading variant='xl' className="text-muted-foreground my-2.5">Sorry</Heading>
                <div className="mt-1 text-foreground/50 text-sm font-normal text-center w-full max-w-[220px]">
                  <span>{paymentStatus.status_message}</span>
                </div>
              </Card>

            }
          </>
        );
      case '200':
        return (
          <Card className="flex flex-col items-center justify-center border-none p-8 shadow">
            <div>
              <BadgeCheck className="w-32 h-32 text-brand" />
            </div>
            <Heading variant='xl' className="text-muted-foreground my-2.5">Thanks</Heading>
            <div className="mt-1 text-foreground/50 text-sm font-normal text-center w-full max-w-[220px]">
              <span>Congratulations! your order have been
                sucessfully process.</span>
            </div>
          </Card>
        );
      case '201':
        return (
          <Card className="flex flex-col items-center justify-center border-none p-8 shadow">
            <div>
              <BadgeCheck className="w-32 h-32 text-brand" />
            </div>
            <Heading variant='xl' className="text-muted-foreground my-2.5">Pending</Heading>
            <div className="mt-1 text-foreground/50 text-sm font-normal text-center w-full max-w-[220px]">
              <span>Your payment is pending.</span>
            </div>
          </Card>
        );
      case '202':
        return (
          <Card className="flex flex-col items-center justify-center border-none p-8 shadow">
            <div>
              <BadgeCheck className="w-32 h-32 text-brand" />
            </div>
            <Heading variant='xl' className="text-muted-foreground my-2.5">Denied</Heading>
            <div className="mt-1 text-foreground/50 text-sm font-normal text-center w-full max-w-[220px]">
              <span>Your payment has been processed but is denied by payment provider</span>
            </div>
          </Card>
        );
      case '407':
        return (
          <Card className="flex flex-col items-center justify-center border-none p-8 shadow">
            <div>
              <BadgeCheck className="w-32 h-32 text-brand" />
            </div>
            <Heading variant='xl' className="text-muted-foreground my-2.5">Expired</Heading>
            <div className="mt-1 text-foreground/50 text-sm font-normal text-center w-full max-w-[220px]">
              <span>Your payment has expiredr</span>
            </div>
          </Card>
        )
      default:
        return (
          <Card className="flex flex-col items-center justify-center border-none p-8 shadow">
            <div>
              <BadgeCheck className="w-32 h-32 text-brand" />
            </div>
            <Heading variant='xl' className="text-muted-foreground my-2.5">Thanks</Heading>
            <div className="mt-1 text-foreground/50 text-sm font-normal text-center w-full max-w-[220px]">
              <span>Congratulations! your order have been
                sucessfully process.</span>
            </div>
          </Card>
        );
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <StatusCard />
      {booking &&
        <ConfirmationContent2
          user={session?.user}
          product={productVal}
          booking={booking}
          paymentMethod={paymentMethod}
          paymentStatus={paymentStatus}
          payments={paymentList}
        />
      }
      {!booking &&
        <Container className="mt-8">
          <Heading variant='base' className="text-muted-foreground">Order Detail</Heading>
          <div className="font-normal text-sm text-brand">
            <span>Order ID #</span>
          </div>
          <div className="mt-8 flex justify-center items-center">
            <div className="flex flex-col items-center gap-4 w-auto">
              <Link href="/explore">
                <Button className="w-full">Back to home</Button>
              </Link>
            </div>
          </div>
        </Container>
      }
    </div>
  )
}

export default Confirmation;