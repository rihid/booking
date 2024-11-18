'use client';

import React from 'react';
import { ChevronLeft, SquarePen, CreditCard, Wallet, Check, Loader2 } from 'lucide-react';
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
import { cn } from '@/assets/styles/utils';
import { getPaymentMethod, getPaymentStatus } from '@/lib/data';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { midtransClientKey } from '@/lib/constants';

function ConfirmNPayClient({
  user,
  userCustomer,
}: {
  user: any;
  userCustomer: any;
}) {
  const router = useRouter();
  const { modalView } = useUiLayoutStore();
  const { bookingField, productBooked, customers, customer, setCustomer, updateBookingField, addCustomer, editCustomer, updateCustomerList, setPaymentLink } = useBookStore((state) => state);
  // local state
  const [isAddRider, setIsAddRider] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [index, setIndex] = React.useState<number>(0);
  // const [customer, setCustomer] = React.useState<z.infer<typeof CustomerFieldSchema>>({
  //   id: null,
  //   customer_no: null,
  //   name: "",
  //   address: null,
  //   phone: null,
  //   email: "",
  //   identity_number: null,
  //   vat: null,
  //   rating: null,
  //   birthday: null,
  //   age: null,
  //   org_no: "",
  //   type: "individual",
  //   from: "",
  //   rider_type: ""
  // });

  // form
  const { control, register, handleSubmit, formState: { errors } } = useForm();
  const [data, setData] = React.useState<any>(null);
  // calculation
  const totalRiders = React.useMemo(() => {
    const bn = bookingField.numbers;
    console.log('bn', bn)
    const sum = bn.reduce((acc, val) => {
      const qty = parseInt(val.qty);
      const totalRider = parseInt(val.total_rider)
      const variant = val.variant.toLowerCase();
      if (variant.includes("couple") || variant.includes("double")) {
        return acc + (qty * 2);
      }
      return acc + (qty * totalRider);
    }, 0);
    return sum;
  }, [bookingField.numbers]);
  const totalPrice = React.useMemo(() => {
    return bookingField.numbers.reduce((acc, val) => {
      return acc + parseInt(val.price.replace(/\./g, '')) * parseInt(val.qty);
    }, 0);
  }, [bookingField.numbers]);
  // functions
  const handdleCheckedChange = async (checked: boolean) => {
    if (checked) {
      const crm = user.customer;
      const data = {
        id: crm.id,
        customer_no: crm.customer_no,
        name: crm.name,
        address: crm.address,
        phone: crm.phone,
        email: crm.email,
        identity_number: crm.identity_number,
        vat: crm.vat,
        rating: crm.rating,
        birthday: crm.birthday,
        age: crm.age,
        org_no: crm.org_no,
        type: crm.type,
        from: crm.from,
        rider_type: 'rider'
      }
      console.log(data)
      editCustomer(0, {
        ...customers[0],
        ...data
      })
      console.log(customers[0])
    } else {
      const initialData = {
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
        rider_type: ""
      }
      editCustomer(0, {
        ...customers[0],
        ...initialData,
      })
      console.log(customers[0])
    }
    setIsAddRider(checked);
  }
  const handleOpenRiderModal = async (idx: number, customer: z.infer<typeof CustomerFieldSchema>) => {
    console.log('customer in open rider modal')
    console.log(customer)
    setIndex(idx);
    setCustomer(customer);
    editCustomer(idx, {
      ...customers[idx],
      ...customer
    })
  }

  // midtrans options function
  const closePayment = (bookId: string) => {
    axios.delete(bookingUrl + '/book/' + bookId, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + user.token
      }
    }).then(response => {
      console.log(response.data)
    }).catch(error => {
      console.log(error);
      throw error;
    })
    console.log('customer closed the popup without finishing the payment');
  }

  const handleCheckout = async (body: any) => {
    try {
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const res = await response.json();

      // @ts-ignore
      window.snap.pay(res.data.token, {
        onPending: (result: any) => {
          console.log('result', result);
          router.push(`/confirmation?order_id=${body.orderId}&status_code=${result.status_code}&payment_token=${res.data.token}`)
        },
        onClose: () => { closePayment(body.orderId) },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  const onSubmitConfirm = async () => {
    let bodyMidtrans = {
      orderId: bookingField.book_no,
      itemId: productBooked?.id,
      productName: productBooked?.product_name,
      price: totalPrice,
      quantity: 1,
      customer: user.name,
      customerEmail: user.email
    }
    setIsLoading(true);
    await axios.post(bookingUrl + '/book', bookingField, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + user.token
      }
    }).then(response => {
      console.log('data book:', response.data.data);
      const data = response.data.data;
      bodyMidtrans.orderId = data.id;
    }).catch(error => {
      // setIsLoading(false);
      console.log(error);
      throw error;
    })
    // midtrans
    await handleCheckout(bodyMidtrans);
    setIsLoading(false);
  }
  // onmount
  React.useEffect(() => {
    if (productBooked) {
      console.log("productBooked:")
      console.log(productBooked)
      const variants = productBooked.variants;
      const numberArr = variants.map((variant, i) => ({
        id: null,
        book_no: null,
        type: "product",
        qty: i === 0 ? "1" : "0",
        product_no: productBooked.product_no,
        product_sku: variant.product_sku,
        variant: variant.variant_name,
        price: variant.price ? variant.price.replace(/\./g, '') : null,
        subtotal: "0",
        discount: "0",
        tax: "0",
        tax_id: null,
        total: "",
        is_guided: false,
        ref_no: null,
        check: false,
        uom_id: "",
        description: productBooked.product_description,
        total_rider: variant.total_rider || 1,
      }))
      console.log(numberArr)
      updateBookingField({
        customer_no: user?.customer_no,
        schedule_check_in_date: '',
        product_no: productBooked.product_no,
        org_no: user.org_no,
        branch_no: productBooked.branch_no,
        subtotal: '0',
        tax: '0',
        discount: '0',
        tax_id: null,
        total: totalPrice.toString(),
        numbers: numberArr,
      });
      console.log('bookingFIeld:')
      console.log(bookingField)
    }

    // snap script midtrans here
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''

    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl

    scriptTag.setAttribute("data-client-key", clientKey)
    scriptTag.async = true

    document.body.appendChild(scriptTag)
    return () => {
      document.body.removeChild(scriptTag)
    }
  }, []);
  // onupdate
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
            type: "rider"
          });
        }
      } else if (totalRiders < riderCount) {
        riderArr = riderArr.slice(0, totalRiders);
      }

      // update riders
      riderArr = riderArr.map((rider, i) => ({
        ...rider,
        customer_no: customers[i]?.customer_no || rider.customer_no,
      }));

      updateBookingField({
        riders: riderArr,
        branch_no: productBooked.branch_no,
        subtotal: totalPrice.toString(),
        tax: '0',
        discount: '0',
        tax_id: null,
        total: totalPrice.toString(),
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
          rider_type: ""
        };

        addCustomer(customerObj);
      } else if (totalRiders < customerArr.length) {
        const updatedCustomerArr = customerArr.slice(0, totalRiders);
        updateCustomerList(updatedCustomerArr);
      }
      // isAddrider
    if (customers[0].id !== null) {
      setIsAddRider(true)
    }
    }
  }, [productBooked, totalRiders, updateBookingField, customers, addCustomer, updateCustomerList, isAddRider]);

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
      <form
        action=""
        onSubmit={handleSubmit(onSubmitConfirm)}
      >
        <Container className="border-t-4 border-slate-100 bg-background py-8">
          <h3 className="font-bold text-base text-foreground/75 mb-3">Your Trip</h3>
          <div className="space-y-6">
            <div className="flex items-start justify-between w-full">
              <div className="text-foreground/75">
                <h4 className="font-semibold text-sm">Dates</h4>
                <p className="text-xs font-normal text-foreground/50">{bookingField.schedule_check_in_date == '' ? 'Select date' : moment(bookingField.schedule_check_in_date).format('DD MMM YYYY H:mm')}</p>
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
            {/* <div className="flex flex-wrap items-start justify-between w-full">
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
            </div> */}
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
            {customers.map((customer, idx) => {
              const inputName = 'rider' + idx;
              return (
                <React.Fragment key={idx}>
                  <div className="flex items-start justify-between w-full">
                    {customer.id !== null ?
                      <div className="text-foreground/75">
                        <h4 className="font-semibold text-sm">{customer.name}</h4>
                        <p className="text-xs font-normal text-foreground/50">ID Card - {customer.identity_number}</p>
                        <p className="text-xs font-normal text-foreground/50">{customer.rider_type}</p>
                        <pre>{ }</pre>
                      </div>
                      :
                      <div className="text-foreground/75">
                        <h4 className="font-semibold text-sm">Your name here</h4>
                        <p className="text-xs font-normal text-foreground/50">ID Card - 0000</p>
                        <p className="text-xs font-normal text-foreground/50"></p>
                        <input
                          type="text"
                          id={inputName}
                          value={customer.id}
                          aria-invalid={errors.inputName ? "true" : "false"}
                          {...register(inputName, { required: true })}
                          className="hidden"
                        />
                        {errors[inputName] && errors[inputName].type === "required" && (
                          <span role="alert" className="text-xs font-normal text-destructive">Riders details cannot be empty</span>
                        )}
                      </div>
                    }
                    <OpenModalButton
                      view='rider-info-view'
                      variant='link'
                      className='border-none'
                      onClickChange={() => handleOpenRiderModal(idx, customer)}
                    >
                      <SquarePen className="w-5 h-5" />
                    </OpenModalButton>
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        </Container>
        <PriceDetailComp />
        <Container className="border-t-4 border-slate-100 bg-background py-8 space-y-6">
          <div>
            <h3 className="font-bold text-base text-foreground/75 mb-3">Pay With</h3>
            <div className="space-y-6">
              <Controller
                name='payment_select'
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <ToggleGroup
                      id="payment_select"
                      type="single"
                      className="flex flex-col w-full gap-5"
                      value={field.value || null}
                      onValueChange={field.onChange}
                      aria-invalid={errors.payment_select ? "true" : "false"}
                    >
                      <ToggleGroupItem
                        value="credit-debit"
                        className="w-full justify-start border border-foreground/50 rounded px-4 py-3 text-xs text-start font-normal font-foreground/50"
                      >
                        <CreditCard className="w-5 h-5 mr-2 inline-block" />
                        Cashless
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="cash"
                        className="w-full justify-start border border-foreground/50 rounded px-4 py-3 text-xs text-start font-normal font-foreground/50"
                      >
                        <Wallet className="w-5 h-5 mr-2 inline-block" />
                        Cash
                      </ToggleGroupItem>
                    </ToggleGroup>
                  )
                }}
              />
              {errors.payment_select && errors.payment_select.type === "required" && (
                <span role="alert" className="text-xs font-normal text-destructive">Payment method is required</span>
              )}
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
          <p>{data}</p>
          <div className="flex items-center justify-center">
            <Button
              type='submit'
              disabled={isLoading}
              className="bg-brand hover:bg-brand/90"
            >
              {isLoading &&
                <Loader2 className={cn('h-4 w-4 animate-spin', 'mr-2')} />
              }
              Confirm & pay
            </Button>
          </div>
        </Container>
      </form>
      {modalView === 'dates-select-view' && <DatesFormModal dates={bookingField.schedule_check_in_date as string} />}
      {modalView === 'rider-select-view' && <RiderFormModal numbers={bookingField.numbers} />}
      {modalView === 'rider-info-view' && <RiderInfoModal idx={index} customer={customer} user={user} />}
      {modalView === 'rider-detail-view' && <RiderDetailFormModal user={user} idx={index} customer={customer} />}
    </div>
  )
}

export default ConfirmNPayClient;