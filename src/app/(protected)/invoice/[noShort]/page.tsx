import React from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/container';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button/button';
import Heading from '@/components/ui/heading';
import RatingForm from './module/rating-form';
import { getAllProductPublic, getBooking, getInvoiceByCustomer, getOrganizations } from '@/lib/data';
import { getSession } from '@/lib/session';
import { currency } from '@/lib/helper';
import { Ratings } from '@/components/ui/ratings';
import TopTitle from './module/top-title';
import DownloadInvoiceBtn from './module/download-invoice-btn';

export const metadata: Metadata = {
  title: 'Invoice',
  description: 'Sewa jetski, Rental Jetski, main jetski di semarang'
}

async function InvoiceDetail({
  params,
}: {
  params: { noShort: string };
}) {
  const session = await getSession();
  // @ts-ignore
  const { token, customer_no, org_no } = session.user;
  const invoiceBody = {
    customer_no: customer_no as string,
    type: "invoice",
    begin: null,
    end: null
  }
  
  const organizations = await getOrganizations(token);
  const invoices = await getInvoiceByCustomer(token, invoiceBody);
  const products = await getAllProductPublic();
  const dataInvoices = []
  if (invoices) {
    const organization = organizations.find((o: any) => o.org_no === org_no)
    const array = invoices
    for (let i = 0; i < array.length; i++) {
      const numberArr = array[i].numbers;
      const numbers = []
      for (let n = 0; n < numberArr.length; n++) {
        const productVal = products.find(p => p.product_no === numberArr[i].product_no)
        const obj = {
          id: numberArr[i].id,
          book_no: numberArr[i].book_no,
          type: numberArr[i].type,
          qty: numberArr[i].qty,
          product_no: numberArr[i].product_no,
          product: productVal ? productVal.product_name : null,
          product_sku: numberArr[i].product_sku,
          variant: numberArr[i].variant,
          price: numberArr[i].price,
          subtotal: numberArr[i].subtotal,
          discount: numberArr[i].discount,
          tax: numberArr[i].tax,
          tax_id: numberArr[i].tax_id,
          total: numberArr[i].total,
          is_guided: numberArr[i].is_guided,
          ref_no: numberArr[i].ref_no,
          check: numberArr[i].check,
          uom_id: numberArr[i].uom_id,
          description: numberArr[i].description
        }
        numbers.push(obj)
      }

      const obj = {
        id: array[i].id,
        type: array[i].type,
        type_id: array[i].type_id,
        invoice_no: array[i].invoice_no,
        book_no: array[i].book_no,
        book_date: array[i].book_date,
        customer_no: array[i].customer_no,

        customer_name: array[i].customer.name,
        customer_address: array[i].customer.address,
        customer_phone: array[i].customer.phone,

        schedule_check_in_date: array[i].schedule_check_in_date,
        schedule_check_out_date: array[i].schedule_check_out_date,
        check_in_date: array[i].check_in_date,
        check_out_date: array[i].check_out_date,
        duration: array[i].duration,
        notes: array[i].notes,
        product_no: array[i].product_no,
        bill_no: array[i].bill_no,
        create_by: array[i].create_by,
        status: array[i].status,
        lock: array[i].lock,
        org_no: array[i].org_no,
        branch_no: array[i].branch_no,
        unit_qty: array[i].unit_qty,
        subtotal: array[i].subtotal,
        discount: array[i].discount,
        tax: array[i].tax,
        tax_id: array[i].tax_id,
        total: array[i].total,
        penalty: array[i].penalty,
        payment_dp: array[i].payment_dp,
        payment_amount: array[i].payment_amount,
        payments: array[i].payments,
        units: array[i].units,
        numbers: numbers,
        downPayments: array[i].downPayments,
        riders: array[i].riders,
        payment_balance: 0,
        organization: organization
      }
      dataInvoices.push(obj)
    }
  }
  const dataInvoice = dataInvoices.find(di => di.invoice_no.split('/').pop() === params.noShort)

  const invoice = invoices.find(inv => inv.invoice_no.split('/').pop() === params.noShort);
  const numbers = invoice?.numbers.filter((number: any) => number.qty !== '0');

  let booking = null;
  if (invoice) {
    booking = await getBooking(token, invoice.id);
  }

  const totalPrice = invoice?.numbers.reduce((acc, val) => {
    return acc + parseInt(val.price.replace(/\./g, '')) * parseInt(val.qty);
  }, 0);

  const PriceDetailComp = () => {
    return (
      <Container className="border-t-4 border-slate-100 bg-background py-8 space-y-6">
        <div>
          <h3 className="font-bold text-base text-foreground/75 mb-3">Price Details</h3>
          <dl className="space-y-4">
            {invoice?.numbers.map((number, idx) => {
              const subTotal = number.price.replace(/\./g, '') * number.qty;
              return (
                <React.Fragment key={idx}>
                  {number.qty > 0 &&
                    <div className="flex items-center justify-between gap-x-6 gap-y-4">
                      <dt className="text-sm font-medium text-foreground/50">
                        {currency(parseInt(number.price.replace(/\./g, '')))} x {number.qty} {number.variant} Ride
                      </dt>
                      <dd className="text-foreground/50 text-sm">
                        {currency(subTotal)}
                      </dd>
                    </div>
                  }
                </React.Fragment>
              )
            })}
          </dl>
        </div>
        <hr className="border border-slate-200" />
        <div>
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-x-6 gap-y-4">
              <dt className="text-sm font-semibold text-foreground/75">
                Total
              </dt>
              <dd className="text-foreground/75 font-semibold text-sm">
                {currency(totalPrice)}
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    )
  }

  return (
    <div className="flex flex-col min-h-screen mb-20">
      <TopTitle label='Invoice' />
      <Container>
        {numbers?.map((invNumber: any) => {
          const productVal = products.find(p => p.product_no === invNumber.product_no);
          // const getSingle
          let ratingVal = {
            rating: null,
            rating_notes: null
          }
          if (booking) {
            const numberVal = booking.numbers.find(bn => bn.id === invNumber.id);
            ratingVal = {
              rating: numberVal.rating,
              rating_notes: numberVal.rating_notes,
            }
          }
          return (
            <React.Fragment key={invNumber.id}>
              <div className="flex items-start bg-background py-6 gap-x-6">
                <div className="w-32 flex-shrink-0 overflow-hidden rounded-md">
                  <Link href={"#"}>
                    <div className="aspect-w-6 aspect-h-4 w-full h-full">
                      <Image
                        src={productVal && productVal.pictures.length > 0 ? productVal.pictures[0].url : '/images/sea-doo.svg'}
                        alt="image"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                        priority={true}
                      />
                    </div>
                  </Link>
                </div>
                <div className="flex flex-col space-y-3 flex-grow min-w-0">
                  <div className="min-w-0">
                    <h4 className="text-base font-semibold text-foreground/75 truncate">
                      {productVal?.product_name}
                    </h4>
                    <p className="text-xs text-foreground/50 font-normal mt-1 truncate">{productVal?.product_description}</p>
                  </div>
                  <div className="flex items-center text-foreground/50 gap-x-2">
                    <Star className="w-4 h-4" fill="#F6891F" strokeWidth={0} />
                    <p className="inline-block text-xs font-normal">4.9 (120 reviews)</p>
                  </div>
                </div>
              </div>
              <RatingForm
                invoiceId={invoice?.id as string}
                numberId={invNumber.id}
                user={session?.user}
                ratingVal={ratingVal}
              />
            </React.Fragment>
          )
        })}
      </Container>
      <PriceDetailComp />
      <DownloadInvoiceBtn user={session?.user} invoice={dataInvoice} />
    </div>
  )
}

export default InvoiceDetail;