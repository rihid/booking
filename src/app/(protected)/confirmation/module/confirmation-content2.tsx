'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import { usePaymentStore } from '@/providers/store-providers/payment-provider';
import axios from 'axios';
import { authUrl, bookingUrl, masterUrl } from '@/lib/data/endpoints';
import ActionComp from './action-comp';
import { currency } from '@/lib/helper';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { toast } from 'sonner';
import { useBookStore } from '@/providers/store-providers/book-provider';
import { useBranchStore } from '@/providers/store-providers/branch-provider';
import { useEmployeeStore } from '@/providers/store-providers/employee-provider';

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
  settlement_id?: string | null;
  payment_type: string | null;
  note: string | null;
  token_payment: any;
  cash_id: string | null;
}

function ConfirmationContent({
  user,
  product,
  booking,
  paymentMethod,
  paymentStatus,
  payments,
}: {
  user: any;
  product: any;
  booking: any;
  paymentMethod: any;
  paymentStatus: any;
  payments: any;
}) {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const [tokenPay, setTokenPay] = React.useState<string | null>(null);
  const [processPayment, setProcessPayment] = React.useState<boolean>(false);
  const [variants, setVariants] = React.useState<any>([]);

  const { paymentLinks } = usePaymentStore((store) => store);
  const { productBooked } = useBookStore((store) => store)
  // const { branchList, getBranchList } = useBranchStore(store => store);
  // const { employeehList, getEmployeeList } = useEmployeeStore(store => store);

  const hasPostedRef = React.useRef(false);
  // methods
  const getBranchList = async () => {
    try {
      const response = await axios.get(authUrl + '/branch', {
        headers: { Accept: 'application/json', Authorization: 'Bearer ' + user.token },
        timeout: 50000
      });
      return response.data.data
    } catch (error: any) {
      console.log(error)
      return []
    }
  }
  const getEmployeeList = async () => {
    try {
      const response = await axios.get(bookingUrl + '/employee', {
        headers: { Accept: 'application/json', Authorization: 'Bearer ' + user.token },
        timeout: 50000
      });
      return response.data.data;
    } catch (error: any) {
      console.log(error)
      return []
    }
  }
  const getProductVarinatList = async () => {
    if (variants && variants.length > 0) {
      return variants;
    }
    if (productBooked?.variants && productBooked.variants.length > 0) {
      setVariants(productBooked.variants);
      return productBooked.variants;
    }
  }

  const findTokenSnap = () => {
    const formatBookNo = booking.book_no.replace(/\//g, '_')
    const plValue = paymentLinks.find((pl: any) => pl.order_id === formatBookNo)
    if (plValue) {
      return plValue.payment_token
    } else {
      return null
    }
  }
  const postPayment = (body: PaymentType) => {
    const paymentVal = payments.find((p: any) => p.book_no === booking.book_no);
    if (!paymentVal) {
      console.log('post')
      console.log(body)
      const res = axios.post(bookingUrl + '/book/payment', body, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + user.token
        }
      }).then(response => {
        console.log(response.data);
        const data = response.data;
        sendNotif()
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
        org_no: user.org_no,
        branch_no: body.branch_no,
        settlement_id: body.settlement_id,
        payment_type: body.payment_type,
        note: body.note,
        cash_id: body.cash_id
      }
      console.log(obj)
      const res = axios.put(bookingUrl + '/book/payment/' + paymentVal.id, obj, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + user.token
        }
      }).then(response => {
        console.log(response.data);
        const data = response.data;
        // sendNotif()
        return data;
      }).catch(error => {
        console.log(error);
        throw error;
      })
      return res;
    }
  }
  const sendNotif = async () => {
    const varinats = variants.length > 0 ? variants : await getProductVarinatList()
    console.log(varinats)
    const branchList = await getBranchList();
    const employeehList = await getEmployeeList();
    // numbers
    const numbers: any[] = []
    const arrNumber = booking?.numbers
    for (let i = 0; i < arrNumber.length; i++) {
      console.log(i, '=', varinats)
      const productNumber = varinats.find((d: any) => d.product_sku === arrNumber[i].product_sku)
      numbers.push({
        id: arrNumber[i].id,
        book_no: arrNumber[i].book_no,
        type: arrNumber[i].type,
        qty: arrNumber[i].qty,
        product_no: arrNumber[i].product_no,
        product_sku: arrNumber[i].product_sku,
        product: product ? product?.product_name : null,
        variant: productNumber ? productNumber.variant_name : null,
        price: arrNumber[i].price,
        subtotal: arrNumber[i].subtotal,
        discount: arrNumber[i].discount,
        tax: arrNumber[i].tax,
        tax_id: arrNumber[i].tax_id,
        total: arrNumber[i].total,
        is_guided: arrNumber[i].is_guided,
        ref_no: arrNumber[i].ref_no,
        check: arrNumber[i].check,
        uom_id: arrNumber[i].uom_id,
        description: arrNumber[i].description
      })
    }
    const branch = branchList?.find((d: any) => d.branch_no === booking.branch_no)
    if (!branch) {
      toast.error('Branch not selected!')
    }
    const pic = employeehList?.find((d: any) => d.employee_no === branch?.pic)
    const body = {
      template: 'booking-create',
      data: booking,
      numbers: numbers,
      pic_number: pic?.phone,
      org_number: user.org.phone
    }
    const body2 = {
      template: 'booking-received',
      data: booking,
      numbers: numbers,
      pic_number: pic?.phone,
      org_number: user.org.phone
    }
    console.log(body)
    await axios.post(masterUrl + '/notification', body, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + user.token
      }
    })
      .then((response) => {
        const bookId = response.data.data.id
        console.log(bookId)
        axios.post(masterUrl + '/notification/send', { id: bookId }, {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + user.token
          }
        })
          .then(response => {
            // toast.success(response.data.message)
            toast.success('Booking notification sent')
          })
          .catch(error => {
            console.log(error)
            console.log(error.message)
            toast.error(error.message)
          })
      })
      .catch(error => {
        console.log(error)
        console.log(error.message)
        toast.error(error.message)
      })
    console.log(body2)
    await axios.post(masterUrl + '/notification', body2, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + user.token
      }
    })
      .then((response) => {
        const bookId = response.data.data.id
        console.log(bookId)
        axios.post(masterUrl + '/notification/send', { id: bookId }, {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + user.token
          }
        })
          .then(response => {
            // toast.success(response.data.message)
          })
          .catch(error => {
            console.log(error)
            console.log(error.message)
            toast.error(error.message)
          })
      })
      .catch(error => {
        console.log(error)
        console.log(error.message)
        toast.error(error.message)
      })
  }
  const handleAddpayment = async () => {
    if (hasPostedRef.current && paymentStatus.status_code !== '201') return;
    setProcessPayment(true);
    try {
      hasPostedRef.current = true;
      if (paymentStatus.status_code === '200') {
        let methodVal;
        if (paymentStatus.payment_type === 'bank_transfer') {
          const midtransBankVal = paymentStatus.va_numbers[0].bank;
          methodVal = paymentMethod.find((pm: any) => pm.name.toLowerCase() === midtransBankVal);
        } else if (paymentStatus.payment_type === 'qris') {
          methodVal = paymentMethod.find((pm: any) => pm.name.toLowerCase() === 'qris');
        }
        const payment = booking.payment_dp;
        const body = {
          payment_no: null,
          book_no: booking.book_no,
          payment_date: paymentStatus.settlement_time,
          method_id: methodVal ? methodVal.id : null,
          amount: paymentStatus.gross_amount.replace(/\.00$/, ''),
          promo_id: payment ? payment.promo_id : null,
          round: payment ? payment.round : null,
          discount: payment ? payment.discount : null,
          total: paymentStatus.gross_amount.replace(/\.00$/, ''),
          org_no: null,
          branch_no: null,
          payment_type: "down_payment",
          note: null,
          settlement_id: paymentStatus.transaction_id,
          token_payment: findTokenSnap(),
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
          settlement_id: paymentStatus.transaction_id,
          payment_type: "down_payment",
          note: null,
          token_payment: findTokenSnap(),
          cash_id: null
        }
        console.log('201', body)
        await postPayment(body);
      } else if (booking && paymentStatus.status_code === '404') {
        // if (hasPostedRef.current) return;
        // hasPostedRef.current = true;
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
          settlement_id: null,
          payment_type: "down_payment",
          note: null,
          token_payment: null,
          cash_id: null
        }
        console.log('404', body)
        await postPayment(body);
      }
    } catch (error) {
      hasPostedRef.current = false;
    } finally {
      setProcessPayment(false);
    }
  }

  React.useEffect(() => {
    const shouldProcessPayment =
      !processPayment &&
      !hasPostedRef.current &&
      paymentLinks.length > 0 &&
      booking?.book_no &&
      paymentStatus?.status_code;

    if (shouldProcessPayment) {
      setTokenPay(findTokenSnap());
      handleAddpayment();
    }
  }, [paymentLinks, booking?.book_no, paymentStatus?.status_code, processPayment]);
 React.useEffect(() => {
    getProductVarinatList();
  }, [productBooked])

  return (
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
              <span>{booking.riders.length} {booking.riders.length > 1 ? 'Riders' : 'Rider'}</span>
            </div>
          </div>
          <div>
            <Heading variant='xs' className="text-muted-foreground">Amout</Heading>
            {(paymentStatus.status_code === '404') ?
              <div className="font-bold text-sm text-foreground/50">
                <span>{currency(booking.total) || null}</span>
              </div> :
              <div className="font-bold text-sm text-foreground/50">
                <span>{currency(paymentStatus.gross_amount) || null}</span>
              </div>
            }
          </div>
        </div>
      </Card>
      <div className="mt-8 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4 w-auto">
          {paymentStatus.status_code === '201' &&
            <Link
              href={`${process.env.NEXT_PUBLIC_MIDTRANS_REDIRECT_URL}/${tokenPay}` || '#'}
              target='_blank'
            >
              <Button className="w-full bg-brand hover:bg-brand/90">Pay Now</Button>
            </Link>
          }
          <Link
            href="/explore"
          >
            <Button className="w-full">Back to home</Button>
          </Link>
        </div>
      </div>
      {/* <pre>{JSON.stringify(branchList, null, 2)}</pre>
      <hr />
      <pre>{JSON.stringify(employeehList, null, 2)}</pre> */}
    </Container>
  )
}

export default ConfirmationContent;