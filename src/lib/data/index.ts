'use server';

import axios from "axios";
import { z } from "zod";
import { productUrl, loginUrl, userTokenUrl, customerUrl, bookingUrl } from "@/lib/data/endpoints";
import { LoginFormSchema, ProductSchema, SingleProductSchema, AuthSchema, UserTokenSchema } from "@/lib/schema";
import { generateProductSlug } from '@/lib/helper';
import { getSession } from "../session";

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

export const getUserToken = async (token: string) => {
  try {
    const res = await axios.get(userTokenUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    const data = UserTokenSchema.parse(res.data.data);
    const user = data
    return user;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
export const getCustomerByNo = async (body: { customer_no: string }) => {
  let customer;
  await axios.post(customerUrl + '/get-by-no', body, {
    headers: {
      Accept: 'application/json',
    }
  })
    .then(

  )
    .catch()
}

export const getAllProductPublic = async () => {
  try {
    const res = await axios.get(productUrl, {
      headers: {
        Accept: 'application/json',
      }
    });
    const products = z.array(ProductSchema).parse(res.data.data);
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
    const product = SingleProductSchema.parse(res.data.data);
    return product;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export const getAllBooking = async (token: any) => {
  return axios.get(bookingUrl + '/book?begin=2024-08-01&end=2024-10-31&type=invoice', {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  })
    .then(response => {
      console.log(response.data);
      const data = response.data.data;
      return data;
    })
    .catch(error => {
      console.log(error);
      throw error;
    })
}