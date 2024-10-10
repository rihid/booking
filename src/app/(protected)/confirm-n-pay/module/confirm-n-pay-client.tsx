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
import { usePathname } from 'next/navigation';
import moment from 'moment';
import ProductSummary from './product-summary';
import useMidtransSnap from '@/lib/hooks/use-midtrans-snap';
import axios from 'axios';
import { bookingUrl, customerUrl, customerUserUrl } from '@/lib/data/endpoints';
import { z } from 'zod';
import { CustomerFieldSchema, BookingFieldSchema } from '@/lib/schema';
import { currency } from '@/lib/helper';
import RiderInfoModal from './rider-info-modal';

function ConfirmNPayClient({
  user,
}: {
  user: any
}) {
  const router = useRouter();
  const { modalView } = useUiLayoutStore();
  const { bookingField, productBooked, customers, updateBookingField, addCustomer, editCustomer, updateCustomerList } = useBookStore((state) => state);

  const [isAddRider, setIsAddRider] = React.useState<boolean>(false);
  const [index, setIndex] = React.useState<number>(0);
  const [customer, setCustomer] = React.useState<z.infer<typeof CustomerFieldSchema>>({
    id: null,
    customer_no: null,
    name: "",
    address: null,
    phone: null,
    email: "",
    identity_number: null,
    vat: null,
    rating: null,
    birthday: null,
    age: null,
    org_no: "",
    type: "individual",
    from: ""
  });

  console.log('user', user)
  const totalRiders = React.useMemo(() => {
    const sum = bookingField.numbers.reduce((acc, val) => {
      const qty = parseInt(val.qty);
      const variant = val.variant.toLowerCase();
      if (variant.includes("couple") || variant.includes("double")) {
        return acc + (qty * 2);
      }
      return acc + qty;
    }, 0);
    return sum;
  }, [bookingField.numbers]);

  const handdleCheckedChange = async (checked: boolean) => {
    const body = {
      customer_no: null,
      name: user.name,
      address: null,
      phone: null,
      email: user.email,
      identity_number: null,
      vat: null,
      rating: null,
      birthday: null,
      age: null,
      org_no: "01",
      type: "individual",
      from: "user"
    }
    let custNo;
    if (checked) {
      // crete customer
      await axios.post(customerUrl, body, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + user.token
        }
      })
        .then(response => {
          const data = response.data.data;
          custNo = data.customer_no;
          console.log('create customer response', data)
          editCustomer(0, {
            ...customers[0],
            ...data,
          })
        })
        .catch(error => {
          console.log(error);
          throw error;
        })
      // crete customer user
      const bodyObj = {
        user_id: user.id,
        customer_no: custNo,
        type: 'main',
      }
      await axios.post(customerUserUrl, bodyObj, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + user.token
        }
      })
        .then(response => {
          console.log('user cust:', response.data.data)
        })
        .catch(error => {
          console.log(error);
          throw error;
        })
    }
    setIsAddRider(checked)
  }

  const handleOpenModal = (idx: number, customer: z.infer<typeof CustomerFieldSchema>) => {
    setIndex(idx);
    setCustomer(customer);
    editCustomer(idx, {
      ...customers[idx],
      ...customer
    })
  }

  const totalPrice = React.useMemo(() => {
    return bookingField.numbers.reduce((acc, val) => {
      return acc + parseInt(val.price.replace(/\./g, '')) * parseInt(val.qty);
    }, 0);
  }, [bookingField.numbers]);

  const product = {
    id: productBooked?.id,
    name: productBooked?.product_name,
    price: totalPrice,
    quantity: 1
  }
  const { handleCheckout } = useMidtransSnap(product);
  const handleClickConfirm = async () => {
    // payment
    const paymentArr = [...bookingField.payments];
    // updateBookingField({
    //   payments: {
    //     payment_date: moment().format('YYYY-MM-DD h:mm:ss'),
    //   }
    // })

    await axios.post(bookingUrl + '/book', bookingField, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + user.token
      }
    })
      .then(response => {
        console.log('data book:', response.data.data)
      })
      .catch(error => {
        console.log(error);
        throw error;
      })
    await handleCheckout();
  }
  React.useEffect(() => {
    if (productBooked) {
      const variants = productBooked.variants;
      const numberArr = variants.map((variant, i) => ({
        id: null,
        book_no: null,
        type: "product",
        qty: i === 0 ? "1" : "0",
        product_no: productBooked.product_no,
        product_sku: variant.product_sku,
        variant: variant.variant_name,
        price: variant.price,
        subtotal: "0",
        discount: "0",
        tax: "0",
        tax_id: null,
        total: "",
        is_guided: false,
        ref_no: null,
        check: false,
        uom_id: "",
        description: productBooked.product_description
      }))
      updateBookingField({
        customer_no: user?.customer_no || null,
        schedule_check_in_date: moment().format('MM-DD-YYYY h:mm:ss'),
        numbers: numberArr,
      });
    }
  }, [])
  React.useEffect(() => {
    if (productBooked) {
      // riders
      let riderArr = [...bookingField.riders];
      const riderCount = bookingField.riders.length
      if (totalRiders > riderCount) {
        for (let i = riderCount; i < totalRiders; i++) {
          riderArr.push({
            book_no: null,
            unit_no: null,
            customer_no: "",
            notes: null,
            book_unit_id: null,
            rating: null,
            rating_notes: null,
          });
        }
      } else if (totalRiders < riderCount) {
        riderArr = riderArr.slice(0, totalRiders);
      }
      updateBookingField({
        riders: riderArr,
      });

      // customer
      let customerArr = [...customers];
      if (totalRiders > customerArr.length) {
        const customerObj = {
          id: null,
          customer_no: null,
          name: "",
          address: null,
          phone: null,
          email: "",
          identity_number: null,
          vat: null,
          rating: null,
          birthday: null,
          age: null,
          org_no: "",
          type: "",
          from: "",
        };

        addCustomer(customerObj);
      }
      else if (totalRiders < customerArr.length) {
        const updatedCustomerArr = customerArr.slice(0, totalRiders);
        updateCustomerList(updatedCustomerArr);
      }

    }
  }, [productBooked, totalRiders, updateBookingField, customers, addCustomer, updateCustomerList])

  const RiderDetailComp = () => {
    return (
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
          {customers.map((customer, idx) => {

            return (
              <React.Fragment key={idx}>
                <div className="flex items-start justify-between w-full">
                  {customer.id !== null ?
                    <div className="text-foreground/75">
                      <h4 className="font-semibold text-sm">{customer.name}</h4>
                      <p className="text-xs font-normal text-foreground/50">ID Card - {customer.identity_number}</p>
                    </div>
                    :
                    <div className="text-foreground/75">
                      <h4 className="font-semibold text-sm">Your name here</h4>
                      <p className="text-xs font-normal text-foreground/50">ID Card - 0000</p>
                    </div>
                  }
                  {customer.id !== null ?
                    <OpenModalButton
                      view='rider-info-view'
                      variant='link'
                      className='border-none'
                      onClick={() => handleOpenModal(idx, customer)}
                    >
                      <SquarePen className="w-5 h-5" />
                    </OpenModalButton>
                    :
                    <OpenModalButton
                      view='rider-detail-view'
                      variant='link'
                      className='border-none'
                      onClick={() => handleOpenModal(idx, customer)}
                    >
                      <SquarePen className="w-5 h-5" />
                    </OpenModalButton>

                  }
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </Container>
    )
  }
  const PriceDetailComp = () => {
    return (
      <Container className="border-t-4 border-slate-100 bg-background py-8 space-y-6">
        <div>
          <h3 className="font-bold text-base text-foreground/75 mb-3">Price Details</h3>
          <dl className="space-y-4">
            {bookingField.numbers.map((number, idx) => {
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
        <div>
          <h3 className="font-bold text-base text-foreground/75 mb-3">Add Ons</h3>
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-x-6 gap-y-4">
              <dt className="text-sm font-medium text-foreground/50">
                Rp 000.000 x 0 Single Ride
              </dt>
              <dd className="text-foreground/50 text-sm">
                Rp 000,000
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
              <p className="text-xs font-normal text-foreground/50">{moment(bookingField.schedule_check_in_date).format('MMMM DD YYYY')}</p>
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
      <RiderDetailComp />
      <PriceDetailComp />
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
            onClick={handleClickConfirm}
            className="bg-brand hover:bg-brand/90"
          >Confirm & pay</Button>
        </div>
      </Container>
      {modalView === 'dates-select-view' && <DatesFormModal dates={bookingField.schedule_check_in_date as string} />}
      {modalView === 'rider-select-view' && <RiderFormModal numbers={bookingField.numbers} />}
      {modalView === 'rider-info-view' && <RiderInfoModal idx={index} customer={customer} />}
      {modalView === 'rider-detail-view' && <RiderDetailFormModal token={user.token} idx={index} customer={customer} />}
    </div>
  )
}

export default ConfirmNPayClient;