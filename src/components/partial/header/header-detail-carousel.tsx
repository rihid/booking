'use client';

import React from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Link from 'next/link';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay'

function HeaaderDetailCarousel({
  pictures,
}: {
  pictures: any;
}) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const plugin = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false })
  )

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
      <Carousel
        setApi={setApi}
        // plugins={[
        //   Autoplay({
        //     delay: 3000,
        //   })
        // ]}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full flex-shrink-0 overflow-hidden"
      >
        {pictures.length !== 0 ?
          <CarouselContent>
            {pictures.map((picture: any) => (
              <CarouselItem key={picture.id}>
                <div className="flex aspect-w-5 aspect-h-4 w-full h-0 cursor-pointer">
                  <Image
                    src={picture.url}
                    alt='auth-image'
                    width={0}
                    height={0}
                    priority
                    sizes='100vw'
                    quality={100}
                    className="h-full w-full object-cover object-center rounded-b-[40px]"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          :
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="flex aspect-w-5 aspect-h-4 w-full h-0 cursor-pointer">
                  <Image
                    src="/images/sea-doo.svg"
                    alt='auth-image'
                    width={0}
                    height={0}
                    priority
                    sizes='100vw'
                    className="h-full w-full object-cover object-center rounded-b-[40px]"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        }
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