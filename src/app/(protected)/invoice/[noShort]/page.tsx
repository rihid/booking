// import React from 'react';
// import { Metadata } from 'next';
// import Container from '@/components/ui/container';
// import Link from 'next/link';
// import Image from 'next/image';
// import { ChevronLeft, Star } from 'lucide-react';
// import RatingForm from './module/rating-form';
// import { getAllProductPublic, getBooking, getInvoiceByCustomer, getOrganizations, getEmployeeByNo } from '@/lib/data';
// import { getSession } from '@/lib/session';
// import { currency } from '@/lib/helper';
// import DownloadInvoiceBtn from './module/download-invoice-btn';
// import CaptainRatingForm from './module/captain-rating-form';

// export const metadata: Metadata = {
//   title: 'Invoice',
//   description: 'Sewa jetski, Rental Jetski, main jetski di Semarang'
// }

// async function InvoiceDetail({
//   params,
// }: {
//   params: { noShort: string };
// }) {
//   const session = await getSession();
//   // @ts-ignore
//   const { token, customer_no, org_no } = session.user;
//   const invoiceBody = {
//     customer_no: customer_no as string,
//     type: "invoice",
//     begin: "2025-02-01",
//     end: null
//   }

//   const organizations = await getOrganizations(token);
//   const invoicesRaw = await getInvoiceByCustomer(token, invoiceBody);
//   const products = await getAllProductPublic();

//   const invoices = []
//   if (invoicesRaw) {
//     const organization = organizations.find((o: any) => o.org_no === org_no)
//     const array = invoicesRaw
//     for (let i = 0; i < array.length; i++) {
//       const numberArr = array[i].numbers;
//       const numbers = []
//       if (numberArr.length > 0) {
//         for (let n = 0; n < numberArr.length; n++) {
//           const productVal = products.find(p => p.product_no === numberArr[n].product_no);
//           const obj = {
//             id: numberArr[n].id,
//             book_no: numberArr[n].book_no,
//             type: numberArr[n].type,
//             qty: numberArr[n].qty,
//             product_no: numberArr[n].product_no,
//             product: productVal ? productVal.product_name : null,
//             product_sku: numberArr[n].product_sku,
//             variant: numberArr[n].variant,
//             price: numberArr[n].price,
//             subtotal: numberArr[n].subtotal,
//             discount: numberArr[n].discount,
//             tax: numberArr[n].tax,
//             tax_id: numberArr[n].tax_id,
//             total: numberArr[n].total,
//             is_guided: numberArr[n].is_guided,
//             ref_no: numberArr[n].ref_no,
//             check: numberArr[n].check,
//             uom_id: numberArr[n].uom_id,
//             description: numberArr[n].description
//           }
//           numbers.push(obj)
//         }
//       }

//       const obj = {
//         id: array[i].id,
//         type: array[i].type,
//         type_id: array[i].type_id,
//         invoice_no: array[i].invoice_no,
//         book_no: array[i].book_no,
//         book_date: array[i].book_date,
//         customer_no: array[i].customer_no,

//         customer_name: array[i].customer.name,
//         customer_address: array[i].customer.address,
//         customer_phone: array[i].customer.phone,

//         schedule_check_in_date: array[i].schedule_check_in_date,
//         schedule_check_out_date: array[i].schedule_check_out_date,
//         check_in_date: array[i].check_in_date,
//         check_out_date: array[i].check_out_date,
//         duration: array[i].duration,
//         notes: array[i].notes,
//         product_no: array[i].product_no,
//         bill_no: array[i].bill_no,
//         create_by: array[i].create_by,
//         status: array[i].status,
//         lock: array[i].lock,
//         org_no: array[i].org_no,
//         branch_no: array[i].branch_no,
//         unit_qty: array[i].unit_qty,
//         subtotal: array[i].subtotal,
//         discount: array[i].discount,
//         tax: array[i].tax,
//         tax_id: array[i].tax_id,
//         total: array[i].total,
//         penalty: array[i].penalty,
//         payment_dp: array[i].payment_dp,
//         payment_amount: array[i].payment_amount,
//         payments: array[i].payments,
//         units: array[i].units,
//         numbers: numbers,
//         downPayments: array[i].downPayments,
//         riders: array[i].riders,
//         payment_balance: 0,
//         organization: organization
//       }
//       invoices.push(obj)
//     }
//   }

