'use client';

import React from 'react'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import useEmblaCarousel from 'embla-carousel-react';

function NavbarTabList({
  categories,
}: {
  categories: any;
}) {

  const [emblaRef] = useEmblaCarousel({dragFree: true});

  return (
    <TabsList className="flex gap-6 justify-start bg-background text-muted-foreground overflow-hidden rounded-none">
      <Carousel ref={emblaRef}>
        <CarouselContent className="-ml-4">
          {categories.map((item: any, index: number) =>
            <CarouselItem className="pl-4 basis-auto" key={index}>
              <TabsTrigger value={item.id} className="font-bold flex-shrink-0">
                <div className='flex gap-2'>
                  <Icon name={item.icon} className="gap-5 w-5 h-5" />
                  {item.name}
                </div>
              </TabsTrigger>
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
    </TabsList>
  )
}

export default NavbarTabList;