'use client';

import React from 'react';
import { ChevronLeft, SquarePen, CreditCard, Wallet, Check } from 'lucide-react';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import OpenModalButton from '@/components/ui/button/open-modal-button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import DatesFormModal from './dates-form-modal';
import RiderFormModal from './rider-form-modal';
import { useUiLayoutStore } from '@/store/ui-layout';
import { useBookStore } from '@/providers/store-providers/book-provider';
import RiderDetailFormModal from './rider-detail-form-modal';
import { useRouter } from 'next/navigation';
import ProductSummary from './product-summary';
import moment from 'moment';
import useMidtransSnap from '@/lib/hooks/use-midtrans-snap';


function ConfirmNPayClient() {
  const router = useRouter();
  const { modalView } = useUiLayoutStore();
  const { bookingField, productBooked, updateBookingField, } = useBookStore((state) => state);

  const [isAddRider, setIsAddRider] = React.useState<boolean>(false)


  const totalRiders = bookingField.numbers.reduce((acc, val) => {
    return acc + parseInt(val.qty)
  }, 0)

  const handdleCheckedChange = (checked: boolean) => {
    setIsAddRider(checked)
    console.log('switch val', checked)
  }

  const product = {
    id: productBooked?.id,
    name: productBooked?.product_name,
    price: productBooked?.prices[0].amount,
    quantity: 1
  }
  const { handleCheckout } = useMidtransSnap(product);

  React.useEffect(() => {
    if (productBooked) {
      updateBookingField({
        numbers: bookingField.numbers.map((number, i) => ({
          ...number,
          product_no: productBooked.prices[i]?.product_no || number.product_no,
          product_sku: productBooked.prices[i]?.product_sku || number.product_sku,
          price: productBooked.prices[i]?.amount || number.price,
          subtotal: productBooked.prices[i]?.amount || number.subtotal,
          total: productBooked.prices[i]?.amount || number.total,
          uom_id: productBooked.prices[i]?.uom_id || number.uom_id,
          description: productBooked.product_description || number.description,
        })),
      })
    }
  }, [productBooked, updateBookingField])

  return (
    <div className="flex flex-col min-h-screen mb-20">
      <Container className="py-6 sticky top-0 z-30 bg-background w-full border-b border-foreground-muted flex justify-between items-center shrink-0">
        <button
          type="button"
          onClick={() => router.back()}
        >
          <span>
            <ChevronLeft className="w-5 h-5" />
          </span>
        </button>
        <h3 className="font-bold text-sm text-foreground/75">Confirm & Pay</h3>
        <div></div>
      </Container>
      <ProductSummary product={productBooked} />
      <Container className="border-t-4 border-slate-100 bg-background py-8">
        <h3 className="font-bold text-base text-foreground/75 mb-3">Your Trip</h3>
        <div className="space-y-6">
          <div className="flex items-start justify-between w-full">
            <div className="text-foreground/75">
              <h4 className="font-semibold text-sm">Dates</h4>
              <p className="text-xs font-normal text-foreground/50">{moment(bookingField.book_date).format('MMMM DD YYYY')}</p>
            </div>
            <OpenModalButton variant='link' view='dates-select-view'>Edit</OpenModalButton>
          </div>
          <div className="flex items-start justify-between w-full">
            <div className="text-foreground/75">
              <h4 className="font-semibold text-sm">Riders</h4>
              <p className="text-xs font-normal text-foreground/50">{totalRiders} Riders</p>
            </div>
            <OpenModalButton variant='link' view='rider-select-view'>Edit</OpenModalButton>
          </div>
          <div className="flex flex-wrap items-start justify-between w-full">
            <div className="text-foreground/75 w-full flex-grow">
              <h4 className="font-semibold text-sm">Add Ons</h4>
            </div>
            <ToggleGroup type="multiple" className="mt-3 gap-4">
              <ToggleGroupItem
                value="drone"
                className="text-xs font-normal text-foreground/75 px-5 py-2.5 h-auto border border-transparent rounded-sm data-[state=on]:border data-[state=on]:border-brand data-[state=on]:bg-transparent data-[state=on]:text-accent-foreground hover:border hover:border-brand/90 hover:bg-transparent box-border"
              >
                Drone
              </ToggleGroupItem>
              <ToggleGroupItem
                value="food"
                className="text-xs font-normal text-foreground/75 px-5 py-2.5 h-auto border border-transparent rounded-sm data-[state=on]:border data-[state=on]:border-brand data-[state=on]:bg-transparent data-[state=on]:text-accent-foreground hover:border hover:border-brand/90 hover:bg-transparent box-border"
              >
                Food
              </ToggleGroupItem>
              <ToggleGroupItem
                value="profesional-photos"
                className="text-xs font-normal text-foreground/75 px-5 py-2.5 h-auto border border-transparent rounded-sm data-[state=on]:border data-[state=on]:border-brand data-[state=on]:bg-transparent data-[state=on]:text-accent-foreground hover:border hover:border-brand/90 hover:bg-transparent box-border"
              >
                Profesional Photos
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </Container>
      <Container className="border-t-4 border-slate-100 bg-background py-8">
        <h3 className="font-bold text-base text-foreground/75 mb-3">Riders Details</h3>
        <div className="flex items-center justify-between mb-6">
          <Label htmlFor="add-as-rider" className="text-sm font-normal text-muted-foreground">Add as riders</Label>
          <Switch
            id="add-as-rider"
            checked={isAddRider}
            onCheckedChange={handdleCheckedChange}
          />
        </div>
        <div className="space-y-6">
          {Array.from({ length: totalRiders }).map((_, idx) => {
            return (
              <div className="flex items-start justify-between w-full">
                <div className="text-foreground/75">
                  <h4 className="font-semibold text-sm">Your name here</h4>
                  <p className="text-xs font-normal text-foreground/50">ID Card - 0000</p>
                </div>
                <OpenModalButton
                  view='rider-detail-view'
                  variant='link'
                  className='border-none'
                >
                  <SquarePen className="w-5 h-5" />
                </OpenModalButton>
              </div>
            )
          })}
        </div>
      </Container>
      <Container className="border-t-4 border-slate-100 bg-background py-8 space-y-6">
        <div>
          <h3 className="font-bold text-base text-foreground/75 mb-3">Price Details</h3>
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-x-6 gap-y-4">
              <dt className="text-sm font-medium text-foreground/50">
                Rp 1,100.000 x 1 Single Ride
              </dt>
              <dd className="text-foreground/50 text-sm">
                {/* <p className="text-xs text-foreground/50">You can ride your own Jetsky</p> */}
                Rp 1,200,000
              </dd>
            </div>
            <div className="flex items-center justify-between gap-x-6 gap-y-4">
              <dt className="text-sm font-medium text-foreground/50">
                Rp 1,100.000 x 1 Couple Ride
              </dt>
              <dd className="text-foreground/50 text-sm">
                {/* <p className="text-xs text-foreground/50">You trip guided by our captain</p> */}
                Rp 1,200,000
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 className="font-bold text-base text-foreground/75 mb-3">Add Ons</h3>
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-x-6 gap-y-4">
              <dt className="text-sm font-medium text-foreground/50">
                Rp 1,100.000 x 1 Single Ride
              </dt>
              <dd className="text-foreground/50 text-sm">
                {/* <p className="text-xs text-foreground/50">You can ride your own Jetsky</p> */}
                Rp 1,200,000
              </dd>
            </div>
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
                {/* <p className="text-xs text-foreground/50">You can ride your own Jetsky</p> */}
                Rp 1,200,000
              </dd>
            </div>
          </dl>
        </div>
      </Container>
      <Container className="border-t-4 border-slate-100 bg-background py-8 space-y-6">
        <div>
          <h3 className="font-bold text-base text-foreground/75 mb-3">Pay With</h3>
          <div className="space-y-6">
            <ToggleGroup type="single" className="flex flex-col w-full gap-5">
              <ToggleGroupItem
                value="credit-debit"
                className="w-full justify-start border border-foreground/50 rounded px-4 py-3 text-xs text-start font-normal font-foreground/50"
              >
                <CreditCard className="w-5 h-5 mr-2 inline-block" />
                Credit or Debit Card
              </ToggleGroupItem>
              <ToggleGroupItem
                value="gopay"
                className="w-full justify-start border border-foreground/50 rounded px-4 py-3 text-xs text-start font-normal font-foreground/50"
              >
                <Wallet className="w-5 h-5 mr-2 inline-block" />
                Gopay
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-base text-foreground/75 mb-3">Rules</h3>
          <div className="text-foreground/50 text-xs font-normal ">
            <p>We ask every customer to remember a few simple things
              about what makes a great customer.</p>
            <ul className="mt-1 space-y-1">
              <li>
                <Check className="w-3 h-3 mr-2 inline-block" />
                Customer Ages
              </li>
              <li>
                <Check className="w-3 h-3 mr-2 inline-block" />
                Safety
              </li>
              <li>
                <Check className="w-3 h-3 mr-2 inline-block" />
                Life vest is a must
              </li>
            </ul>
          </div>
        </div>
      </Container>
      <Container className="border-t-4 border-slate-100 bg-background py-8">
        <h3 className="font-bold text-base text-foreground/75 mb-3">Cancellation Pollicy</h3>
        <div className="space-y-6">
          <div className="text-foreground/50 font-normal text-xs">
            <p>This reservation is non-refundable. Learn More
              <button type="button" className="inline-block ml-1 text-brand hover:underline hover:underline-offset-1">learn More</button></p>
          </div>
        </div>
      </Container>
      <Container el="article" className="border-t-4 border-slate-100 bg-background py-8 space-y-6">
        <div className="text-foreground/50 text-xs font-normal space-y-4">
          <p>By selecting the button below, I agree to Seadoo Safari rules.</p>
          <p>I also agree to the updated Terms of Service, Payments Terms
            Of Service, and I acknowledge the Privacy Policy.</p>
        </div>
        <div className="flex items-center justify-center">
          <Button
            type='button'
            onClick={handleCheckout}
            className="bg-brand hover:bg-brand/90"
          >Confirm & pay</Button>
        </div>
      </Container>
      {/* modal */}
      {modalView === 'dates-select-view' && <DatesFormModal dates={bookingField.book_date as string} />}
      {modalView === 'rider-select-view' && <RiderFormModal numbers={bookingField.numbers} />}
      {modalView === 'rider-detail-view' && <RiderDetailFormModal />}

    </div>
  )
}

export default ConfirmNPayClient;