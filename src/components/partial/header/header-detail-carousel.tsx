'use client';

import React from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/assets/styles/utils';

function HeaaderDetailCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <>
      <Carousel setApi={setApi} className="w-full flex-shrink-0 overflow-hidden">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Link href={'/d'}>
                <div className="flex aspect-w-5 aspect-h-4 w-full h-0">
                  <Image
                    src="/images/img-grid-3.png"
                    alt='auth-image'
                    width={0}
                    height={0}
                    priority
                    sizes='100vw'
                    className="h-full w-full object-cover object-center rounded-b-[40px]"
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-5 right-7">
          <div className="py-1 px-2 rounded bg-background/50 text-center text-xs font-foreground/50">
            <span>
              {current}/{count}
            </span>
          </div>

        </div>
      </Carousel>
    </>
  )
}

export default HeaaderDetailCarousel;