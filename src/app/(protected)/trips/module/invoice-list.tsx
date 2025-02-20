import React from 'react';
import Container from '@/components/ui/container';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import { ProductSchema } from '@/lib/schema';
import { z } from 'zod';
import { getBranchList, getInvoiceByCustomer } from '@/lib/data';
import { msToTime } from '@/lib/helper';
import moment from 'moment';

async function InvoiceList({
  user,
  products,
}: {
  user: any;
  products: z.infer<typeof ProductSchema>[];
}) {

  const invoiceBody = {
    customer_no: user.customer_no as string,
    type: "invoice",
    begin: "2025-02-01",
    end: null
  }

  const invoiceData = await getInvoiceByCustomer(user?.token, invoiceBody);
  const branches = await getBranchList(user?.token);
  const formatDuration = (duration: any) => {
    const hours = Math.floor((duration % 86400000) / 3600000)
    const minutes = Math.round(((duration % 86400000) % 3600000) / 60000)
    const seconds = Math.round((duration % 60000) / 1000)
    return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
  }
  console.log(invoiceData)
  return (
    <Container className="space-y-6">
      {invoiceData.length > 0 ?
        invoiceData.map((invoice) => {
          const productVal = products.find(p => p.product_no === invoice.product_no)
          const branchVal = branches.find(p => p.branch_no === invoice?.branch_no)
          const durationTrip = msToTime(parseFloat(invoice.duration as string))
          return (
            <Link
              key={invoice.id}
              href={`/invoice/${invoice.invoice_no === null ? "#" : invoice.invoice_no.split('/').pop()}`}
              className="block"
            >
              <Card className="border-slate-200">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-foreground/75">{productVal?.product_name}</CardTitle>
                  <div className="flex items-center text-foreground/50 gap-x-2 !mt-0">
                    <Star className="w-4 h-4" fill="#F6891F" strokeWidth={0} />
                    <p className="inline-block text-xs font-normal">4.9 (120 reviews)</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="text-foreground/50">
                      <span className="text-sm font-bold text-slate-600"># {invoice.book_no === null ? null : invoice.book_no.split('/').pop()}</span>
                      <p className='text-sm font-medium text-slate-400'>{moment(invoice.book_date).format('DD MMM YYYY')}</p>
                    </div>
                    <div className="flex items-center text-foreground/50 gap-x-2">
                      <span className="text-xs font-normal">{durationTrip}</span>
                      <Clock className="text-brand inline-block w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-foreground/50">
                      <span className="text-sm  uppercase text-green-500 font-normal">{invoice.status}</span>
                    </div>
                    <div className="flex items-center text-foreground/50 gap-x-2">
                      <span className="text-xs font-normal">{branchVal?.name}</span>
                      <MapPin className="text-brand inline-block w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
                {/* <CardFooter className="grid grid-cols-2 w-full gap-3">
                  <Button variant="secondary" className="text-xs h-auto">Re-Book</Button>
                  <OpenModalButton
                    view='review-view'
                    variant='default'
                  >
                    Write Reviews
                  </OpenModalButton>
                </CardFooter> */}
              </Card>
            </Link>
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

export default InvoiceList