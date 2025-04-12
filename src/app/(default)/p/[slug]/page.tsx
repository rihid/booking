import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { getAllProductPublic } from '@/lib/data';
import { Suspense } from 'react';
import { ProductDetailContentLoader } from '@/components/partial/loader';
import PageContent from './module/page-content';
import { truncateDescription } from '@/lib/helper';

type Props = {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const products = await getAllProductPublic();
    const product = products.find(product => product.slug === params.slug);
    
    if (!product) {
      throw new Error('Product not found');
    }
    const description = truncateDescription(product?.product_description);
    return {
      title: product.product_name,
      description: description || 'Sewa jetski, Rental Jetski, main jetski di Semarang',
      openGraph: {
        title: product.product_name,
        description: description || 'Sewa jetski, Rental Jetski, main jetski di Semarang',
        images: product.pictures?.length ? [product.pictures[0].url] : [],
      }
    };
  } catch (error: any) {
    return {
      title: 'Product Detail',
      description: 'Sewa jetski, Rental Jetski, main jetski di Semarang'
    };
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