//   const invoice = invoices.find(inv => inv.invoice_no.split('/').pop() === params.noShort);
//   const numbers = invoice?.numbers.filter((number: any) => number.qty !== '0') || [];
//   const productNumbers = numbers.filter((pn: any) => pn.type === 'product') || [];
//   const addonNumbers = numbers.filter((pn: any) => pn.type !== 'product') || [];
//   const unitCrew = invoice?.units.filter(unit => unit.crews.length > 0);

//   let booking = null;
//   if (invoice) {
//     booking = await getBooking(token, invoice.id);
//   }

//   const crews = [];
//   if (unitCrew && unitCrew.length > 0) {
//     for (let i = 0; i < unitCrew.length; i++) {
//       const crewArr = unitCrew[i].crews;
//       if (crewArr && crewArr.length > 0) {
//         for (let j = 0; j < crewArr.length; j++) {

//           crews.push({
//             id: crewArr[j].id,
//             book_no: crewArr[j].book_no,
//             unit_no: crewArr[j].unit_no,
//             employee_no: crewArr[j].employee_no,
//             notes: crewArr[j].notes,
//             book_unit_id: crewArr[j].book_unit_id,
//             rating: crewArr[j].rating,
//             // rating: null,
//             rating_notes: crewArr[j].rating_notes
//           });
//         }
//       }
//     }
//   }

//   const totalPrice = invoice?.numbers.reduce((acc, val) => {
//     return acc + parseInt(val.price.replace(/\./g, '')) * parseInt(val.qty);
//   }, 0);

//   const PriceDetailComp = () => {
//     return (
//       <Container className="border-t-4 border-slate-100 bg-background py-8 space-y-6">
//         <div>
//           <h3 className="font-bold text-base text-foreground/75 mb-3">Price Details</h3>
//           <dl className="space-y-4">
//             {productNumbers.map((number, idx) => {
//               const subTotal = number.price.replace(/\./g, '') * number.qty;
//               return (
//                 <React.Fragment key={idx}>
//                   {number.qty > 0 &&
//                     <div className="flex items-center justify-between gap-x-6 gap-y-4">
//                       <dt className="text-sm font-medium text-foreground/50">
//                         {currency(parseInt(number.price.replace(/\./g, '')))} x {number.qty} {number.variant} Ride
//                       </dt>
//                       <dd className="text-foreground/50 text-sm">
//                         {currency(subTotal)}
//                       </dd>
//                     </div>
//                   }
//                 </React.Fragment>
//               )
//             })}
//           </dl>
//         </div>
//         {addonNumbers.length > 0 &&
//           <div>
//             <h3 className="font-bold text-base text-foreground/75 mb-3">Add Ons</h3>
//             <dl className="space-y-4">
//               {addonNumbers.map((addon, idx) => {
//                 const subTotal = addon.price.replace(/\./g, '') * addon.qty;
//                 return (
//                   <React.Fragment key={idx}>
//                     {addon.qty > 0 &&
//                       <div className="flex items-center justify-between gap-x-6 gap-y-4">
//                         <dt className="text-sm font-medium text-foreground/50">
//                           {addon.product}
//                         </dt>
//                         <dd className="text-foreground/50 text-sm">
//                           {currency(subTotal)}
//                         </dd>
//                       </div>
//                     }
//                   </React.Fragment>
//                 )
//               })}
//             </dl>
//           </div>
//         }
//         <hr className="border border-slate-200" />
//         <div>
//           <dl className="space-y-4">
//             <div className="flex items-center justify-between gap-x-6 gap-y-4">
//               <dt className="text-sm font-semibold text-foreground/75">
//                 Total
//               </dt>
//               <dd className="text-foreground/75 font-semibold text-sm">
//                 {currency(totalPrice || 0)}
//               </dd>
//             </div>
//           </dl>
//         </div>
//       </Container>
//     )
//   }

//   if (!invoice) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen">
//         <div className="grid gap-2 px-12 text-center">
//           <Image
//             src="/images/404-2.svg"
//             width={320}
//             height={320}
//             alt="404 Illustration"
//           />
//         </div>

