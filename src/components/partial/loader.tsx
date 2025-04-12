import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Container from '@/components/ui/container';
import { ChevronLeft } from 'lucide-react';

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function UserAvatarLoader() {
  return (
    <div className="flex items-center justify-start gap-x-2">
      <Skeleton className="w-8 h-8 roundel-full" />
      <Skeleton className="h-3 w-24" />
    </div>
  )
}

export function ProductCardLoader() {
  return (
    <Card className="border-none shadow-none">
      <div className="relative flex flex-col">
        <Skeleton className="flex aspect-w-5 aspect-h-4 w-full h-0" />

        <div className="space-y-0.5 mt-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
export function ProductDetailContentLoader() {
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Skeleton className="w-full h-80 rounded-b-[40px]" />
      </div>
      <Container className="flex items-center justify-between mt-7">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-24" />
      </Container>

      <Container>
        <Card className="my-5">
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      </Container>

      <Container className="mt-1">
        <Skeleton className="h-4 w-24 mb-3" />
        <dl className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-start gap-x-6 gap-y-4">
              <Skeleton className="h-5 w-5" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </dl>
      </Container>

      <Container className="flex flex-col w-full mx-auto mt-5">
        <Skeleton className="h-4 w-24 mb-3" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-11/12" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </Container>
    </div>
  )
}
export function ReserveButtonLoader() {
  return (
    <div className="wrapper fixed z-40 bottom-0 border-t-2 border-t-slate-100 shadow-sm w-full bg-background pb-2">
      <Container className="flex items-center justify-between py-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-32" />
      </Container>
    </div>
  )
}
export function ProductListLoader() {
  return (
    <Container className="space-y-6">
      <ProductCardLoader />
      <ProductCardLoader />
      <ProductCardLoader />
      <ProductCardLoader />
    </Container>
  )
}
export function ProductDetailLoader() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="relative">
          <Skeleton className="flex aspect-w-5 aspect-h-4 w-full h-0" />
        </div>

        <div className="flex-1 w-full py-7 mb-20">
          <ProductDetailContentLoader />
        </div>
      </div>
      <ReserveButtonLoader />
    </>
  )
}
export function ConfirmPayLoader() {
  return (
    <div className="flex flex-col min-h-screen mb-20">
      <Container className="py-6 sticky top-0 z-30 bg-background w-full border-b border-foreground-muted flex justify-between items-center shrink-0">
        <button
          type="button"
        >
          <span>
            <ChevronLeft className="w-5 h-5" />
          </span>
        </button>
        <h3 className="font-bold text-sm text-foreground/75">Confirm & Pay</h3>
        <div></div>
      </Container>
      <ProductSummaryLoader />
      <Container className="border-t-4 border-slate-100 bg-background py-8">
        <Skeleton className="h-5 w-20 mb-4" />
        <div className="space-y-6">
          <div className="flex items-start justify-between w-full">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-start justify-between w-full">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex flex-wrap items-start justify-between w-full">
            <div className="w-full flex-grow">
              <Skeleton className="h-4 w-16 mb-3" />
            </div>
            <div className="flex flex-wrap gap-4 mt-3 w-full">
              <Skeleton className="h-10 w-24 rounded" />
              <Skeleton className="h-10 w-28 rounded" />
              <Skeleton className="h-10 w-20 rounded" />
              <Skeleton className="h-10 w-26 rounded" />
            </div>
          </div>
        </div>
      </Container>
      <Container className="border-t-4 border-slate-100 bg-background py-8">
      <Skeleton className="h-5 w-32 mb-3" />
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-10 rounded-full" />
      </div>
      
      <div className="space-y-6">
        <div className="flex items-start justify-between w-full">
          <div>
            <Skeleton className="h-4 w-40 mb-2" />
            <div className="flex items-center justify-start gap-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-5 w-5" />
        </div>
      </div>
    </Container>
    </div>
  )
}
export function ProductSummaryLoader() {
  return (
    <Container className="flex items-start bg-background py-6 gap-x-6">
      <div className="w-32 flex-shrink-0 overflow-hidden rounded-md">
        <Skeleton className="h-[85px]" />
      </div>
      <div className="flex flex-col space-y-3 flex-grow min-w-0">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-36" />
        </div>

        <div className="flex items-center">
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </Container>
  )
}
export function BookingCardLoader() {
  return (
    <Card className="border-slate-200 space-y-5 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-52" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="py-6 flex justify-center">
        <Skeleton className="w-[200px] h-[200px]" />
      </div>
    </Card>
  )
}
export function CustomerListLoader() {
  return (
    <div>
      <Card className="mb-4">
        <CardContent className="relative p-0 flex flex-col divide-y">
          <div className="flex flex-col space-y-1.5 p-4">
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
          <div className="grid grid-cols-2 divide-x items-center justify-center">
            <div className="flex items-center justify-center p-4">
              <Skeleton className="w-14 h-5" />
            </div>
            <div className="flex items-center justify-center p-4">
              <Skeleton className="w-14 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardContent className="relative p-0 flex flex-col divide-y">
          <div className="flex flex-col space-y-1.5 p-4">
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
          <div className="grid grid-cols-2 divide-x items-center justify-center">
            <div className="flex items-center justify-center p-4">
              <Skeleton className="w-14 h-5" />
            </div>
            <div className="flex items-center justify-center p-4">
              <Skeleton className="w-14 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardContent className="relative p-0 flex flex-col divide-y">
          <div className="flex flex-col space-y-1.5 p-4">
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
          <div className="grid grid-cols-2 divide-x items-center justify-center">
            <div className="flex items-center justify-center p-4">
              <Skeleton className="w-14 h-5" />
            </div>
            <div className="flex items-center justify-center p-4">
              <Skeleton className="w-14 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export function InvoiceLoader() {
  return (
    <div className="flex flex-col min-h-screen">
      <Container>
        <div className="flex items-start bg-background py-6 gap-x-6">
          <div className="w-32 flex-shrink-0">
            <Skeleton className="aspect-w-6 aspect-h-4 w-full h-full" />
          </div>
          <div className="flex flex-col space-y-3 flex-grow min-w-0">
            <div className="flex flex-col gap-2">
              <Skeleton className="w-36 h-4" />
              <Skeleton className="w-44 h-3" />
            </div>
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-center items-center mb-8">
          <Skeleton className="w-44 h-6" />
          <Skeleton className="w-44 h-8" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-60" />
            <Skeleton className="h-3 w-60" />
            <Skeleton className="h-3 w-60" />
          </div>
        </div>
      </Container>
      <Container className="border-t-4 border-slate-100 bg-background py-4">
        <RatingLoader />
      </Container>
    </div>
  )
}
export function RatingLoader() {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center gap-4 justify-center">
        <Skeleton className="h-12 w-60" />
      </div>
      <div className="flex flex-col gap-4 justify-center items-center mb-8">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="flex flex-col items-center">
        <Skeleton className="h-8 w-60" />
      </div>
    </div>
  )
}
export function CaptainRatingLoader() {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center gap-4 justify-center">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-5 w-36" />
      </div>
      <div className="flex flex-col gap-4 justify-center items-center mb-8">
        <Skeleton className="h-6 w-36" />
      </div>
      <div className="flex flex-col items-center">
        <Skeleton className="h-8 w-44" />
      </div>
      <div className="flex flex-col items-center gap-2 justify-center">
        <Skeleton className="h-4 w-60" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  )
}
export function BookingListLoader() {
  return (
    <Container className="space-y-6">
      <BookingCardLoader />
      <BookingCardLoader />
    </Container>
  )
}
export default function DashboardSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-100`}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-4 w-44" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <div>test</div>
        <div>test</div>
      </div>
    </>
  );
}