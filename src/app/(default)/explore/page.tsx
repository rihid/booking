import React from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/container';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense } from 'react';
import ProductList from './module/product-list';
import { ProductListLoader, UserAvatarLoader } from '@/components/partial/loader';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import UserAvatar from './module/user-avatar';
import HomepageSearch from '@/components/partial/homepage-search';
import axios from 'axios';
import { productUrl, locationUrl } from '@/lib/data/endpoints';
import Icon from '@/components/ui/icon';
import { getAllProductPublic } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Sewa jetski, Rental Jetski, main jetski di semarang'
}

async function Explore({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  }
}) {
  const query = searchParams?.query || '';

  const products = await getAllProductPublic();

  const getProductType = async () => {
    try {
      const res = await axios.get(productUrl + "/category", {
        headers: {
          Accept: 'application/json',
        }
      });
      const data = res.data.data;
      data.sort((a: any, b: any) => {
        // index #0
        if (a.name.toLowerCase() === 'trip') return -1
        if (b.name.toLowerCase() === 'trip') return 1;
        // index #1
        if (a.name.toLowerCase() === 'rental') return -1
        if (b.name.toLowerCase() === 'reantal') return 1;
        return 0
      });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  const getLocationPublic = async () => {
    try {
      const res = await axios.get(locationUrl, { headers: { Accept: 'application/json' } });
      const data = res.data.data;
      return data;
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  const categories = await getProductType();
  const locations = await getLocationPublic();
  return (
    <div className="flex flex-col min-h-screen">
      <Tabs defaultValue={categories[0].id}>
        <Container className="mt-6 mb-4 space-y-4">
          <Suspense fallback={<UserAvatarLoader />}>
            <UserAvatar />
          </Suspense>
          <HomepageSearch locations={locations} />
        </Container>
        <Container el="nav" className="sticky top-0 z-30 bg-background pb-4 pt-1 border-b shadow-md rounded-b-3xl">
          <TabsList className="flex gap-6 justify-start bg-background text-muted-foreground">
            <Carousel>
              <CarouselContent className="-ml-4">
                {categories.map((item: any, index: number) =>
                  <CarouselItem className="pl-4 basis-auto" key={index}>
                    <TabsTrigger value={item.id} className="font-bold flex-shrink-0">
                      <div className='flex gap-2'>
                        <Icon name={item.icon} className="gap-5 w-5 h-5" /> {item.name}
                      </div>
                    </TabsTrigger>
                  </CarouselItem>
                )}
              </CarouselContent>
            </Carousel>
          </TabsList>
        </Container>
        <div className="relative mt-6 mb-20">
          {categories.map((item: any, index: number) => {
            return (
              <TabsContent key={index} value={item.id}>
                <Suspense fallback={<ProductListLoader />}>
                  <ProductList products={products} query={query} tabGroup={item.id} />
                </Suspense>
              </TabsContent>
            )
          }
          )}
        </div>
      </Tabs>
    </div>
  )
}

export default Explore;