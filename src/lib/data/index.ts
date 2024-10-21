'use server';

import axios from "axios";
import { z } from "zod";
import { productUrl, loginUrl, userTokenUrl, customerUrl, bookingUrl, customerListUrl } from "@/lib/data/endpoints";
import { LoginFormSchema, ProductSchema, SingleProductSchema, AuthSchema, UserTokenSchema, BookingSchema, BookByCustomerSchema, InvoiceByCustomerSchema, SingleBookingSchema } from "@/lib/schema";
import { generateProductSlug } from '@/lib/helper';
import moment from "moment";

interface CustomerListBody {
  user_id: string | null;
  type: string;
}
interface BookByCustomer {
  customer_no: string;
  type: string;
  begin: string | null;
  end: string | null;
}

const date = new Date();

export const postAuth = async (body: z.infer<typeof LoginFormSchema>) => {
  try {
    const res = await axios.post(loginUrl, body, {
      headers: {
        Accept: 'application/json',
      }
    });
    const data = AuthSchema.parse(res.data)

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export const getUserToken = async (token: any) => {
  try {
    const res = await axios.get(userTokenUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    const data = UserTokenSchema.parse(res.data.data);
    const user = data;
    return user;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
export const getAllProductPublic = async () => {
  try {
    const res = await axios.get(productUrl, {
      headers: {
        Accept: 'application/json',
      }
    });
    // const products = z.array(ProductSchema).parse(res.data.data);
    const products = res.data.data;
    // generate slug
    const withSlug = generateProductSlug(products)
    return withSlug;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export const getSingleProductPublic = async (id: string) => {
  try {
    const res = await axios.get(productUrl + '/' + id, {
      headers: {
        Accept: 'application/json',
      }
    });
    // const product = SingleProductSchema.parse(res.data.data);
    const product = res.data.data
    return product;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export const getAllBooking = async (token: any) => {
  const startDate = moment(date).subtract(30, 'days').format('YYYY-MM-DD');
  const endDate = moment(date).format('YYYY-MM-DD');

  const res = axios.get(bookingUrl + '/book' + '?begin=' + startDate + '&end=' + endDate + '&type=book', {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  }).then(response => {
    const data = BookingSchema.parse(response.data.data);
    return data;
  }).catch(error => {
    console.log(error);
    throw error;
  })

  return res;
}
export const getBooking = async (token: any, id: string) => {
  const res = axios.get(bookingUrl + '/book/' + id, {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  }).then(response => {
    const data = SingleBookingSchema.parse(response.data.data);
    return data;
  }).catch(error => {
    console.log(error);
    throw error;
  })

  return res;
}
export const getBookByCustomer = async (token: any, body: BookByCustomer) => {
  const res = await axios.post(bookingUrl + '/book/customer', body, {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  }).then(response => {
    const data = BookByCustomerSchema.parse(response.data.data);
    return data;
  }).catch( error => {
    console.log(error)
    throw error;
  })
  return res;
}
export const getInvoiceByCustomer = async (token: any, body: BookByCustomer) => {
  const res = await axios.post(bookingUrl + '/book/customer', body, {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  }).then(response => {
    const data = InvoiceByCustomerSchema.parse(response.data.data);
    return data;
  }).catch( error => {
    console.log(error)
    throw error;
  })
  return res;
}
export const getCustomerList = (token: any, body: CustomerListBody) => {
  const res = axios.post(customerListUrl, body, {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  })
    .then(response => {
      console.log(response.data.data);
      const data = response.data.data;
      return data;
    })
    .catch(error => {
      console.log(error)
      throw error;
    })

  return res;
}