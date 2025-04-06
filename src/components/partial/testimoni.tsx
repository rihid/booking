'use client';

import React from 'react'
import Heading from '../ui/heading'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';
import { bookingUrl2 } from '@/lib/data/endpoints';
import axios from 'axios';

const buttonDisclousure = [
  {
    id: 1,
    name: "Testimoni",
  }
]

function Testimoni({
  productNo,
}: {
  productNo: string | null;
}) {
  const [ratingArr, setRatingArr] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function getRatingByProductNo() {
    if (!productNo) {
      setError("Product number is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(bookingUrl2 + '/book/product-rating', { product_no: productNo });
      const data = response.data.data;
      setRatingArr(data);
    } catch (error: any) {
      setError(error.message || "Failed to load testimonials");
      setRatingArr([]);
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    getRatingByProductNo()
  }, [productNo]);

  return (
    <>
      <div className="text-foreground/50 text-xs font-normal mb-2">
        {buttonDisclousure.map((data) => {
          return (
            <Disclosure as="div" className="w-full max-w-md" key={data.id}>
              {({ open }) => (
                <>
                  <DisclosureButton className="w-full flex items-center justify-between border-b pb-1">
                    <Heading variant='sm' className="text-foreground/75 mb-2">{data.name}</Heading>
                    <ChevronDownIcon className={`w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </DisclosureButton>
                  <div className="overflow-hidden py-1">
                    <DisclosurePanel
                      transition
                      className="origin-top transition duration-200 ease-in-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                    >
                      {isLoading ? (
                        <div className="py-4 text-center">Loading...</div>
                      ) : error ? (
                        <div className="py-4 text-center text-red-500">{error}</div>
                      ) : ratingArr.length === 0 ? (
                        <div className="py-4 text-center">No Data</div>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {ratingArr.map((rating: any, index: number) => (
                            <figure className="w-full max-w-sm" key={index}>
                              <blockquote>
                                <p className="text-xs font-normal italic text-muted-foreground tracking-tight">
                                  &quot;{rating.notes}&quot;
                                </p>
                              </blockquote>
                              {/* <figcaption className="flex items-center mt-1">
                                <cite className="pe-3 font-medium text-foreground/75">
                                  &mdash; {rating.name}
                                </cite>
                              </figcaption> */}
                            </figure>
                          ))}
                        </div>
                      )}
                    </DisclosurePanel>
                  </div>
                </>
              )}
            </Disclosure>
          )
        })}
      </div>
    </>
  )
}

export default Testimoni