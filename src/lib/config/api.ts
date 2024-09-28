import axios from "axios";
// endpoints
export const domain = process.env.NEXT_PUBLIC_API_URL;
export const loginUrl = domain + '/safari/api/v1/auth-service/user/auth';
export const userTokenUrl = domain + '/safari/api/v1/auth-service/user/token'
export const productUrl = domain + '/safari/api/v2/master-service/product';
// booking service
export const bookingUrl = domain + '/booking-service'
export const customerUrl = bookingUrl + '/customer'

// header
export const getHeader = () => {
  const headers = {
    Accept: 'application/json',
  }
  return headers
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: getHeader()
})