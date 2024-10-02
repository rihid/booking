import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import Container from '@/components/ui/container';

export function UserAvatarLoader() {
  return (
    <div className="flex items-center justify-start gap-x-2">
      <Skeleton className="w-8 h-8 roundel-full" />
      <Skeleton className="h-3 w-10" />
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
    <>
      <Container className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-24" />
      </Container>

      <Container>
        <Card className="my-4">
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
        <div className="space-y-0.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-11/12" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </Container>
    </>
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