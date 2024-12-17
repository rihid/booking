'use client';

import React from 'react';
import Container from '@/components/ui/container';
import ProductCarousel from '@/components/partial/product-carousel';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Heading from '@/components/ui/heading';
import { MapPin } from 'lucide-react';
import { currency } from '@/lib/helper';
import { getAllProductPublic } from '@/lib/data';
import { Suspense } from 'react';
import Image from 'next/image';
import { useLocationStore } from '@/providers/store-providers/location-provider';
import { LocationType } from '@/store/location';

async function ProductList({
  products,
  tabGroup,
  // query,
}: {
  products: any;
  tabGroup?: string;
  // query: string;
}) {
  // const products = await getAllProductPublic();
  const { location, search } = useLocationStore(state => state);
  const filteredProducts = React.useMemo(() => {
    return products.filter((product: any) => {
      if (product.category_id !== tabGroup) {
        return false;
      }
      if (search) {
        if (!product.product_name.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
      }
      if (location) {
        if (product.location_id !== location.id) {
          return false;
        }
      }
      return true;
    });
  }, [products, tabGroup, search, location]);
  
  // const filter = () => {
  //   const productGrouping = products.filter((pg: any) => pg.category_id === tabGroup) // grouping by category
  //   let productValues = productGrouping;
  //   // search
  //   if (search) {
  //     productValues = productValues.filter((product: any) =>
  //       product.product_name.toLowerCase().includes(search.toLowerCase())
  //     );
  //   }
  //   // location
  //   if(selectedLoc) {
  //     productValues = productValues.filter((product: any) => product.location_id === selectedLoc.id);
  //   }

  //   return productValues;
  // }
  // const filteredProducts = filter();
  // React.useEffect(() => {
  //   if (location) {
  //     setSelectedLoc(location)
  //   }
  // }, [location])

  return (
    <Container className="space-y-6">
      {filteredProducts.length === 0 &&
        <div className="flex flex-col items-center justify-center h-auto">
          <div className="px-12 text-center">
            <Image
              src="/images/jetski-2.svg"
              width={320}
              height={320}
              alt="404 Illustration"
            />
          </div>

          <div className="grid gap-2 text-center">
            <div className="grid gap-2">
              <h3>Coming soon!!</h3>
              <p className="text-xs text-muted-foreground">We&apos;re currentlly working on creating something fantastic.</p>
            </div>

            {/* <div>
                <Link href="/" className="hover:underline underline-offset-2">
                  Let&apos;s Go Back
                </Link>
              </div> */}
          </div>
        </div>
      }
      {filteredProducts.map((product: any) => {
        return (
          <Card
            key={product.id}
            className="border-none shadow-none"
          >
            <div className="relative flex flex-col">
              <ProductCarousel slug={product.slug} pictures={product.pictures} />
              <div className="space-y-0.5 mt-3">
                <div>
                  <div className="flex justify-between items-center pb-3">
                    <Link
                      href={`/p/${encodeURIComponent(product.slug)}`}
                      className="truncate mr-8"
                    >
                      <Heading variant='base' className="text-brand truncate">{product.product_name}</Heading>
                    </Link>
                    <div className="flex items-center text-xs font-normal text-muted-foreground">
                      <MapPin className="inline-block text-brand w-4 h-4" />
                      <span className="ml-1">{product.location}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-normal truncate">{product.product_description}</p>
                </div>

                <div className="flex items-center text-muted-foreground">
                  <p className="text-base font-medium text-foreground/75">
                    {currency(parseInt(product.price))}
                  </p>
                  <span className="text-xs">/{product.variant}</span>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </Container>
  )
}

export default ProductList;