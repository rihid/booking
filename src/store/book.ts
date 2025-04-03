import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from 'zustand/middleware';
import moment from "moment";
import { z } from 'zod';
import { SingleProductSchema, BookingFieldSchema, CustomerFieldSchema } from "@/lib/schema";

const initialDate = moment().format('YYYY-MM-DD');
interface PaymentLink {
  book_id: string | null;
  url_payment: string | null;
}
export type BookState = {
  bookingField: z.infer<typeof BookingFieldSchema>;
  productBooked: z.infer<typeof SingleProductSchema> | null;
  customers: z.infer<typeof CustomerFieldSchema>[];
  customer: any;
  paymentLink: PaymentLink[]
}
export type BookActions = {
  addBooking: (product: z.infer<typeof SingleProductSchema> | null) => void;
  updateBookingField: (values: Partial<BookState['bookingField']>) => void;
  addCustomer: (customer: z.infer<typeof CustomerFieldSchema>) => void;
  editCustomer: (index: number, customer: z.infer<typeof CustomerFieldSchema>) => void;
  updateCustomerList: (customers: z.infer<typeof CustomerFieldSchema>[]) => void;
  setPaymentLink: (link: PaymentLink) => void;
  setCustomer: (customer: any) => void;
}

export type BookStore = BookState & BookActions

export const defaultInitState: BookState = {
  bookingField: {
    type_id: "",
    book_no: null,
    book_date: initialDate,
    customer_no: "",
    schedule_check_in_date: "",
    schedule_check_out_date: null,
    check_in_date: null,
    check_out_date: null,
    duration: null,
    notes: null,
    product_no: null,
    bill_no: null,
    create_by: null,
    status: "open",
    lock: false,
    org_no: "",
    branch_no: null,
    unit_qty: null,
    subtotal: "0",
    discount: "0",
    promo_id: null,
    tax: "0",
    tax_id: null,
    total: "0",
    ref_no: null,
    captain_no: null,
    customer_service_no: null,
    penalty: null,
    numbers: [],
    riders: [{
      book_no: null,
      unit_no: null,
      customer_no: "",
      notes: null,
      book_unit_id: null,
      rating: null,
      rating_notes: null,
      type: ''
    }],
    payments: [],
    addons: []
  },
  productBooked: null,
  customers: [],
  paymentLink: [],
  customer: {
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
    from: "",
    rider_type: ""
  }
}

export const createBookStore = (
  initState: BookState = defaultInitState,
) => {
  return createStore<BookStore>()(
    persist(
      (set) => ({
        ...initState,
        addBooking: (product: z.infer<typeof SingleProductSchema> | null) => set((state) => ({ productBooked: product })),
        updateBookingField: (values: Partial<BookState['bookingField']>) => {
          set((state => ({
            bookingField: {
              ...state.bookingField,
              ...values
            }
          })))
        },
        addCustomer: (customer: z.infer<typeof CustomerFieldSchema>) => set((state) => ({
          customers: [
            ...state.customers,
            customer
          ]
        })),
        editCustomer: (idx: number, customer: z.infer<typeof CustomerFieldSchema>) => set((state) => {
          const customerArr = [...state.customers];
          customerArr[idx] = customer;
          return { customers: customerArr };
        }),
        updateCustomerList: (customers: z.infer<typeof CustomerFieldSchema>[]) => set((state) => ({
          customers: customers
        })),
        setPaymentLink: (data: PaymentLink) => set((state) => ({
          paymentLink: [
            ...state.paymentLink,
            data
          ]
        })),
        setCustomer: (customer) => set((state) => ({
          customer: customer
        })),
      }),
      {
        name: 'safari-booking',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
}

