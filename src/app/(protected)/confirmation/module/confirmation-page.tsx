'use client';

import React from 'react';
import { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { Badge, BadgeCheck, BadgeAlert } from 'lucide-react';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePaymentStore } from '@/providers/store-providers/payment-provider';
import axios from 'axios';
import { bookingUrl } from '@/lib/data/endpoints';
import ActionComp from './action-comp';
import { currency } from '@/lib/helper';

interface PaymentType {
  payment_no: string | null;
  book_no: string | null;
  payment_date: string | null;
  method_id: string | null;
  amount: string | null;
  promo_id: string | null;
  round: string | null;
  discount: string | null;
  total: string | null;
  org_no: string | null;
  branch_no: string | null;
  payment_type: string | null;
  note: string | null;
  token_payment: any;
  cash_id: string | null;
}

function ConfirmationPage({
  user,
  product,
  booking,
  paymentMethod,
  paymentStatus,
  paymentToken,
  payments
}: {
  user: any;
  product: any;
  booking: any;
  paymentMethod: any;
  paymentStatus: any;
  paymentToken: string | string[] | null;
  payments: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { paymentLink } = usePaymentStore((store) => store);
  const [tokenPay, setTokenPay] = React.useState<string | null>(null);

  // methods
  const postPayment = (body: PaymentType) => {
    const paymentVal = payments.find((p: any) => p.book_no === booking.book_no);
    if (!paymentVal) {
      console.log('post')
      const res = axios.post(bookingUrl + '/book/payment', body, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + user.token
        }
      }).then(response => {
        console.log(response.data);
        const data = response.data;
        return data;
      }).catch(error => {
        console.log(error);
        throw error;
      })
      return res;
    } else {
      console.log('put')
      const obj = {
        payment_no: paymentVal.payment_no,
        book_no: body.book_no,
        payment_date: body.payment_date,
        method_id: body.method_id,
        amount: body.amount,
        promo_id: body.promo_id,
        round: body.round,
        discount: body.discount,
        total: body.total,
        org_no: "C0003",
        branch_no: body.branch_no,
        payment_type: body.payment_type,
        note: body.note,
        cash_id: body.cash_id
      }
      const res = axios.put(bookingUrl + '/book/payment/' + paymentVal.id, obj, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + user.token
        }
      }).then(response => {
        console.log(response.data);
        const data = response.data;
        return data;
      }).catch(error => {
        console.log(error);
        throw error;
      })
      return res;
    }
  }
  const handleAddpayment = async () => {
    if (paymentStatus.status_code === '200') {
      let methodVal;
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
        promo_id: paymentDp.promo_id,
        round: paymentDp.round,
        discount: paymentDp.discount,
        total: paymentStatus.gross_amount.replace(/\.00$/, ''),
        org_no: null,
        branch_no: null,
        payment_type: "down_payment",
        note: null,
        token_payment: paymentLink?.payment_token,
        cash_id: null
      }
      console.log('200', body)
      await postPayment(body);
    } else if (paymentStatus.status_code === '201') {
      let methodVal;
      if (paymentStatus.payment_type === 'bank_transfer') {
        const midtransBankVal = paymentStatus.va_numbers[0].bank;
        methodVal = paymentMethod.find((pm: any) => pm.name.toLowerCase() === midtransBankVal);
      }
      const body = {
        payment_no: null,
        book_no: booking.book_no,
        payment_date: paymentStatus.transaction_time,
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
        token_payment: paymentLink?.payment_token,
        cash_id: null
      }
      console.log('201', body)
      await postPayment(body);
    } else if (booking && paymentStatus.status_code === '404') {
      let methodVal = null;
      methodVal = paymentMethod.find((pm: any) => pm.category.toLowerCase() === 'cash');
      const body = {
        payment_no: null,
        book_no: booking.book_no,
        payment_date: booking.book_date,
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
        token_payment: paymentLink?.payment_token,
        cash_id: null
      }
      console.log('400', body)
      postPayment(body);
    }
  }

  React.useEffect(() => {
    if (paymentLink) {
      setTokenPay(paymentLink.payment_token)
      handleAddpayment()
    }
  }, [paymentLink])
  React.useEffect(() => {
    const paymentVal = payments.find((p: any) => p.book_no === booking.book_no)
    console.log(paymentStatus)
  }, [])
  // chunk
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
        <Container className="mt-8">
          <Heading variant='base' className="text-muted-foreground">Order Detail</Heading>
          <div className="font-normal text-sm text-brand">
            <span>Order ID #{booking.book_no_short}</span>
          </div>
          <Card className="mt-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 py-3 px-8">
              <div>
                <Heading variant='xs' className="text-muted-foreground">Trip</Heading>
                <div className="font-bold text-sm text-foreground/50">
                  <span>{product?.product_name}</span>
                </div>
              </div>
              <div>
                <Heading variant='xs' className="text-muted-foreground">Duration</Heading>
                <div className="font-bold text-sm text-foreground/50">
                  <span>{booking.duration}</span>
                </div>
              </div>
              <div>
                <Heading variant='xs' className="text-muted-foreground">Rider</Heading>
                <div className="font-bold text-sm text-foreground/50">
                  <span>1 Rider</span>
                </div>
              </div>
              <div>
                <Heading variant='xs' className="text-muted-foreground">Amout</Heading>
                <div className="font-bold text-sm text-foreground/50">
                  <span>{currency(paymentStatus.gross_amount) || null}</span>
                </div>
              </div>
            </div>
          </Card>
          <ActionComp
            status={paymentStatus}
            booking={booking}
            paymentToken={tokenPay}
          />
        </Container>
      }
      {!booking &&
        <Container className="mt-8">
          <Heading variant='base' className="text-muted-foreground">Order Detail</Heading>
          <div className="font-normal text-sm text-brand">
            <span>Order ID #</span>
          </div>
          <div className="mt-8 flex justify-center items-center">
            <div className="flex flex-col items-center gap-4 w-auto">
              <Button className="w-full bg-brand hover:bg-brand/90">Tract Order</Button>
              <Button className="w-full">Back</Button>
            </div>
          </div>
        </Container>
      }
    </div>
  )
}

export default ConfirmationPage