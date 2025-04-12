import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import RatingForm from './rating-form';
import Container from '@/components/ui/container';

const ProductList = ({ 
  productNumbers, 
  products, 
  invoice, 
  booking, 
  user 
}: {
  productNumbers: unknown[];
  products: any;
  invoice: any;
  booking: any;
  user: any;
}) => {
  return (
    <Container>
      {productNumbers?.map((invNumber: any) => {
        const productVal = products.find((p: any) => p.product_no === invNumber.product_no);
        const variantVal = productVal?.variants ? productVal.variants.find((pv: any) => pv.product_sku === invNumber.product_sku) : null;
        
        let ratingVal = {
          rating: null,
          rating_notes: null
        }
        
        if (booking) {
          const numberVal = booking.numbers.find((bn: any) => bn.id === invNumber.id);
          if (numberVal) {
            ratingVal = {
              rating: numberVal.rating,
              rating_notes: numberVal.rating_notes,
            }
          }
        }
        
        return (
          <React.Fragment key={invNumber.id}>
            <div className="flex items-start bg-background py-6 gap-x-6">
              <div className="w-32 flex-shrink-0 overflow-hidden rounded-md">
                <Link href={"#"}>
                  <div className="aspect-w-6 aspect-h-4 w-full h-full">
                    <Image
                      src={productVal && productVal.pictures.length > 0 ? productVal.pictures[0].url : '/images/sea-doo.svg'}
                      alt="image"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="object-cover transition-all duration-300 group-hover:scale-105"
                      priority={true}
                    />
                  </div>
                </Link>
              </div>
              <div className="flex flex-col space-y-3 flex-grow min-w-0">
                <div className="min-w-0">
                  <h4 className="text-base font-semibold text-foreground/75 truncate">
                    {productVal?.product_name}
                  </h4>
                  {variantVal && <span className="text-xs font-normal capitalize">{variantVal?.variant_name}</span>}
                  <p className="text-xs text-foreground/50 font-normal mt-1 truncate">{productVal?.product_description}</p>
                </div>
                <div className="flex items-center text-foreground/50 gap-x-2">
                  <Star className="w-4 h-4" fill="#F6891F" strokeWidth={0} />
                  <p className="inline-block text-xs font-normal">{productVal?.rating ? productVal?.rating : '0.0'}</p>
                </div>
              </div>
            </div>
            <RatingForm
              invoiceId={invoice?.id}
              numberId={invNumber.id}
              user={user}
              ratingVal={ratingVal}
            />
          </React.Fragment>
        )
      })}
    </Container>
  );
};

export default ProductList;