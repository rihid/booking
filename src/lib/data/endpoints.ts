import axios from "axios";
// endpoints
export const domain = process.env.NEXT_PUBLIC_API_URL;
// auth service
export const authUrl = domain + '/api/v1/auth-service';
export const loginUrl = authUrl + '/user/auth';
export const userUrl = authUrl + '/user';
export const userTokenUrl = authUrl + '/user/token';
export const customerUserUrl = authUrl + '/user/store-customer';
export const customerListUrl = authUrl + '/user/get-customer-list'
export const branchUrl = authUrl + '/branch'
// master service
export const masterUrl = domain + '/api/v1/master-service'
// master public service
export const locationUrl = domain + '/api/v2/master-service/location'
export const productUrl = domain + '/api/v2/master-service/product';
// booking service
export const bookingUrl = domain + '/api/v1/booking-service'
export const bookingUrl2 = domain + '/api/v2/booking-service'
export const customerUrl = bookingUrl + '/customer'
export const voucherUrl = bookingUrl2 + '/promo/get-voucher'