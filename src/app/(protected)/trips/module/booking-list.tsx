'use client';

import React from 'react';
import Container from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Star, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import { TypeOf, z } from 'zod';
import { BookByCustomerSchema, ProductSchema } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import OpenModalButton from '@/components/ui/button/open-modal-button';
import { useRouter } from 'next/navigation';

function BookingList({
  user,
  basicToken,
  bookings,
  products,
}: {
  user: any;
  basicToken: string;
  bookings: z.infer<typeof BookByCustomerSchema>;
  products: z.infer<typeof ProductSchema>[];
}) {

  const router = useRouter();

  const handleCheckout = async (body: any) => {
    try {
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();
      console.log('respontoken', responseData);
      // @ts-ignore
      window.snap.pay(responseData.token);
    } catch (error) {
      console.log(error);
    }
  }
  const handleConfirmPayment = async (idx: number, prodNo: string) => {
    const totalPrice = bookings[idx].numbers.reduce((acc, val) => {
      return acc + parseInt(val.price.replace(/\./g, '')) * parseInt(val.qty);
    }, 0);
    const product = products.find(p => p.product_no === prodNo);
    // let bodyMidtrans = {
    //   orderId: bookings[idx].id,
    //   itemId: product?.id,
    //   productName: product?.product_name,
    //   price: totalPrice,
    //   quantity: 1,
    //   customer: user.name,
    //   customerEmail: user.email
    // }
    // await handleCheckout(bodyMidtrans);

    const bodyPayment = {
      transaction_details: {
        order_id: bookings[idx].id,
        gross_amount: totalPrice
      },
      item_details: [
        {
          id: product?.id,
          name: product?.product_name,
          price: totalPrice,
          quantity: 1,
        }
      ],
      customer_details: {
        first_name: bookings[idx].customer.name,
        email: bookings[idx].customer.email,
        phone: bookings[idx].customer.phone,
      },
      callbacks: {
        finish: `https://booking-safari.callistech.co.id/confirmation?order_id=${bookings[idx].id}&source=payment_link`
      }
    }
    axios.post(process.env.NEXT_PUBLIC_MIDTRANS_API + '/v1/payment-links', bodyPayment, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ' + basicToken,
      }
    }).then(response => {
      console.log(response.data);
      const data = response.data;
      // setPaymentlink(data.payment_link);
      router.push(data.payment_url);
    }).catch(error => {
      console.log(error)
    })
  }

  React.useEffect(() => {
    // snap script midtrans here
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''

    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl

    scriptTag.setAttribute("data-client-key", clientKey)
    scriptTag.async = true

    document.body.appendChild(scriptTag)
    return () => {
      document.body.removeChild(scriptTag)
    }
  }, []);
  return (
    <Container className="space-y-6">
      {bookings.length > 0 ?
        bookings.map((booking, index) => {
          let bookingPayment = 0;
          for (let i = 0; i < booking.downPayments.length; i++) {
            bookingPayment += parseFloat(booking.downPayments[i].total)
          }
          const product = booking.product_no ? products.find(p => p.product_no === booking.product_no) : null;
          return (
            <Card key={booking.id} className="shadow-md">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-foreground/75">{product?.product_name}</CardTitle>
                <div className="flex items-center text-foreground/50 gap-x-2 !mt-0">
                  <Star className="w-4 h-4" fill="#F6891F" strokeWidth={0} />
                  {/* <p className="inline-block text-xs font-normal">4.9 (120 reviews)</p> */}
                </div>
              </CardHeader>
              <CardContent className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <div className="text-foreground/50">
                    <span className="text-sm font-normal">#{booking.book_no.split('/').pop()} - {moment(booking.book_date).format('MMMM Do YYYY')}</span>
                  </div>
                  <div className="flex items-center text-foreground/50 gap-x-2">
                    <span className="text-xs font-normal">{booking.duration}</span>
                    <Clock className="text-brand inline-block w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-foreground/50">
                    <span className="text-sm  uppercase text-brand font-normal">On Schedule</span>
                  </div>
                  <div className="flex items-center text-foreground/50 gap-x-2">
                    <span className="text-xs font-normal">Marina</span>
                    <MapPin className="text-brand inline-block w-4 h-4" />
                  </div>
                </div>
              </CardContent>
              {!bookingPayment &&
                <CardFooter className="grid grid-cols-1 w-full gap-3">
                  <Button
                    className="text-xs h-auto bg-brand hover:bg-brand/90"
                  >
                    Confirm Payment
                  </Button>
                </CardFooter>
              }
            </Card>
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
  )
}

export default BookingList;