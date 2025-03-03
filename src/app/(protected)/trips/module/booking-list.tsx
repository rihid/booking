import React from 'react';
import Container from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Star, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import { z } from 'zod';
import { BookByCustomerSchema, ProductSchema } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { getBookByCustomer } from '@/lib/data';
import BookingCard from './booking-card';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { generateBasicToken } from '@/lib/helper';
import { masterUrl } from '@/lib/data/endpoints';
import MidtransScript from './midtrans-script';
import { BookingCardLoader } from '@/components/partial/loader';
import PaymentLinkWatcher from './payment-link-watcher';

async function BookingListTest({
  user,
  products,
}: {
  user: any;
  products: z.infer<typeof ProductSchema>[];
}) {

  const getPaymentMethod = () => {
    const res = axios.get(masterUrl + '/payment-method', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + user.token
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
  const getPaymentStatus = (bookNo: string) => {
    const midtransUrl = (process.env.NEXT_PUBLIC_MIDTRANS_API as string) + bookNo + '/status';
    const encodeToken = generateBasicToken(process.env.MIDTRANS_SERVER_KEY + ':');

    const res = axios.get(midtransUrl, {
      headers: {
        accept: 'application/json',
        authorization: 'Basic ' + encodeToken,
      }
    }).then(response => {
      const data = response.data;

      return data;
    }).catch(error => {
      console.log(error);
      throw error;
    })

    return res;
  }

  const bookingBody = {
    customer_no: user?.customer_no as string,
    type: "booking",
    begin: null,
    end: null
  }

  const midtransRedirectUrl = process.env.NEXT_PUBLIC_MIDTRANS_REDIRECT_URL as string;

  const [bookings, paymentMethod] = await Promise.all([
    getBookByCustomer(user?.token, bookingBody),
    getPaymentMethod()
  ]);

  const bookingData = await Promise.all(
    bookings.map(async (booking) => {
      const product = booking.product_no ? products.find(p => p.product_no === booking.product_no) : null;
      const formatBookNo = booking.book_no.replace(/\//g, '_');
      const paymentStatus = await getPaymentStatus(formatBookNo);

      let snapLink = null;
      if (booking.downPayments.length > 0 && booking.downPayments[0].token) {
        snapLink = midtransRedirectUrl + '/' + booking.downPayments[0].token;
      }

      return { booking, product, paymentStatus, snapLink }
    })
  );

  return (
    <>
      <Container className="space-y-6">
        {bookings.length > 0 ?
          bookingData.map(async ({ booking, product, paymentStatus, snapLink }) => {
            return (
              <div className='relative' key={booking.id}>
                <BookingCard
                  user={user}
                  booking={booking}
                  paymentMethod={paymentMethod}
                  product={product}
                  paymentStatus={paymentStatus}
                  snapLink={snapLink}
                />
              </div>
            )
          }) :
          (
            <div className="flex flex-col items-center justify-center h-auto">
              <div className="px-12 text-center">
                <Image
                  src="/images/no-data-bro.svg"
                  width={320}
                  height={320}
                  alt="404 Illustration"
                />
              </div>

              <div className="grid gap-2 text-center">
                <div className="grid gap-2">
                  <h3>No Data Found</h3>
                  <p>It&apos;s Okay!</p>
                </div>

                <div>
                  <Link href="/" className="hover:underline underline-offset-2">
                    Let&apos;s Go Back
                  </Link>
                </div>
              </div>
            </div>
          )
        }
      </Container>
      <PaymentLinkWatcher bookings={bookings} />
    </>
  )
}

export default BookingListTest;