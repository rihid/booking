'use client';

import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Loader2, MapPin, Star } from 'lucide-react';
import moment from 'moment';
import { useUiLayoutStore } from '@/store/ui-layout';
import { useTripStore } from '@/providers/store-providers/trip-provider';
import { usePaymentStore } from '@/providers/store-providers/payment-provider';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { bookingUrl } from '@/lib/data/endpoints';
import { useRouter } from 'next/navigation';
import { cn } from '@/assets/styles/utils';

function BookingCard({
  user,
  booking,
  paymentMethod,
  product,
  bookingPayment,
  paymentStatus,
  paymentVal,
  snapLink,
}: {
  user: any;
  booking: any;
  paymentMethod: any;
  product: any;
  bookingPayment: any;
  paymentStatus: any;
  paymentVal: any;
  snapLink?: any;
}) {
  const router = useRouter()
  const { openModal } = useUiLayoutStore(store => store);
  const { setTripBook } = useTripStore(store => store);
  const { paymentLinks, setPaymentLink } = usePaymentStore(store => store)
  const { status_code } = paymentStatus;

  const midtransRedirectUrl = process.env.NEXT_PUBLIC_MIDTRANS_REDIRECT_URL as string;
  const midtransApiUrl = process.env.NEXT_PUBLIC_MIDTRANS_API + '/v2/'

  const [loadingConfirm, setLoadingConfirm] = React.useState<boolean>(false);
  const [loadingSnap, setLoadingSnap] = React.useState<boolean>(false)

  const handleOpenModal = () => {
    openModal('trip-booking-view')
    setTripBook(booking)
  }
  const createSnapLink = () => {
    const plVal = paymentLinks.find((pl: any) => pl.order_id === paymentStatus.order_id)
    if (plVal) {
      return midtransRedirectUrl + '/' + plVal?.payment_token
    } else {
      return '/not-found'
    }
  }

  const handlePaymentConfirm = async () => {
    setLoadingConfirm(true)
    let methodVal = null
    if (paymentStatus.payment_type === 'bank_transfer') {
      const midtransBankVal = paymentStatus.va_numbers[0].bank;
      methodVal = paymentMethod.find((pm: any) => pm.name.toLowerCase() === midtransBankVal);
    }
    const paymentDp = booking.payment_dp;
    const body = {
      payment_no: null,
      book_no: booking.book_no,
      payment_date: paymentStatus.settlement_time,
      method_id: methodVal ? methodVal.id : null,
      amount: paymentStatus.gross_amount.replace(/\.00$/, ''),
      promo_id: paymentDp.promo_id || null,
      round: paymentDp.round || null,
      discount: paymentDp.discount || null,
      total: paymentStatus.gross_amount.replace(/\.00$/, ''),
      org_no: null,
      branch_no: null,
      payment_type: "down_payment",
      note: null,
      token_payment: null,
      cash_id: null
    }
    // console.log(body)
    await axios.post(bookingUrl + '/book/payment', body, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + user.token
      }
    }).then(response => {
      console.log(response.data);
      const data = response.data;
      if (data) router.refresh()
      setLoadingConfirm(false)
    }).catch(error => {
      setLoadingConfirm(false)
      console.log(error);
      throw error;
    })
  }
  const handleExpirePaymentSnap = async (value: any) => {
    console.log('snap val', value)
    setLoadingSnap(true)
    let body = {
      orderId: booking.id + '$',
      itemId: product.id,
      productName: product.product_name,
      price: parseFloat(value.book_total),
      quantity: 1,
      customer: user.name,
      customerEmail: user.email
    }
    try {
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const res = await response.json();
      if (res) {
        setLoadingSnap(false)
      }
      setPaymentLink({
        order_id: body.orderId,
        payment_token: res.data.token
      })
      // @ts-ignore
      window.snap.pay(res.data.token, {
        onPending: (result: any) => {
          // router.push(`/confirmation?order_id=${body.orderId}&status_code=${result.status_code}&payment_token=${res.data.token}`)
        },
      });
    } catch (error) {
      setLoadingSnap(false)
      console.log(error);
      throw error;
    }
  }
  const handleAddNewPayment = async () => {
    let methodVal = null
    if (paymentStatus.payment_type === 'bank_transfer') {
      const midtransBankVal = paymentStatus.va_numbers[0].bank;
      methodVal = paymentMethod.find((pm: any) => pm.name.toLowerCase() === midtransBankVal);
    }
    const body = {
      payment_no: null,
      book_no: booking.book_no,
      payment_date: moment().format('YYYY-MM-DD'),
      method_id: methodVal ? methodVal.id : null,
      amount: '0',
      promo_id: null,
      round: null,
      discount: null,
      total: '0',
      org_no: null,
      branch_no: null,
      payment_type: "down_payment",
      note: null,
      token_payment: null,
      cash_id: null
    }
    console.log(body)
    const res = await axios.post(bookingUrl + '/book/payment', body, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + user.token
      }
    }).then(response => {
      console.log(response.data.data);
      const data = response.data.data;
      if (data) router.refresh();
      return data
    }).catch(error => {
      console.log(error);
      throw error;
    })
    return res;
  }

  React.useEffect(() => {
    const voidBooking = async (id: string) => {
      await axios.post(bookingUrl + '/book/void', { id: id }, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + user.token
        }
      })
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error);
          throw error;
        })
    }
    if (paymentStatus.status_code === '407' && booking.status !== 'void') {
      voidBooking(paymentStatus.order_id)
    }
  }, [paymentStatus, booking])

  return (
    <>
      <Card className="border-slate-300">
        {/* <pre>p: {JSON.stringify(paymentStatus, null, 2)}</pre> */}
        {/* <pre>b {JSON.stringify(booking.status, null, 2)}</pre> */}
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-foreground/75">{product?.product_name}</CardTitle>
          <div className="flex items-center text-foreground/50 gap-x-2 !mt-0">
            <Star className="w-4 h-4" fill="#F6891F" strokeWidth={0} />
            <p className="inline-block text-xs font-normal">4.9 (120 reviews)</p>
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

          <div className="absolute -left-0.5 w-6 h-12 bg-background border-2 border-l-background border-y-slate-300 border-r-slate-300 rounded-tr-full rounded-br-full" />

          <div className="absolute -right-0.5 w-6 h-12 bg-background border-2 border-r-background border-y-slate-300 border-l-slate-300 rounded-tl-full rounded-bl-full" />
          <div className="h-12 bg-transparent" />
          <div className="flex items-center justify-center">
            <div className="my-2">
              <QRCodeSVG
                value={booking.book_no}
                size={200}
                level='M'
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-1 w-full gap-3">
          {paymentVal && status_code === '201' &&
            // masuk payment & pembayaran pending
            <Button className="text-xs h-auto bg-brand hover:bg-brand/90">
              {snapLink ?
                <Link
                  href={snapLink}
                  className="w-full"
                >
                  Pay Now
                </Link>
                :
                <>payment expired</>
              }
            </Button>
          }
          {!paymentVal && status_code === '200' &&
            // belum masuk payment & pembayaran done
            <Button type='button' className="text-xs h-auto bg-brand hover:bg-brand/90" disabled={loadingConfirm} onClick={handlePaymentConfirm}>
              {loadingConfirm &&
                <Loader2 className={cn('h-4 w-4 animate-spin', 'mr-2')} />
              }
              Confirm Payment
            </Button>
          }
          {!paymentVal && status_code === '201' &&
            // belum masuk payment & pembayaran pending
            <Button type='button' className="text-xs h-auto bg-brand hover:bg-brand/90">
              <Link
                href={createSnapLink()}
                className="w-full"
              >
                Pay Now
              </Link>
            </Button>
          }
          {paymentVal && status_code === '404' &&
            // masuk payment & cash
            <Button disabled variant="secondary" className="text-xs h-auto">
              Cash Payment
            </Button>
          }
          {paymentVal && status_code == '407' &&
            // masuk payment & pembayaran pending expired
            <Button type='button' variant="outline" disabled>
              Expire Payment
            </Button>
          }
          {!paymentVal && status_code == '407' &&
            // belum masuk payment & pembayaran pending expired
            <Button type='button' variant="outline" disabled>
              Expire Payment
            </Button>

            // <Button type='button' variant="outline" onClick={handleAddNewPayment}>
            //   Confirm Booking
            // </Button>
          }

        </CardFooter>
      </Card>
    </>
  )
}

export default BookingCard;