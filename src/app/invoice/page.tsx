import React from 'react';
import Container from '@/components/ui/container';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

function InvoiceDetail() {
  return (
    <div className="flex flex-col min-h-screen mb-20">
      <Container className="py-6 sticky top-0 z-30 bg-background w-full border-b border-foreground-muted flex justify-between items-center shrink-0">
        <button type="button">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-bold text-sm text-foreground/75 truncate">Beginer Ride 1</h3>
        <div></div>
      </Container>
      <Container className="flex items-start bg-background py-6 gap-x-6">
        <div className="w-32 flex-shrink-0 overflow-hidden rounded-md">
          <Link href={"#"}>
            <div className="aspect-w-6 aspect-h-4 w-full h-full">
              <Image
                src="/images/img-grid-2.png"
                alt="image"
                width={0}
                height={0}
                sizes="100vw"
                className="object-cover transition-all duration-300 group-hover:scale-105"
                priority={true}
              />
            </div>
          </Link>
        </div>
        <div className="flex flex-col space-y-3 flex-grow min-w-0">
          <div className="min-w-0">
            <Link href={`/d`}>
              <h4 className="text-base font-semibold text-foreground/75 truncate">
                Beginner Ride 1 Lorem Ipsum Dolor Sit Amet
              </h4>
            </Link>
            <p className="text-xs text-foreground/50 font-normal mt-1 truncate">Riding outside harbour</p>
          </div>

          <div className="flex items-center text-foreground/50 gap-x-2">
            <Star className="w-4 h-4" fill="#F6891F" strokeWidth={0} />
            <p className="inline-block text-xs font-normal">4.9 (120 reviews)</p>
          </div>
        </div>
      </Container>
      <Container className="border-t-4 border-slate-100 bg-background py-8 space-y-6">
        <div>
          <h3 className="font-bold text-base text-foreground/75 mb-3">Price Details</h3>
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-x-6 gap-y-4">
              <dt className="text-sm font-medium text-foreground/50">
                Rp 1,100.000 x 1 Single Ride
              </dt>
              <dd className="text-foreground/50 text-sm">
                {/* <p className="text-xs text-foreground/50">You can ride your own Jetsky</p> */}
                Rp 1,200,000
              </dd>
            </div>
            <div className="flex items-center justify-between gap-x-6 gap-y-4">
              <dt className="text-sm font-medium text-foreground/50">
                Rp 1,100.000 x 1 Couple Ride
              </dt>
              <dd className="text-foreground/50 text-sm">
                {/* <p className="text-xs text-foreground/50">You trip guided by our captain</p> */}
                Rp 1,200,000
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 className="font-bold text-base text-foreground/75 mb-3">Add Ons</h3>
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-x-6 gap-y-4">
              <dt className="text-sm font-medium text-foreground/50">
                Rp 1,100.000 x 1 Single Ride
              </dt>
              <dd className="text-foreground/50 text-sm">
                {/* <p className="text-xs text-foreground/50">You can ride your own Jetsky</p> */}
                Rp 1,200,000
              </dd>
            </div>
          </dl>
        </div>
        <hr className="border border-slate-200" />
        <div>
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-x-6 gap-y-4">
              <dt className="text-sm font-semibold text-foreground/75">
                Total
              </dt>
              <dd className="text-foreground/75 font-semibold text-sm">
                {/* <p className="text-xs text-foreground/50">You can ride your own Jetsky</p> */}
                Rp 1,200,000
              </dd>
            </div>
          </dl>
        </div>
      </Container>
      <div className="flex items-center justify-center mt-10">
        <Button
          className="bg-brand hover:bg-brand/90"
        >Confirm & pay</Button>
      </div>
    </div>
  )
}

export default InvoiceDetail;