import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge, BadgeCheck } from 'lucide-react';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button/button';

function PaymentSuccess() {
  return (
    <div className="flex flex-col min-h-screen">
      <Card className="flex flex-col items-center justify-center border-none p-8 shadow">
        <div>
          <BadgeCheck className="w-32 h-32 text-brand" />
        </div>
        <Heading variant='xl' className="text-muted-foreground my-2.5">Thanks</Heading>
        <div className="mt-1 text-foreground/50 text-sm font-normal text-center w-full max-w-[220px]">
          <span>Congratulations! your order have been
            sucessfully process.</span>
        </div>
      </Card>
      <Container className="mt-8">
        <Heading variant='base' className="text-muted-foreground">Order Detail</Heading>
        <div className="font-normal text-sm text-brand">
          <span>Order ID #FJER</span>
        </div>
        <Card className="mt-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 py-3 px-8">
            <div>
              <Heading variant='xs' className="text-muted-foreground">Trip</Heading>
              <div className="font-bold text-sm text-foreground/50">
                <span>Beginner Ride 1</span>
              </div>
            </div>
            <div>
              <Heading variant='xs' className="text-muted-foreground">Duration</Heading>
              <div className="font-bold text-sm text-foreground/50">
                <span>1 Hour</span>
              </div>
            </div>
            <div>
              <Heading variant='xs' className="text-muted-foreground">Rider</Heading>
              <div className="font-bold text-sm text-foreground/50">
                <span>3 Rider</span>
              </div>
            </div>
            <div>
              <Heading variant='xs' className="text-muted-foreground">Amout</Heading>
              <div className="font-bold text-sm text-foreground/50">
                <span>2.800.000</span>
              </div>
            </div>
          </div>
        </Card>
        <div className="mt-8 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4 w-full min-w-40">
            <Button className="bg-brand hover:bg-brand/90">Tract Order</Button>
            <Button>Back</Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default PaymentSuccess;