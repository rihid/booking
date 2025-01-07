
// import { NextResponse } from 'next/server';
// import { checkUserCustomer, getCustomerByNo, getUserToken } from '@/lib/data';
// import { createSession } from '@/lib/session';
// import axios from 'axios';
// import { userTokenUrl, userUrl, customerUrl } from '@/lib/data/endpoints';
// import { UserTokenSchema } from '@/lib/schema';

// export async function POST(request: Request) {
//   const { token } = await request.json();

//   if (!token) {
//     return NextResponse.json({ message: 'Token is required' }, { status: 400 });
//   }

//   // user token
//   let user: any = null;
//   await axios.get(userTokenUrl, {
//     headers: { Accept: 'application/json', Authorization: 'Bearer ' + token },
//   })
//     .then(response => {
//       const data = UserTokenSchema.parse(response.data.data);
//       user = data;
//       user.token = token;
//     })
//     .catch(error => {
//       console.log('Error user token:', error.response?.data || error.message);
//       return NextResponse.json({ message: 'Error user token' }, { status: 500 });
//     });

//   // Check User Customer
//   await axios.post(userUrl + '/check-user-customer', { id: user.id }, { headers: { Accept: 'application/json', Authorization: 'Bearer ' + token }, timeout: 50000 })
//     .then(response => {
//       const uc = response.data;
//       user.customer_no = uc.customer_no;
//       user.customers = uc.data;
//     })
//     .catch(error => {
//       console.log('Error check user customer:', error.response?.data || error.message);
//       user.customer_no = null;
//       user.customers = [];
//       return NextResponse.json({ message: 'Error check user customer' }, { status: 500 });
//     });

//   // get by no
//   await axios.post(customerUrl + '/get-by-no', { customer_no: user.customer_no},
//     { headers: { Accept: 'application/json', Authorization: 'Bearer ' + token }, timeout: 30000,})
//     .then(response => {
//       const data = response.data.data;
//       user.customer = data;
//     })
//     .catch(error => {
//       console.log('Error customer by number:', error.response?.data || error.message);
//       user.customer = null;
//       return NextResponse.json({ message: 'Error customer by number' }, { status: 500 });
//     });

//   await createSession(user);

//   return NextResponse.json({ message: 'Login successful' }, { status: 200 });
// }


/* Kode dibawah ini */ 

import { NextResponse } from 'next/server';
import { checkUserCustomer, getCustomerByNo, getUserToken } from '@/lib/data';
import { createSession } from '@/lib/session';

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ message: 'Token is required' }, { status: 400 });
  }
  console.log(token)
  try {
    const user = await getUserToken(token)
    console.log(user?.id)
    user.token = token
    const uc = await checkUserCustomer(token, user)
    user.customer_no = uc.customer_no
    user.customers = uc.data
    // const customerData = await getCustomerByNo(token, uc.customer_no)
    // console.log('getCustomerByNo')
    // console.log(customerData)
    // user.customer = customerData
    await createSession(user)
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Login failed', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
