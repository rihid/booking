import axios from "axios";
// endpoints
export const domain = process.env.NEXT_PUBLIC_API_URL;
// auth service
export const authUrl = domain + '/safari/api/v1/auth-service/user'
export const loginUrl = authUrl + '/auth';
export const userTokenUrl = authUrl + '/token';
export const customerUserUrl = authUrl + '/store-customer';
export const customerListUrl = authUrl + '/get-customer-list'
// master service
export const masterUrl = domain + '/safari/api/v1/master-service'
// master public service
export const productUrl = domain + '/safari/api/v2/master-service/product';
// booking service
export const bookingUrl = domain + '/safari/api/v1/booking-service'
export const customerUrl = bookingUrl + '/customer'

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