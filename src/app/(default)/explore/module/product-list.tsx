import React from 'react';
import Container from '@/components/ui/container';
import ProductCarousel from '@/components/partial/product-carousel';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Heading from '@/components/ui/heading';
import { MapPin } from 'lucide-react';
import { currency } from '@/lib/helper';
import { getAllProductPublic } from '@/lib/data';

async function ProductList() {
  const products = await getAllProductPublic();
  return (
    <Container className="space-y-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="border-none shadow-none"
        >
          <div className="relative flex flex-col">
            <ProductCarousel slug={product.slug} />
            <div className="space-y-0.5 mt-3">
              <div>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/p/${encodeURIComponent(product.slug)}`}
                    className="truncate mr-8"
                  >
                    <Heading variant='base' className="text-brand truncate">{product.product_name}</Heading>
                  </Link>
                  <div className="flex items-center text-xs font-normal text-muted-foreground">
                    <span className="mr-1">Marina</span>
                    <MapPin className="inline-block text-brand w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-normal truncate">Lorem ipsum dolor sit amet.</p>
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
      ))}
    </Container>
  )
}

export default ProductList;