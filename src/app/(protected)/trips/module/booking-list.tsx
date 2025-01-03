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
import { getBookByCustomer } from '@/lib/data';
import BookingCard from './booking-card';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { generateBasicToken } from '@/lib/helper';
import { masterUrl } from '@/lib/data/endpoints';
import MidtransScript from './midtrans-script';

async function BookingList({
  user,
  products,
  payments,
}: {
  user: any;
  products: z.infer<typeof ProductSchema>[];
  payments?: any;
}) {

  const getPaymentMethod = () => {
    const res = axios.get(masterUrl + '/payment-method', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + user.token
      }
    }).then(response => {
      console.log(response.data.data)
      const data = response.data.data;
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
  const bookingData = await getBookByCustomer(user?.token, bookingBody);
  const paymentMethod = await getPaymentMethod();

  const midtransRedirectUrl = process.env.NEXT_PUBLIC_MIDTRANS_REDIRECT_URL as string;

  return (
    <>
      <Container className="space-y-6">
        {bookingData.length > 0 ?
          bookingData.map(async (booking) => {
            let bookingPayment = 0;
            for (let i = 0; i < booking.downPayments.length; i++) {
              bookingPayment += parseFloat(booking.downPayments[i].total)
            }
            const product = booking.product_no ? products.find(p => p.product_no === booking.product_no) : null;
            let snapLink;
            if (booking.downPayments.length > 0) {
              const token = booking.downPayments[0].token;
              if (token !== null) {
                snapLink = midtransRedirectUrl + '/' + token;
              } else {
                snapLink = null
              }
            }

            const midtransUrl = process.env.NEXT_PUBLIC_MIDTRANS_API + '/v2/' + booking.id + '/status';
            const encodeToken = generateBasicToken(process.env.MIDTRANS_SERVER_KEY + ':');
            const getPaymentStatus = () => {
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
            let paymentStatus = await getPaymentStatus();
            if(paymentStatus?.status_code === '407') {
              await axios.get(process.env.NEXT_PUBLIC_MIDTRANS_API + '/v2/' + booking.id.concat('$') + '/status', {
                headers: {
                  accept: 'application/json',
                  authorization: 'Basic ' + encodeToken,
                }
              }).then(response => {
                let data = response.data;
                // data.order_id = data.order_id.replace(/\$/g, '')
                if(data.status_code !== '404') {
                  paymentStatus = data
                }
              }).catch(error => {
                console.log(error);
                throw error;
              })
            }
            
            const paymentVal = payments.find((p: any) => p.book_no == booking.book_no)

            return (
              <div className='relative' key={booking.id}>
                <BookingCard
                  user={user}
                  booking={booking}
                  paymentMethod={paymentMethod}
                  product={product}
                  bookingPayment={bookingPayment}
                  paymentStatus={paymentStatus}
                  paymentVal={paymentVal}
                  snapLink={snapLink}
                />
              </div>

              /*
                <Card key={booking.id} className="border-slate-200">
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="text-foreground/75">{product?.product_name}</CardTitle>
                    <div className="flex items-center text-foreground/50 gap-x-2 !mt-0">
                      <Star className="w-4 h-4" fill="#F6891F" strokeWidth={0} />
                      <p className="inline-block text-xs font-normal">4.9 (120 reviews)</p>
                    </div>
                  </CardHeader>
                  <CardContent className="relative space-y-0.5">
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
                    <div className="absolute -left-0.5 w-6 h-12 bg-background border-2 border-l-background border-y-slate-200 border-r-slate-200 rounded-tr-full rounded-br-full" />
    
                    <div className="absolute -right-0.5 w-6 h-12 bg-background border-2 border-r-background border-y-slate-200 border-l-slate-200 rounded-tl-full rounded-bl-full" />
                    <div className="h-12 bg-transparent" />
                    <div className="flex items-center justify-center">
                      <div className="mt-2 mb-8">
                        <QRCodeSVG
                          value={booking.book_no}
                          size={180}
                          level='H'
                        />
                      </div>
                    </div>
                    <pre>{JSON.stringify(paymentStatus, null, 2)}</pre>
                  </CardContent>
                  <CardFooter className="grid grid-cols-1 w-full gap-3">
                    {!paymentVal ?
                      <Link href={'#'} className="block w-full">
                        <Button type='button' variant="outline">
                          Confirm Payment
                        </Button>
                      </Link>
                      :
                      <>
                        {!bookingPayment &&
                          <>
                            {paymentLink ?
                              <Link
                                href={paymentLink}
                                className="w-full"
                              >
                                <Button className="text-xs h-auto bg-brand hover:bg-brand/90">
                                  Confirm Payment
                                </Button>
                              </Link>
                              :
                              <div className="inline-block w-auto">
                                <Button disabled variant="secondary" className="text-xs h-auto">
                                  Cash Payment
                                </Button>
                              </div>
                            }
                          </>
                        }
                      </>
                    }
    
                  </CardFooter>
                </Card>
              */
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
      <MidtransScript />
    </>
  )
}

export default BookingList;