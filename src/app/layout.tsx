import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/assets/styles/utils";
import { fontSans } from "@/assets/styles/fonts";
import { Toaster } from "@/components/ui/sonner";

// style
import "@/assets/styles/globals.css";
import "@/assets/styles/rc-drawer.css";
const inter = Inter({ subsets: ["latin"] });

// providers
import { CounterStoreProvider } from "@/providers/store-providers/testing-provider";
import { BookStoreProvider } from "@/providers/store-providers/book-provider";
import { PaymentStoreProvider } from "@/providers/store-providers/payment-provider";

export const metadata: Metadata = {
  title: {
    template: ' %s | Booking Safari',
    default: 'BRP Commerce', 
  },
  description: "Sewa jetski, Rental Jetski, main jetski di semarang",
};

// combine providers
const combineProviders = (providers: React.ComponentType<{ children: React.ReactNode }>[]) => {
  return function CombinedProviders({ children }: { children: React.ReactNode }) {
    return providers.reduceRight(
      (acc, CurrentProvider) => <CurrentProvider>{acc}</CurrentProvider>,
      children
    );
  }
}
const AppProviders = combineProviders([
  CounterStoreProvider,
  BookStoreProvider,
  PaymentStoreProvider
])

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'bg-neutral-100 min-h-screen font-sans antialised',
        fontSans.variable
      )}>
        <AppProviders>
          <main className="wrapper bg-background flex flex-col justify-between w-full h-full min-h-screen">
            {children}
          </main>
          <Toaster/>
        </AppProviders>
      </body>
    </html>
  );
}
