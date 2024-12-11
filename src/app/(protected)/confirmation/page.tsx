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
import { getAllProductPublic, getBooking } from '@/lib/data';
import { midtransServerKey } from '@/lib/constants';
import ActionComp from './module/action-comp';
import ConfirmationPage from './module/confirmation-page';

export const metadata: Metadata = {
  title: 'Confirmation',
  description: 'Sewa jetski, Rental Jetski, main jetski di semarang'
}

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
  token_payment: string | null;
  cash_id: string | null;
}

async function Confirmation({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | null };
}) {
  const session = await getSession();
  // @ts-ignore 
  const { token } = session.user
  const orderId = searchParams['order_id'] || null;
  const paymentToken = searchParams['payment_token'] || null;
  const encodeToken = generateBasicToken(midtransServerKey + ':');
  const midtransUrl = process.env.NEXT_PUBLIC_MIDTRANS_API + '/v2/' + orderId + '/status';
  // actions
  const getPaymentStatus = () => {
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
      // console.log(response.data.data)
      const data = response.data.data;
      return data;
    }).catch(error => {
      console.log(error);
      throw error;
    })

    return res;
  }
  const postPayment = (body: PaymentType) => {
    const res = axios.post(bookingUrl + '/book/payment', body, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
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
  // data
  const products = await getAllProductPublic();
  const booking = await getBooking(token, orderId as string);
  const productVal = products.find(p => p.product_no === booking.product_no);
  const paymentMethod = await getPaymentMethod();
  const paymentStatus = await getPaymentStatus();

  if (paymentStatus.status_code === '200') {
    let methodVal;
    if (paymentStatus.payment_type === 'bank_transfer') {
      const midtransBankVal = paymentStatus.va_numbers[0].bank;
      methodVal = paymentMethod.find((pm: any) => pm.name.toLowerCase() === midtransBankVal);
    }
    const paymentDp = booking.payment_dp;
    const body = {
      id: null,
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
      token_payment: paymentDp.token_payment || null,
      cash_id: null
    }
    await postPayment(body);
  } else if (paymentStatus.status_code === '201') {
    let methodVal;
    if (paymentStatus.payment_type === 'bank_transfer') {
      const midtransBankVal = paymentStatus.va_numbers[0].bank;
      methodVal = paymentMethod.find((pm: any) => pm.name.toLowerCase() === midtransBankVal);
    }
    const body = {
      id: null,
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
      token_payment: paymentToken as string,
      cash_id: null
    }
    // await postPayment(body);
  } else if (booking && paymentStatus.status_code === '404') {
    let methodVal = null;
    methodVal = paymentMethod.find((pm: any) => pm.category.toLowerCase() === 'cash');
    const body = {
      id: null,
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
      token_payment: paymentToken as string,
      cash_id: null
    }
    await postPayment(body);
  }
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
                  <span>{productVal?.product_name}</span>
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
                  <span>{paymentStatus.gross_amount || null}</span>
                </div>
              </div>
            </div>
          </Card>
          <ActionComp
            status={paymentStatus}
            booking={booking}
            paymentToken={paymentToken}
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

async function Confirmation2({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | null };
}) {
  const session = await getSession();
  // @ts-ignore 
  const { token } = session.user
  const orderId = searchParams['order_id'] || null;
  const paymentToken = searchParams['payment_token'] || null;
  const encodeToken = generateBasicToken(process.env.MIDTRANS_SERVER_KEY + ':');
  const midtransUrl = process.env.NEXT_PUBLIC_MIDTRANS_API + '/v2/' + orderId + '/status';
  // actions
  const getPaymentStatus = () => {
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
      console.log(response.data.data)
      const data = response.data.data;
      return data;
    }).catch(error => {
      console.log(error);
      throw error;
    })

    return res;
  }
  const getPaymentList = async () => {
    const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD')
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
  const postPayment = (body: PaymentType) => {
    const res = axios.post(bookingUrl + '/book/payment', body, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
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
  // data
  const products = await getAllProductPublic();
  const booking = await getBooking(token, orderId as string);
  const productVal = products.find(p => p.product_no === booking.product_no);
  const paymentMethod = await getPaymentMethod();
  const paymentStatus = await getPaymentStatus();
  const paymentList = await getPaymentList();

  return (
    <ConfirmationPage
      user={session?.user}
      product={productVal}
      booking={booking}
      paymentMethod={paymentMethod}
      paymentStatus={paymentStatus}
      paymentToken={paymentToken}
      payments={paymentList}
    />
  )
}

export default Confirmation2;