//         <div className="grid gap-6 text-center">
//           <div className="grid gap-2">
//             <h3>Page not Found</h3>
//             <p>It&apos;s Okay!</p>
//           </div>

//           <div>
//             <Link href="/explore" className="hover:underline underline-offset-2">
//               Let&apos;s Go Back
//             </Link>
//           </div>
//         </div>
//       </div>
//     )
//   }
//   return (
//     <>
//       <Container>
//         {productNumbers?.map((invNumber: any) => {
//           const productVal = products.find(p => p.product_no === invNumber.product_no);
//           const variantVal = productVal?.variants ? productVal.variants.find((pv: any) => pv.product_sku === invNumber.product_sku) : null;
//           // const getSingle
//           let ratingVal = {
//             rating: null,
//             rating_notes: null
//           }
//           if (booking) {
//             const numberVal = booking.numbers.find(bn => bn.id === invNumber.id);
//             ratingVal = {
//               rating: numberVal.rating,
//               rating_notes: numberVal.rating_notes,
//             }
//           }
//           return (
//             <React.Fragment key={invNumber.id}>
//               <div className="flex items-start bg-background py-6 gap-x-6">
//                 <div className="w-32 flex-shrink-0 overflow-hidden rounded-md">
//                   <Link href={"#"}>
//                     <div className="aspect-w-6 aspect-h-4 w-full h-full">
//                       <Image
//                         src={productVal && productVal.pictures.length > 0 ? productVal.pictures[0].url : '/images/sea-doo.svg'}
//                         alt="image"
//                         width={0}
//                         height={0}
//                         sizes="100vw"
//                         className="object-cover transition-all duration-300 group-hover:scale-105"
//                         priority={true}
//                       />
//                     </div>
//                   </Link>
//                 </div>
//                 <div className="flex flex-col space-y-3 flex-grow min-w-0">
//                   <div className="min-w-0">
//                     <h4 className="text-base font-semibold text-foreground/75 truncate">
//                       {productVal?.product_name}
//                     </h4>
//                     {variantVal && <span className="text-xs font-normal capitalize">{variantVal?.variant_name}</span>}
//                     <p className="text-xs text-foreground/50 font-normal mt-1 truncate">{productVal?.product_description}</p>
//                   </div>
//                   <div className="flex items-center text-foreground/50 gap-x-2">
//                     <Star className="w-4 h-4" fill="#F6891F" strokeWidth={0} />
//                     <p className="inline-block text-xs font-normal">{productVal?.rating ? productVal?.rating : '0.0'}</p>
//                   </div>
//                 </div>
//               </div>
//               <RatingForm
//                 invoiceId={invoice?.id as string}
//                 numberId={invNumber.id}
//                 user={session?.user}
//                 ratingVal={ratingVal}
//               />
//             </React.Fragment>
//           )
//         })}
//       </Container>
//       <Container className="border-t-4 border-slate-100 bg-background py-4">
//         <h3 className="font-bold text-base text-foreground/75 mb-3 text-center">Crews</h3>
//         <div className="divide-y-2 divide-slate-200">
//           {crews.map((crew, i) => {
//             return (
//               <React.Fragment key={i}>
//                 <CaptainRatingForm
//                   user={session?.user}
//                   crew={crew}
//                 />
//               </React.Fragment>
//             )
//           })}
//         </div>
//       </Container>
//       <PriceDetailComp />
//       <DownloadInvoiceBtn user={session?.user} invoice={invoice} />
//     </>
//   )
// }

// export default InvoiceDetail;

import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getSession } from '@/lib/session';
import InvoicePageContent from './module/page-content';
import { InvoiceLoader } from '@/components/partial/loader';

export const metadata: Metadata = {
  title: 'Invoice',
  description: 'Sewa jetski, Rental Jetski, main jetski di Semarang'
}

async function InvoiceDetail({
  params,
}: {
  params: { noShort: string };
}) {
  const session = await getSession();
  return (
    <Suspense fallback={<InvoiceLoader />}>
      <InvoicePageContent user={session?.user} noShort={params.noShort} />
    </Suspense>
  )
}

export default InvoiceDetail;