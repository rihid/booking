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

async function BookingList({
  user,
  products,
}: {
  user: any;
  products: z.infer<typeof ProductSchema>[];
}) {

  const bookingBody = {
    customer_no: user?.customer_no as string,
    type: "booking",
    begin: null,
    end: null
  }
  const bookingData = await getBookByCustomer(user?.token, bookingBody);

  const midtransRedirectUrl = process.env.NEXT_PUBLIC_MIDTRANS_REDIRECT_URL as string;

  return (
    <Container className="space-y-6">
      {bookingData.length > 0 ?
        bookingData.map((booking) => {
          let bookingPayment = 0;
          for (let i = 0; i < booking.downPayments.length; i++) {
            bookingPayment += parseFloat(booking.downPayments[i].total)
          }
          const product = booking.product_no ? products.find(p => p.product_no === booking.product_no) : null;
          let paymentLink;
          if (booking.downPayments.length > 0) {
            const token = booking.downPayments[0].token;
            if (token !== null) {
              paymentLink = midtransRedirectUrl + token;
            } else {
              paymentLink = null
            }
          }
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