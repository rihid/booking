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
import { toast } from 'sonner';

function BookingCard({
  user,
  booking,
  paymentMethod,
  product,
  paymentStatus,
  snapLink,
}: {
  user: any;
  booking: any;
  paymentMethod: any;
  product: any;
  paymentStatus: any;
  snapLink?: any;
}) {
  const router = useRouter()
  const { openModal } = useUiLayoutStore(store => store);
  const { setTripBook } = useTripStore(store => store);
  const { paymentLinks } = usePaymentStore(store => store)
  const { status_code, transaction_status } = paymentStatus;

  const midtransRedirectUrl = process.env.NEXT_PUBLIC_MIDTRANS_REDIRECT_URL as string;

  const [loadingConfirm, setLoadingConfirm] = React.useState<boolean>(false);
  const [statuss, setStatuss] = React.useState<any>(null)

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

    await axios.post(bookingUrl + '/book/payment', body, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + user.token
      }
    }).then(response => {
      console.log(response.data);
      const data = response.data;
      if (data) {
        router.refresh();
        toast.success("Success confirm payment")
        setLoadingConfirm(false)
      }
    }).catch(error => {
      setLoadingConfirm(false)
      console.log(error);
      toast.error("Error confirm payment");
    })
  }

  const voidBooking = React.useCallback(async (id: string) => {
    try {
      await axios.post(bookingUrl + '/book/void', { id: id }, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + user.token
        }
      })
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [user.token])
  React.useEffect(() => {
    // void booking
    if (paymentStatus.status_code === '407' && booking.status !== 'void') {
      voidBooking(paymentStatus.order_id)
    }
  }, [paymentStatus, booking])

  return (
    <>
      <Card className="border-slate-300">
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
              <span className="text-xs font-normal">{product.location}</span>
              <MapPin className="text-brand inline-block w-4 h-4" />
            </div>
          </div>

          <div className="absolute -left-0.5 w-6 h-12 bg-background border-2 border-l-background border-y-slate-300 border-r-slate-300 rounded-tr-full rounded-br-full" />

          <div className="absolute -right-0.5 w-6 h-12 bg-background border-2 border-r-background border-y-slate-300 border-l-slate-300 rounded-tl-full rounded-bl-full" />
          <div className="h-12 bg-transparent" />
          {booking.payment_amount > 0 && transaction_status === "settlement" &&
            <div className="flex items-center justify-center">
              <div className="my-2">
                <QRCodeSVG
                  value={booking.book_no}
                  size={200}
                  level='M'
                />
              </div>
            </div>
          }
          {/* cash */}
          {booking.payment_amount > 0 && status_code === '404' &&
            <div className="flex items-center justify-center">
              <div className="my-2">
                <QRCodeSVG
                  value={booking.book_no}
                  size={200}
                  level='M'
                />
              </div>
            </div>
          }
        </CardContent>
        <CardFooter className="grid grid-cols-1 w-full gap-3">
          {booking.payments.length > 0 && transaction_status === "settlement" &&
            <></>
          }
          {booking.payments.length === 0 && transaction_status === "settlement" &&
            <Button type='button' className="text-xs h-auto bg-brand hover:bg-brand/90" disabled={loadingConfirm} onClick={handlePaymentConfirm}>
              {loadingConfirm &&
                <Loader2 className={cn('h-4 w-4 animate-spin', 'mr-2')} />
              }
              Confirm Payment
            </Button>
          }
          {booking.payments.length > 0 && transaction_status === "pending" &&
            <Button className="text-xs h-auto bg-brand hover:bg-brand/90">
              {snapLink ?
                <Link
                  href={snapLink}
                  target='_blank'
                  className="w-full"
                >
                  Pay Now
                </Link>
                :
                <>Payment Expired</>
              }
            </Button>
          }
          {booking.payments.length === 0 && transaction_status === "pending" &&
            <Button type='button' className="text-xs h-auto bg-brand hover:bg-brand/90">
              <Link
                href={createSnapLink()}
                className="w-full"
              >
                Pay Now
              </Link>
            </Button>
          }
          {transaction_status === "expire" &&
            <Button type='button' variant="outline" disabled className="cursor-not-allowed">
              Payment Expired
            </Button>
          }
          {transaction_status === "cancel" &&
            <Button type='button' variant="outline" disabled>
              Payment Canceled
            </Button>
          }
          {booking.payment_amount === 0 && status_code === '404' &&
            <Button type='button' variant="outline" disabled>
              Cash Payment
            </Button>
          }
        </CardFooter>
      </Card>
    </>
  )
}

export default BookingCard;