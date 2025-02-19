import { NextRequest, NextResponse } from 'next/server';
import { snap } from '@/lib/config/payment';

export async function POST(req: NextRequest) {
  try {
    console.log('req:', req)
    const { orderId, itemId, productName, price, quantity, customer, customerEmail } = await req.json();
    const transactionParams = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price * quantity
      },
      item_details: [{
        id: itemId,
        name: productName,
        price: price,
        quantity: quantity,
      }],
      customer_details: {
        first_name: customer,
        email: customerEmail,
      },
      // callback: {
      //   finish: 'https://safari-booking.callistech.co.id/confirmation'
      // }
    }
    const data = await snap.createTransaction(transactionParams);
    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    console.log(error);
    return NextResponse.error();
  }
}