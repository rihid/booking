import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from 'zustand/middleware';
import moment from "moment";
import { z } from 'zod';
import { SingleProductSchema, BookingFieldSchema } from "@/lib/schema";

const initialDate = moment().format('YYYY-MM-DD');

export type BookState = {
  bookingField: z.infer<typeof BookingFieldSchema>;
  productBooked: z.infer<typeof SingleProductSchema> | null;
}
export type BookActions = {
  addBooking: (product: z.infer<typeof SingleProductSchema> | null) => void;
  updateBookingField: (values: Partial<BookState['bookingField']>) => void;
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
    total: "",
    ref_no: null,
    captain_no: null,
    customer_service_no: null,
    penalty: null,
    numbers: [
      {
        id: null,
        book_no: null,
        type: "product",
        qty: "1",
        product_no: "",
        product_sku: "",
        variant: null,
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
        description: null
      }
    ],
    riders: [
      {
        book_no: null,
        unit_no: null,
        customer_no: "",
        notes: null,
        book_unit_id: null,
        rating: null,
        rating_notes: null
      }
    ],
    payments: [
      {
        id: null,
        payment_no: null,
        book_no: null,
        payment_date: "",
        method_id: "",
        amount: "",
        promo_id: null,
        round: null,
        discount: "0",
        total: "",
        org_no: "",
        payment_type: "down_payment",
        note: null,
        cash_id: null,
        promo: []
      }
    ]
  },
  productBooked: null,
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
        }
      }),
      {
        name: 'safari-booking',
        storage: createJSONStorage(() => sessionStorage),
      }

    )
  )
}

