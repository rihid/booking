import { NextRequest, NextResponse } from 'next/server';
import { snap } from '@/lib/config/payment';

export async function POST(req: NextRequest) {
  try {
    const { id, name, price, quantity } = await req.json();
    const transactionParams = {
      transaction_details: {
        order_id: id,
        gross_amount: price * quantity
      },
      item_details: [{
        id: id,
        name: name,
        price: price,
        quantity: quantity,
      }]
    }
    const token = await snap.createTransactionToken(transactionParams);
    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    console.log(error);
    return NextResponse.error();
  }
}