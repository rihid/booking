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

async function ProductList({
  query,
  tabGroup,
}: {
  query: string;
  tabGroup?: string;
}) {
  const products = await getAllProductPublic();
  const filter = () => {
    const productGrouping = products.filter(pg => pg.category_id === tabGroup) // grouping by category
    let productValues = productGrouping;
    if (query) {
      productValues = products.filter(product =>
        product.product_name.toLowerCase().includes(query.toLowerCase())
      );
    }
    return productValues;
  }
  const filteredProducts = filter();
  return (
    <Suspense fallback={"loading..."}>
      <Container className="space-y-6">
        {filteredProducts.length === 0 &&
          <div className="flex flex-col items-center justify-center h-auto">
            <div className="px-12 text-center">
              <Image
                src="/images/jetsky.svg"
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
        {filteredProducts.map((product) => {
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
    </Suspense>
  )
}

export default ProductList;