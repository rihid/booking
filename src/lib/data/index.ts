'use server';

import axios from "axios";
import { z } from "zod";
import { masterUrl, productUrl, loginUrl, userTokenUrl, customerUrl, bookingUrl, customerListUrl, branchUrl, userUrl, authUrl } from "@/lib/data/endpoints";
import { LoginFormSchema, ProductSchema, SingleProductSchema, AuthSchema, UserTokenSchema, BookingSchema, BookByCustomerSchema, InvoiceByCustomerSchema, SingleBookingSchema, branchSchema, CustomerFieldSchema } from "@/lib/schema";
import { generateProductSlug, generateBasicToken } from '@/lib/helper';
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

export const createUser = async (values: any) => {
  try {
    const res = await axios.post(authUrl + '/user', values, {
      headers: { Accept: 'application/json' },
    })
    const data = res.data.data;
    return data;
  } catch (error: any) {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error;
  }
}
export const postAuth = async (body: z.infer<typeof LoginFormSchema>) => {
  try {
    const res = await axios.post(loginUrl, body, {
      headers: {
        Accept: 'application/json',
      }
    });
    const data = AuthSchema.parse(res.data)
    return data;
  } catch (error: any) {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
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
    return data;
  } catch (error: any) {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error;
  }
}
export const getOrganizations = async (token: any) => {
  try {
    const response = await axios.get(authUrl + '/organization', { headers: { Accept: 'application/json', Authorization: 'Bearer ' + token } })
    return response.data.data
  } catch (error: any) {
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error
  }
}
export const validateCustomer = async (token: any, user: any) => {
  const body = {
    customer_no: null,
    name: user.name,
    address: null,
    phone: null,
    email: user.email,
    identity_number: null,
    vat: null,
    org_no: user.org_no,
    branch_no: null,
    rating: null,
    type: 'individual',
    birthday: null,
    age: null,
  }
  try {
    const res = await axios.post(customerUrl + '/validate-email', body, {
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + token }, timeout: 50000
    })
    return res.data
  } catch (error: any) {
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error
  }
}
export const userStoreCustomer = async (token: any, user: any) => {
  const body = {
    user_id: user.id,
    customer_no: user.customer_no,
    type: 'main'
  }
  try {
    const res = await axios.post(userUrl + '/store-customer', body, {
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + token }, timeout: 50000
    })
    return res.data
  } catch (error: any) {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error
  }
}
export const checkUserCustomer = async (token: any, user: any) => {
  const body = {
    id: user.id
  }
  try {
    const res = await axios.post(userUrl + '/check-user-customer', body, {
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + token }, timeout: 50000
    })
    return res.data
  } catch (error: any) {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error;
  }
}
export const getUserCustomerList = async (token: any, user: any) => {
  const body = {
    id: user.id
  }
  try {
    const res = await axios.post(userUrl + '/get-customer-list', body, {
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + token },
      timeout: 50000
    })
    return res.data.data
  } catch (error: any) {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error
  }
}
export const getCustomerByNo = async (token: any, customerNo: any) => {
  try {
    const res = await axios.post(customerUrl + '/get-by-no', { customer_no: customerNo }, {
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + token },
      timeout: 30000
    })
    return res.data.data
  } catch (error: any) {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error;
  }
}
export const getCustomerByNoMulti = async (token: any, customerNo: any) => {
  try {
    // Array
    const res = await axios.post(customerUrl + '/get-multi', { customer_no: customerNo }, {
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + token },
      timeout: 30000
    })
    return res.data.data
  } catch (error: any) {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
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
    const products = res.data.data;
    const withSlug = generateProductSlug(products)
    return withSlug;
  } catch (error: any) {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
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
  } catch (error: any) {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
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
  }).catch((error: any) => {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error;
  })

  return res;
}
export const getBooking = async (token: any, id: string) => {
  try {
    const res = await axios.get(bookingUrl + '/book/' + id, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    const data = SingleBookingSchema.parse(res.data.data);
    return data;
  } catch (error: any) {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error;
  }
}
export const getBookbyNo = async(token: any, bookNo: string) => {
  try{
    const res = await axios.post(bookingUrl + '/book/get-by-no', {book_no: bookNo}, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    const data = res.data.data;
    return data;
  } catch(error: any){
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error;
  }
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
  }).catch((error: any) => {
    console.log(error.response)
    throw error;
  })
  return res;
}
export const getEmployees = async (token: any) => {
  try {
    const response = await axios.get(bookingUrl + "/employee", { headers: { Accept: 'application/json', Authorization: 'Bearer ' + token } })
    return response.data.data;
  } catch (error: any) {
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error
  }
}
export const getEmployeeByNo = async (token: any, no: string) => {
  try {
    const response = await axios.post(bookingUrl + "/employee/get-by-no", { employee_no: no }, { headers: { Accept: 'application/json', Authorization: 'Bearer ' + token } })
    return response.data.data;
  } catch (error: any) {
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error
  }
}

export const getInvoiceByCustomer = async (token: any, body: BookByCustomer) => {
  const res = await axios.post(bookingUrl + '/book/customer', body, {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  }).then(response => {
    const data = InvoiceByCustomerSchema.parse(response.data.data);
    console.log(data)
    return data;
  }).catch((error: any) => {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
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
      const data = response.data.data;
      return data;
    })
    .catch((error: any) => {
      console.log(error.response.config.url)
      console.log(error.response.status)
      console.log(error.response.data.message)
      throw error;
    })

  return res;
}
export const getPaymentMethod = (token: any) => {
  const res = axios.get(masterUrl + '/payment-method', {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  }).then(response => {
    const data = response.data.data;
    return data;
  }).catch((error: any) => {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error;
  })

  return res;
}
export const getPaymentStatus = (orderId: string) => {
  const encodeToken = generateBasicToken(process.env.MIDTRANS_SERVER_KEY + ':');
  const res = axios.get(process.env.NEXT_PUBLIC_MIDTRANS_API + '/v2/' + orderId + '/status', {
    headers: {
      accept: 'application/json',
      authorization: 'Basic ' + encodeToken,
    }
  }).then(response => {
    const data = response.data;
    return data;
  }).catch((error: any) => {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error;
  })
  return res;
}
export const getBranchList = async (token: any) => {
  const res = await axios.get(branchUrl, {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  }).then(response => {
    const data = branchSchema.parse(response.data.data);
    console.log(data)
    return data;
  }).catch((error: any) => {
    console.log(error.response.config.url)
    console.log(error.response.status)
    console.log(error.response.data.message)
    throw error;
  })
  return res;
}