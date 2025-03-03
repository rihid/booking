import React from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense } from 'react';
import ProductList from './module/product-list';
import { ProductListLoader, UserAvatarLoader } from '@/components/partial/loader';
import UserAvatar from './module/user-avatar';
import HomepageSearch from '@/components/partial/homepage-search';
import axios from 'axios';
import { productUrl, locationUrl } from '@/lib/data/endpoints';
import Icon from '@/components/ui/icon';
import { getAllProductPublic, getCustomerByNo } from '@/lib/data';
import NavbarTabList from './module/navbar-tablist';
import WarningCompletion from '@/components/partial/warning-completion';
import { getSession } from '@/lib/session';
import LocationChecker from '@/components/partial/location-checker';
import ErrorBoundaries from '@/components/partial/error-boundaries';

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
  try {
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
  } catch(error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknow error"
    return (
      <ErrorBoundaries
        message={errMessage}
      />
    )
  }
}

async function Explore({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | null }
}) {
  const session = await getSession();

  const query = searchParams?.query;
  const locQuery = searchParams?.location;
  // data
  let customer = {
    id: "",
    customer_no: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    identity_number: "",
    vat: "",
    rating: "",
    birthday: "",
    age: "",
    org_no: "",
    type: "",
  }
  let categories = [];
  let locations = [];

  if (session) {
    // @ts-ignore
    const { token, customer_no } = session.user;
    customer = await getCustomerByNo(token, customer_no);
  }
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
  categories = await getProductType();
  locations = await getLocationPublic();

  return (
    <div className="flex flex-col min-h-screen">
      {session && !customer.phone && <WarningCompletion />}
      <Tabs defaultValue={categories[0].id}>
        <Container className="mt-6 mb-4 space-y-4">
          <Suspense fallback={<UserAvatarLoader />}>
            <UserAvatar session={session} customer={customer} />
          </Suspense>
          <HomepageSearch locations={locations} query={query} />
        </Container>
        <Container el="nav" className="sticky top-0 z-30 bg-background pb-4 pt-1 border-b shadow-md rounded-b-3xl">
          <NavbarTabList categories={categories} />
        </Container>
        <div className="relative h-full mt-6 mb-20">
          {categories.map((item: any, index: number) => {
            return (
              <TabsContent key={index} value={item.id}>
                <ProductComp tapGroup={item.id} query={query} locQuery={locQuery} />
              </TabsContent>
            )
          }
          )}
        </div>
      </Tabs>
      <LocationChecker />
    </div>
  )
}

export default Explore;