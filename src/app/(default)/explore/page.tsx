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
import NavbarTabList from './module/navbar-tablist';

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Sewa jetski, Rental Jetski, main jetski di semarang'
}

async function ProductComp({
  query,
  tapGroup,
  locQuery,
}: {
  query: any;
  tapGroup: any;
  locQuery: any;
}) {
  const products = await getAllProductPublic();
  return (
    <Suspense fallback={<ProductListLoader />}>
      <ProductList
        products={products}
        tabGroup={tapGroup}
        query={query}
        locQuery={locQuery}
      />
    </Suspense>
  )
}

async function Explore({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | null }
}) {
  const query = searchParams?.query;
  const locQuery = searchParams?.location;

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
          <HomepageSearch locations={locations} query={query} />
        </Container>
        <Container el="nav" className="sticky top-0 z-30 bg-background pb-4 pt-1 border-b shadow-md rounded-b-3xl">
          <NavbarTabList categories={categories} />
        </Container>
        <div className="relative mt-6 mb-20">
          {categories.map((item: any, index: number) => {
            return (
              <TabsContent key={index} value={item.id}>
                <Suspense fallback={<ProductListLoader />}>
                  <ProductComp tapGroup={item.id} query={query} locQuery={locQuery} />
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