import axios from "axios";
import { z } from "zod";
import { productUrl, loginUrl, userTokenUrl, customerUrl, getHeader } from "@/lib/config/api";
import { LoginSchema, ProductSchema, SingleProductSchema, AuthSchema, UserTokenSchema } from "@/lib/schema";
import { generateProductSlug } from '@/lib/helper';

let TOKEN: string;
export const getHeader2 = async () => {
  const headers = {
    Accept: 'application/json',
    Authorization: 'Bearer ' + TOKEN

  }
  return headers
}

export const postAuth = async (body: z.infer<typeof LoginSchema>) => {
  try {
    const res = await axios.post(loginUrl, body, { headers: getHeader() });
    const data = AuthSchema.parse(res.data)

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getuser = async (body: z.infer<typeof LoginSchema>) => {
  const dataUser = await postAuth(body)
  TOKEN = dataUser.token
  try {
    const res = await axios.get(userTokenUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + dataUser.token
      }
    })
    const data = UserTokenSchema.parse(res.data.data)
    console.log('usertoken', data)
    const user = data
    return user;
  } catch (error) {
    console.log(error);
    throw error
  }
  // return datauser
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
export const getUserSocial = async (token: string | undefined) => {
  try {
    const res = await axios.get(userTokenUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    const data = UserTokenSchema.parse(res.data.data)
    const user = data
    return user;
  } catch (error) {
    console.log(error);
    throw error
  }
}
export const getCustomerByNo = async (body: { customer_no: string }) => {
  let customer;
  await axios.post(customerUrl + '/get-by-no', body, {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + TOKEN
    }
  })
    .then(

  )
    .catch()
}

export const getAllProductPublic = async () => {
  try {
    const res = await axios.get(productUrl, { headers: getHeader() });
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
    const res = await axios.get(productUrl + '/' + id, { headers: getHeader() });
    const product = SingleProductSchema.parse(res.data.data);
    return product;
  } catch (error) {
    console.log(error);
    throw error;
  }
}