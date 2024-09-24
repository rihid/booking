'use client';

import React from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/assets/styles/utils';

function ProductCarousel({
  productId,
}:{
  productId: string;
}) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <>
      <Carousel setApi={setApi} className="w-full flex-shrink-0 rounded-md overflow-hidden">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Link href={`/p/${encodeURIComponent(productId)}`}>
                <div className="flex aspect-w-5 aspect-h-4 w-full h-0">
                  <Image
                    src="/images/img-grid-1.png"
                    alt="image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 left-0 right-0">
          <div className="flex items-center justify-center space-x-1">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 w-2 bg-zinc-300 rounded-full transition-all ease-in-out duration-300 gap-1 opacity-90",
                  current === index ? "w-3" : ""
                )}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>

        </div>
      </Carousel>
    </>
  )
}

export default ProductCarousel;