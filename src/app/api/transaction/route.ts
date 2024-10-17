import { NextRequest, NextResponse } from 'next/server';
import { snap } from '@/lib/config/payment';

export async function POST(req: NextRequest) {
  try {
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
      }
    }
    const token = await snap.createTransactionToken(transactionParams);
    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    console.log(error);
    return NextResponse.error();
  }
}