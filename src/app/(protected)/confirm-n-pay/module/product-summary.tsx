import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/ui/container';
import { Star } from 'lucide-react';
import { Suspense } from 'react';
import { ProductSummaryLoader } from '@/components/partial/loader';
import { z } from 'zod';
import { SingleProductSchema } from '@/lib/schema';
type Props = {
  product: z.infer<typeof SingleProductSchema> | null
}

function ProductSummary({
  product,
}: Props) {
  if (product === null) {
    return (
      <ProductSummaryLoader />
    )
  }
  return (
    <Suspense fallback={<ProductSummaryLoader />}>
      <Container className="flex items-start bg-background py-6 gap-x-6">
        <div className="w-32 flex-shrink-0 overflow-hidden rounded-md">
          <div className="aspect-w-6 aspect-h-4 w-full h-full">
            <Image
              src={product.pictures.length > 0 ? product.pictures[0].url : '/images/sea-doo.svg'}
              alt="image"
              width={0}
              height={0}
              sizes="100vw"
              className="object-cover transition-all duration-300 group-hover:scale-105"
              priority={true}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-3 flex-grow min-w-0">
          <div className="min-w-0">
            <Link href={`/d`}>
              <h4 className="text-base font-semibold text-foreground/75 truncate">
                {product.product_name}
              </h4>
            </Link>
            <p className="text-xs text-foreground/50 font-normal mt-1 truncate">{product.product_description}</p>
          </div>

          <div className="flex items-center text-foreground/50 gap-x-2">
            <Star className="w-4 h-4" fill="#F6891F" strokeWidth={0} />
            <p className="inline-block text-xs font-normal">4.9 (120 reviews)</p>
          </div>
        </div>
      </Container>
    </Suspense>
  )
}

export default ProductSummary;