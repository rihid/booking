import axios from "axios";
import { z } from "zod";
import { productUrl, loginUrl, userTokenUrl, getHeader } from "@/lib/config/api";
import { LoginSchema, ProductSchema, SingleProductSchema, AuthSchema, UserTokenSchema } from "@/lib/schema";

// just a dummy
export const getUserFromDb = async(body: any) => {
  
  try {
    const res = await axios.post('https://dummyjson.com/auth/login', body, {
      headers: {
        "Content-Type": 'application/json'
      }
    })
    const data = res.data
    return data;
  } catch(error){
    console.log(error)
    throw error;
  }
}

export const postAuth = async(body: z.infer<typeof LoginSchema>) => {
  try {
    const res = await axios.post(loginUrl, body, { headers: getHeader()});
    const data = AuthSchema.parse(res.data)

    return data;
  } catch(error) {
    console.log(error);
    throw error;
  }
}

export const getuser = async(body: z.infer<typeof LoginSchema>) => {
  let datauser: {[key: string]: any} = {}
  let token
  try {
    const res = await axios.post(loginUrl, body, { headers: getHeader()});
    const data = AuthSchema.parse(res.data)
    token = data.token
    datauser.token = data.token;
  } catch(error) {
    console.log(error);
    throw error;
  }
  try {
    const res = await axios.get(userTokenUrl, { headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }})
    const data = UserTokenSchema.parse(res.data)
    const user = data.data
    return user;
  } catch(error) {
    console.log(error);
    throw error
  }
  // return datauser
}

export const getAllProductPublic = async() => {
  try {
    const res = await axios.get(productUrl, { headers: getHeader()});
    const products = z.array(ProductSchema).parse(res.data.data);
    return products;
  } catch(error) {
    console.log(error);
    throw error;
  }
}
export const getSingleProductPublic = async(id: string) => {
  try{
    const res = await axios.get(productUrl + '/' + id, { headers: getHeader()});
    const product = SingleProductSchema.parse(res.data.data);
    return product;
  } catch(error) {
    console.log(error);
    throw error;
  }
}