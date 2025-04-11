import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { getSingleProductPublic, getAllProductPublic } from '@/lib/data';
import { Suspense } from 'react';
import { ProductDetailContentLoader } from '@/components/partial/loader';
import PageContent from './module/page-content';

type Props = {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const prodArr = await getAllProductPublic();
  const selectedProd = prodArr.find(product => product.slug === params.slug);
  let product = {
    product_name: 'Product'
  }
  if(selectedProd) {
   product = await getSingleProductPublic(selectedProd.id);
  }

  return {
    title: product.product_name,
    description: 'Sewa jetski, Rental Jetski, main jetski di Semarang'
  }
}

async function Detail({
  params,
}: Props) {
  return (
    <Suspense fallback={<ProductDetailContentLoader />}>
      <PageContent slug={params.slug} />
    </Suspense>
  )
}

export default Detail;