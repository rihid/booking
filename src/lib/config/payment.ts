import { MidtransClient } from "midtrans-node-client";

const envProd = process.env.MIDTRANS_PRODUCTION?.toLowerCase() === "true";

export const snap = new MidtransClient.Snap({
  isProduction: envProd,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
})