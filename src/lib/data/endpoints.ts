import axios from "axios";
// endpoints
export const domain = process.env.NEXT_PUBLIC_API_URL;
// auth service
export const authUrl = domain + '/safari/api/v1/auth-service';
export const loginUrl = authUrl + '/user/auth';
export const userUrl = authUrl + '/user';
export const userTokenUrl = authUrl + '/user/token';
export const customerUserUrl = authUrl + '/user/store-customer';
export const customerListUrl = authUrl + '/user/get-customer-list'
export const branchUrl = authUrl + '/branch'
// master service
export const masterUrl = domain + '/safari/api/v1/master-service'
// master public service
export const locationUrl = domain + '/safari/api/v2/master-service/location'
export const productUrl = domain + '/safari/api/v2/master-service/product';
// booking service
export const bookingUrl = domain + '/safari/api/v1/booking-service'
export const bookingUrl2 = domain + '/safari/api/v2/booking-service'
export const customerUrl = bookingUrl + '/customer'
export const voucherUrl = bookingUrl2 + '/promo/get-voucher'

export const setHeader = async () => {
  let token;
  const response = await fetch('http://localhost:3000/api/auth/jwt', {
    method: 'GET',
    credentials: 'include'
  });
  if (response.ok) {
    const data = await response.json();
    token = data.token;
  }

  const headers: { [key: string]: any } = {
    Accept: 'application/json',
  };
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }

  return headers;
};