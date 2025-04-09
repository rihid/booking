'use client';

import React from 'react';
import { ChevronLeft, SquarePen, Check, Loader2, XIcon, CreditCard, Wallet } from 'lucide-react';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input';
import OpenModalButton from '@/components/ui/button/open-modal-button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import DatesFormModal from './dates-form-modal';
import RiderFormModal from './rider-form-modal';
import { useUiLayoutStore } from '@/store/ui-layout';
import { useBookStore } from '@/providers/store-providers/book-provider';
import { usePaymentStore } from '@/providers/store-providers/payment-provider';
import RiderDetailFormModal from './rider-detail-form-modal';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import ProductSummary from './product-summary';
import axios from 'axios';
import { bookingUrl, voucherUrl } from '@/lib/data/endpoints';
import { z } from 'zod';
import { CustomerFieldSchema, BookingFieldSchema } from '@/lib/schema';
import { currency } from '@/lib/helper';
import RiderInfoModal from './rider-info-modal';
import { cn } from '@/assets/styles/utils';
import { useForm, Controller } from 'react-hook-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from 'sonner';
import Tnc from '@/components/partial/tnc';
import Cancelation from '@/components/partial/cancelation';
import { Checkbox } from '@/components/ui/checkbox';

function ConfirmNPayClient({
  user,
  customerData,
}: {
  user: any;
  customerData?: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ots = searchParams.get('ots');

  const { modalView } = useUiLayoutStore();
  const { bookingField, productBooked, customers, customer, setCustomer, updateBookingField, addCustomer, editCustomer, updateCustomerList } = useBookStore((state) => state);
  const { setPaymentLink } = usePaymentStore((state) => state);
  // local state
  const [isAddRider, setIsAddRider] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [index, setIndex] = React.useState<number>(0);
  const [isOts, setIsOts] = React.useState<boolean>(false);
  const [selectedAddOns, setSelectedAddOns] = React.useState<string[]>([]);
  const [addonsValue, setAddonsValue] = React.useState<any>([])


  const [voucherCode, setVoucherCode] = React.useState<string>('');
  const [voucherData, setVoucherData] = React.useState<any>({});
  const [promoRes, setPromoRes] = React.useState<any>({ status: '', message: '' });
  const [promoLoad, setPromoLoad] = React.useState<boolean>(false);
  // form
  const { control, register, handleSubmit, formState: { errors } } = useForm();
  const [form, setForm] = React.useState<any>(null);
  // calculation
  const totalRiders = React.useMemo(() => {
    const bn = bookingField.numbers.filter(n => n.type === 'product');
    const sum = bn.reduce((acc, val) => {
      const qty = parseInt(val.qty);
      const totalRider = parseInt(val.total_rider)
      const variant = val.variant?.toLowerCase();
      if (variant) {
        if (variant.includes("couple") || variant.includes("double")) {
          return acc + (qty * 2);
        }
      } else {
        return acc + qty
      }
      return acc + (qty * totalRider);
    }, 0);
    return sum;
  }, [bookingField.numbers]);
  const totalPrice = React.useMemo(() => {
    // products
    const subtotal = bookingField.numbers.filter(n => n.type === 'product').reduce((acc, val) => {
      return acc + parseFloat(val.price.replace(/\./g, '')) * parseFloat(val.qty);
    }, 0);

    // addons
    const addonsArr = bookingField.numbers.filter((number) => number.type !== 'product')
    const addonsTotal = addonsArr.reduce((acc, val) => {
      return acc + parseFloat(val.price.replace(/\./g, '')) * parseFloat(val.qty);
    }, 0)
    // console.log('addonsArr', addonsArr)
    // console.log('addonsTotal', addonsTotal)
    const subtotalCombined = subtotal + addonsTotal

    let discountAmount = 0;
    let discount = '0';
    if (voucherData.active) {
      if (voucherData.type === "percentage") {
        discountAmount = (subtotalCombined * parseFloat(voucherData.percentage)) / 100;
        discount = voucherData.percentage + '%'
      } else if (voucherData.type === "amount") {
        discountAmount = parseFloat(voucherData.amount);
        discount = currency(voucherData.amount);
      } else {
        discountAmount = parseFloat(voucherData.amount);
        discount = currency(voucherData.amount);
      }
    }
    const object = {
      subtotal: subtotalCombined,
      dicount: discount,
      discountAmout: discountAmount,
      total: subtotalCombined - discountAmount
    }
    return object;
  }, [bookingField.numbers, voucherData]);

  // functions
  const handlePageBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/explore');
    }
  };
  const handleToggleAddOn = (prodNo: string, addOnData: any) => {
    const addonArr = bookingField.numbers.filter((number) => number.type === 'addon')
    const isSelected = addonArr.some((item) => item.product_no === prodNo);
    const selectedAddon = {
      id: null,
      book_no: null,
      type: "addon",
      qty: '1',
      product_no: addOnData.addon_product_no,
      product_sku: "",
      variant: "",
      price: addOnData.amount,
      subtotal: addOnData.amount,
      discount: "0",
      tax: "0",
      tax_id: null,
      total: "",
      is_guided: false,
      ref_no: null,
      check: false,
      uom_id: "",
      description: "",
      total_rider: ""
    }
    const updatedAddOns = isSelected ? bookingField.numbers.filter((item) => item.product_no !== prodNo) : [...bookingField.numbers, selectedAddon];
    console.log('numbers', bookingField.numbers)
    console.log('updatedAddons', updatedAddOns)
    // updateBookingField({ numbers: [...bookingField.numbers, updatedAddOns] });
  };

  const handdleCheckedChange = async (checked: boolean) => {
    if (checked) {
      const crm = customerData;
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
      editCustomer(0, {
        ...customers[0],
        ...data
      })
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
    }
    setIsAddRider(checked);
  }
  const handleOpenRiderModal = async (idx: number, customer: z.infer<typeof CustomerFieldSchema>) => {
    setIndex(idx);
    setCustomer(customer);
    editCustomer(idx, {
      ...customers[idx],
      ...customer
    })
  }
  const applyPromoCode = async () => {
    if (!voucherCode) return;
    setPromoLoad(true)
    await axios.post(voucherUrl, { voucher_code: voucherCode }, { headers: { Accept: 'application/json' } })
      .then(response => {
        const data = response.data.data;
        setPromoLoad(false);
        setPromoRes({
          status: response.status,
          message: response.data.message
        });
        setVoucherData(data);
      })
      .catch(error => {
        setPromoLoad(false);
        setPromoRes({
          status: error.status,
          message: error.response.data.message
        });
        console.log(error)
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
      window.location.href = '/explore'
    }).catch(error => {
      console.log(error);
      window.location.href = '/explore'
    })
    console.log('customer closed the popup without finishing the payment');
  }
  const handleCheckout = async (body: any, bookId: string) => {
    try {
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const res = await response.json();
      setPaymentLink({
        date: moment().format(),
        order_id: body.orderId,
        payment_token: res.data.token
      })
      // @ts-ignore
      window.snap.pay(res.data.token, {
        onSuccess: (result: any) => {
          toast.success("Payment success! wait for redirection")
          console.log('result', result)
          window.location.href = `/confirmation?order_id=${body.orderId}&transaction_id=${result.transaction_id}`
        },
        onPending: (result: any) => {
          // sementara tidak dipakai
          /*
            toast.warning("Payment pending! wait for redirection")
            console.log('resutl', result)
            window.location.href = `/confirmation?order_id=${body.orderId}&transaction_id=${result.transaction_id}`
          */

          //  pending payment voided
          toast.warning("Payment failed! try to booking again");
          window.location.href = `/explore`
        },
        onClose: () => {
          closePayment(bookId)
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  const onSubmitConfirm = async (validate: any) => {
    const { payment_select, } = validate;
    setIsLoading(true);
    let bodyMidtrans = {
      orderId: bookingField.book_no,
      itemId: productBooked?.id,
      productName: productBooked?.product_name,
      price: totalPrice.total,
      quantity: 1,
      customer: user.name,
      customerEmail: user.email
    }
    let bookId = ''
    let orderIdCash = '';
    // filter numbers
    const numberValue = bookingField.numbers.filter(number => number.qty !== '0');
    const body = { ...bookingField, numbers: numberValue }
    console.log('submit', body)
    try {
      const res = await axios.post(bookingUrl + '/book', body, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + user.token
        }
      })
      const data = res.data.data;
      console.log(data)
      if (data) {
        const formatOrderId = data.book_no.replace(/\//g, '_')
        bodyMidtrans.orderId = formatOrderId;
        orderIdCash = formatOrderId;
        bookId = data.id;
      }

      if (isOts && payment_select === 'cash') {
        window.location.href = `/confirmation?order_id=${orderIdCash}`;
        setIsLoading(false);
        toast.success("Succes create booking, wait for redirection")
        return;
      } else {
        // midtrans
        await handleCheckout(bodyMidtrans, bookId);
        console.log(bodyMidtrans)
        setIsLoading(false);
      }

    } catch (error: any) {
      toast.error('Error create booking!')
      setIsLoading(false);
      console.log(error);
    }
  }
  const validateToast = (errors: any) => {
    if (errors.schedule_check_in_date) {
      toast.warning('Date is required')
    }
    for (let i = 0; i < totalRiders; i++) {
      const inputName = 'rider' + i;
      const phoneInput = 'phone_' + inputName;
      if (errors[inputName]) {
        toast.warning('Rider ' + (i + 1) + ' is empty')
      }
      if (errors[phoneInput]) {
        toast.warning('Phone number for Rider ' + (i + 1) + ' is required')
      }
    }
    if (isOts && errors.payment_select) {
      toast.warning('Payment method is required')
    }
  }
  const phoneFormat = (value: string) => {
    if (!value) return;
    const format = value.replace(/(\d{4})(\d{4})(\d{0,5})/, (_, p1, p2, p3) =>
      `${p1} ${p2}${p3 ? ` ${p3}` : ""}`
    )
    return format;
  }
  // onmount
  React.useEffect(() => {
    if (productBooked) {
      const numberArr = [];
      const variants = productBooked.variants;
      console.log('variants', variants)
      const addons = productBooked.addons;
      if (addons.length > 0) {
        for (let i = 0; i < addons.length; i++) {
          if (addons[i].type === 'service') {
            numberArr.push({
              id: null,
              book_no: null,
              type: "addon",
              qty: "0",
              product_no: addons[i].addon_product_no,
              product_sku: "",
              variant: "",
              price: addons[i].amount,
              subtotal: addons[i].amount,
              discount: "0",
              tax: "0",
              tax_id: null,
              total: "",
              is_guided: false,
              ref_no: null,
              check: false,
              uom_id: "",
              description: "",
              total_rider: 0
            })
          } else {
            numberArr.push({
              id: null,
              book_no: null,
              type: "peripheral",
              qty: "0",
              product_no: addons[i].addon_product_no,
              product_sku: "",
              variant: "",
              price: addons[i].amount,
              subtotal: addons[i].amount,
              discount: "0",
              tax: "0",
              tax_id: null,
              total: "",
              is_guided: false,
              ref_no: null,
              check: false,
              uom_id: "",
              description: "",
              total_rider: 0
            })
          }
        }
      }
      if (variants) {
        const activeVariants = variants.filter((v: any) => v.active === true).sort((a: any, b:any) => {
          const nameA = a.product_sku.toUpperCase();
          const nameB = b.product_sku.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        })
        for (let i = 0; i < activeVariants.length; i++) {
          const variant = activeVariants[i];
          numberArr.push({
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
          })
        }
      } else {
        numberArr.push({
          id: null,
          book_no: null,
          type: "product",
          qty: "0",
          product_no: productBooked.product_no,
          product_sku: "",
          variant: "",
          price: "0",
          subtotal: "0",
          discount: "0",
          tax: "0",
          tax_id: null,
          total: "",
          is_guided: false,
          ref_no: null,
          check: false,
          uom_id: "",
          description: "",
          total_rider: ""
        })
      }

      updateBookingField({
        type_id: productBooked.category.book_type_id,
        customer_no: user?.customer_no,
        schedule_check_in_date: '',
        product_no: productBooked.product_no,
        org_no: user.org_no,
        branch_no: productBooked.branch_no,
        subtotal: totalPrice.subtotal.toString(),
        tax: '0',
        promo_id: null,
        discount: '0',
        tax_id: null,
        total: totalPrice.total.toString(),
        numbers: numberArr,
      });
    }

    // snap script midtrans here
    const midtransScriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_SCRIPT as string;
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
    if (ots === 'true') {
      setIsOts(true)
    } else {
      setIsOts(false)
    };
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
        type: customers[i]?.rider_type || rider.type
      }));

      // addons
      // if (bookingField.numbers.length > 0) {
      //   const numberAddons = bookingField.numbers.map(item => {
      //     if (item.type === "addons") {
      //       const addonQty = addonsValue.includes(item.product_no) ? "1" : "0";
      //       return { ...item, qty: addonQty };
      //     }
      //     return item;
      //   });

      //   console.log('addonvalue', addonsValue);
      //   console.log('selected addons', numberAddons);

      //   if (numberAddons.length > 0) {
      //     console.log('ini jalan')
      //     updateBookingField({
      //       numbers: numberAddons
      //     });
      //   }
      // }

      // numbers & unit qty
      let numberArray = [...bookingField.numbers];

      if (numberArray.length > 0) {
        // addons
        numberArray = numberArray.map(item => {
          if (item.type !== 'product') {
            const productMatch = addonsValue.includes(item.product_no)
            const itemQty = productMatch ? "1" : "0";
            const isCheck = productMatch ? true : false;
            return ({
              ...item,
              qty: itemQty,
              check: isCheck
            })
          }
          return item
        });

        numberArray = numberArray.map((number) => {
          const total = parseFloat(number.qty) * parseFloat(number.price)
          return ({
            ...number,
            total: total.toString()
          })
        })
        // unit quantity
        const unitQty = numberArray.reduce((acc, val) => {
          const qty = parseFloat(val.qty)
          return acc + qty
        }, 1)

        updateBookingField({
          numbers: numberArray,
          unit_qty: unitQty > 1 ? unitQty.toString() : '0',
        })
      }

      updateBookingField({
        riders: riderArr,
        branch_no: productBooked.branch_no,
        subtotal: totalPrice.subtotal.toString(),
        tax: '0',
        discount: totalPrice.discountAmout.toString(),
        promo_id: (voucherData && voucherData.id) ? voucherData.id : null,
        tax_id: null,
        total: totalPrice.total.toString(),
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
      if (customers.length > 0) {
        if (customers[0].id !== null) {
          setIsAddRider(true)
        }
      }
    }
    console.log('bookingFIeld:')
    console.log(bookingField)
  },
    [
      ots,
      productBooked,
      totalRiders,
      customers,
      updateBookingField,
      addCustomer,
      updateCustomerList,
      isAddRider,
      voucherData,
      addonsValue,
    ]
  );

  const PriceDetailComp = () => {
    return (
      <Container className="border-t-4 border-slate-100 bg-background py-8 space-y-6">
        <div>
          <h3 className="font-bold text-base text-foreground/75 mb-3">Price Details</h3>
          <dl className="space-y-4">
            {bookingField.numbers.filter(n => n.type === 'product').map((number, idx) => {
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
        {/* {bookingField.numbers.length > 0 &&
          <div>
            <h3 className="font-bold text-base text-foreground/75 mb-3">Add Ons</h3>
            <dl className="space-y-4">
              {bookingField.numbers.map((item, index) => {
                return (
                  <div className="flex items-center justify-between gap-x-6 gap-y-4" key={index}>
                    <dt className="text-sm font-medium text-foreground/50">
                      {addon.addon_name}
                    </dt>
                    <dd className="text-foreground/50 text-sm">
                      {currency(addon.amount)}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </div>
        } */}
        {bookingField.numbers.filter(item => item.type !== 'product' && item.qty !== "0").length > 0 && (
          <div>
            <h3 className="font-bold text-base text-foreground/75 mb-3">Add Ons</h3>
            <dl className="space-y-4">
              {bookingField.numbers
                .filter(item => item.type !== 'product' && item.qty !== "0")
                .map((item, index) => {
                  // Find the matching addon from productBooked.addons to get the name
                  const addonInfo = productBooked?.addons.find((addon: any) => addon.addon_product_no === item.product_no);
                  return (
                    <div className="flex items-center justify-between gap-x-6 gap-y-4" key={index}>
                      <dt className="text-sm font-medium text-foreground/50">
                        {addonInfo?.addon_name || "Add-on"}
                      </dt>
                      <dd className="text-foreground/50 text-sm">
                        {currency(parseInt(item.price.replace(/\./g, '')))}
                      </dd>
                    </div>
                  );
                })}
            </dl>
          </div>
        )}
        <hr className="border border-slate-200" />
        <div className="space-y-4">
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-x-6 gap-y-4">
              <dt className="text-sm font-normal text-muted-foreground">
                Subtotal
              </dt>
              <dd className="text-muted-foreground font-normal text-sm">
                {currency(totalPrice.subtotal)}
              </dd>
            </div>
          </dl>
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-x-6 gap-y-4">
              <dt className="text-sm font-normal text-muted-foreground">
                Discount
              </dt>
              <dd className="text-muted-foreground font-normal text-sm">
                {totalPrice.dicount}
              </dd>
            </div>
          </dl>
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-x-6 gap-y-4">
              <dt className="text-sm font-semibold text-foreground/75">
                Total
              </dt>
              <dd className="text-foreground/75 font-semibold text-sm">
                {currency(totalPrice.total)}
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
          onClick={handlePageBack}
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
        onSubmit={handleSubmit(onSubmitConfirm, validateToast)}
      >
        <Container className="border-t-4 border-slate-100 bg-background py-8">
          <h3 className="font-bold text-base text-foreground/75 mb-3">Your Trip</h3>
          <div className="space-y-6">
            <div className="flex items-start justify-between w-full">
              <div className="text-foreground/75">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Dates</h4>
                  {!bookingField.schedule_check_in_date &&
                    <span className="text-xs italic text-muted-foreground">&ndash; Required</span>
                  }
                </div>
                {bookingField.schedule_check_in_date ?
                  <p className="text-xs font-normal text-foreground/50">{bookingField.schedule_check_in_date == '' ? 'Select date' : moment(bookingField.schedule_check_in_date).format('DD MMM YYYY H:mm')}</p>
                  :
                  <>
                    <p className="text-xs font-normal text-foreground/50">{bookingField.schedule_check_in_date == '' ? 'Select date' : moment(bookingField.schedule_check_in_date).format('DD MMM YYYY H:mm')}</p>
                    <input
                      type="text"
                      id="schedule_check_in_date"
                      value={bookingField.schedule_check_in_date || ''}
                      aria-invalid={errors.schedule_check_in_date ? "true" : "false"}
                      {...register("schedule_check_in_date", { required: true })}
                      className="hidden"
                    />
                    {errors.schedule_check_in_date && errors.schedule_check_in_date.type === "required" && (
                      <span role="alert" className="text-xs font-normal text-destructive">Dates is required</span>
                    )}
                  </>
                }
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
              <ToggleGroup
                type="multiple"
                className="mt-3 gap-4"
                value={addonsValue}
                onValueChange={(value) => {
                  if (value) setAddonsValue(value);
                }}
              >
                {productBooked?.addons.map((pa: any) => {
                  return (
                    <ToggleGroupItem
                      key={pa.addon_product_no}
                      value={pa.addon_product_no}
                      // onClick={() => handleToggleAddOn(pa.addon_product_no, pa)}
                      className="w-full justify-center border border-foreground/50 rounded px-4 py-3 text-xs text-start font-normal font-foreground/50 data-[state=on]:bg-brand data-[state=on]:text-background data-[state=on]:border-brand"
                    >
                      {pa.addon_name}
                    </ToggleGroupItem>
                  )
                })}
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
            {customers.map((customer, idx) => {
              const inputName = 'rider' + idx;
              return (
                <React.Fragment key={idx}>
                  <div className="flex items-start justify-between w-full">
                    {customer.id !== null ?
                      <div className="text-foreground/75">
                        <h4 className="font-semibold text-sm capitalize">{customer.name} <span className="font-normal text-xs">{customer.rider_type ? `(${customer.rider_type})` : ''}</span></h4>
                        <div className="flex items-center justify-start gap-2">
                          {customer.email &&
                            <>
                              <p className="text-xs font-normal text-foreground/50">{customer.email}</p>
                              <span className="text-xs font-normal text-foreground/50">-</span>
                            </>
                          }
                          {customer.phone ? (
                            <p className="text-xs font-normal text-foreground/50">{phoneFormat(customer.phone)}</p>
                          ) : (
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-normal text-destructive">Phone number is required</p>
                              <input
                                type="text"
                                id={`phone_${inputName}`}
                                {...register(`phone_${inputName}`, { required: true })}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      :
                      <div className="text-foreground/75">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">Name</h4>
                          <span className="text-xs italic text-muted-foreground">&ndash; Required</span>
                        </div>
                        <div className="flex items-center justify-start gap-2">
                          <p className="text-xs font-normal text-foreground/50">Email</p>
                          <span className="text-xs font-normal text-foreground/50">-</span>
                          <p className="text-xs font-normal text-foreground/50">Phone</p>

                        </div>
                        <input
                          type="text"
                          id={inputName}
                          // value={customer.id}
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
        <Container className="border-t-4 border-slate-100 bg-background py-8">
          <h3 className="font-bold text-base text-foreground/75 mb-3">Promo Code</h3>
          {!promoRes.status &&
            <>
              {promoLoad ?
                <div className="flex w-full max-w-sm items-center">
                  <Skeleton className="flex h-10 w-full rounded-md" />
                </div>
                :
                <div className="relative flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="text"
                    id='voucher_code'
                    placeholder="Promo Code"
                    onChange={(e) => setVoucherCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (!voucherCode) return;
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        applyPromoCode();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-0 px-3 text-sm text-brand"
                    onClick={applyPromoCode}
                  >
                    {promoLoad ?
                      <Loader2 className={cn('h-4 w-4 animate-spin', 'mr-2')} /> :
                      <>Apply</>
                    }
                  </button>
                </div>
              }
            </>
          }
          {promoRes.status === 200 &&
            <div className="flex w-full max-w-sm items-center">
              <div className="flex h-10 px-4 w-full rounded-md items-center justify-between bg-green-50 border border-green-500">
                <div className="flex items-center pr-2">
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-6 text-green-500 scale-in">
                      <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <p className="text-xs font-semibold text-muted-foreground">{voucherData.voucher_code} <span className="font-normal">({totalPrice.dicount} dicount)</span></p>
                </div>
                <button
                  type='button'
                  onClick={() => {
                    setPromoRes({ status: '', message: '' })
                    setVoucherData({})
                  }}
                >
                  <XIcon className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          }
          {promoRes.status === 404 &&
            <div className="flex w-full max-w-sm items-center">
              <div className="flex h-10 px-4 w-full rounded-md items-center justify-between bg-red-50 border border-red-500">
                <div className="flex items-center pr-2">
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500 scale-in">
                      <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
                    </svg>

                  </span>
                  <p className="text-xs font-normal text-muted-foreground">{promoRes.message}</p>
                </div>
                <button
                  type='button'
                  onClick={() => setPromoRes({ status: '', message: '' })}
                >

                  <XIcon className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          }
        </Container>
        <PriceDetailComp />
        {isOts &&
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
                          className="w-full justify-start border border-foreground/50 rounded px-4 py-3 text-xs text-start font-normal font-foreground/50 data-[state=on]:bg-brand data-[state=on]:text-background data-[state=on]:border-brand"
                        >
                          <CreditCard className="w-5 h-5 mr-2 inline-block" />
                          Cashless
                        </ToggleGroupItem>

                        <ToggleGroupItem
                          disabled={false}
                          value="cash"
                          className="w-full justify-start border border-foreground/50 rounded px-4 py-3 text-xs text-start font-normal font-foreground/50 data-[state=on]:bg-brand data-[state=on]:text-background data-[state=on]:border-brand"
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
          </Container>
        }
        <Container className="border-t-4 border-slate-100 bg-background py-8 space-y-6">
          <Tnc />
        </Container>
        <Container className="border-t-4 border-slate-100 bg-background py-8">
          <Cancelation />
        </Container>
        <Container className="border-t-4 border-slate-100 bg-background py-8">
          <div className="flex items-start space-x-2">
            <Controller
              name="agreement"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Checkbox
                  id="agreement"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="agreement"
                className="text-xs text-muted-foreground"
              >
                I agree to the Terms and Conditions
              </label>
              {errors.agreement && (
                <span className="text-xs font-normal text-destructive">
                  Terms and Conditions is required
                </span>
              )}
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
      {modalView === 'dates-select-view' && <DatesFormModal user={user} dates={bookingField.schedule_check_in_date as string} />}
      {modalView === 'rider-select-view' && <RiderFormModal numbers={bookingField.numbers} />}
      {modalView === 'rider-info-view' && <RiderInfoModal idx={index} customer={customer} user={user} />}
      {modalView === 'rider-detail-view' && <RiderDetailFormModal user={user} idx={index} customer={customer} />}
    </div >
  )
}

export default ConfirmNPayClient;