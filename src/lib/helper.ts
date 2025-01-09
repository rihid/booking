import slugify from 'slugify';
import { z } from "zod";
import { ProductSchema } from './schema';

const productsType = z.array(ProductSchema);

export function getScrollbarWidth() {

  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  // @ts-ignore
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

  // Removing temporary elements from the DOM
  // @ts-ignore
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;

}

export const currency = (num: number) => {
  const c = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
  return c;
}
export const msToTime = ((value: number) => {
  const hours = Math.floor((value % 86400000) / 3600000)
  const minutes = Math.round(((value % 86400000) % 3600000) / 60000)
  const seconds = Math.round((value % 60000) / 1000)
  return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
});
export const secondsToTime = (value: number) => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;
  return ( ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2));
};

export const generateProductSlug = (products: z.infer<typeof productsType>) => {
  const usedSlugs = new Set();

  return products.map(product => {
    let baseSlug = slugify(product.product_name, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let counter = 1;
    // Cek apakah slug sudah ada dalam usedSlugs
    while (usedSlugs.has(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    // Simpan slug yang telah dipastikan unik
    usedSlugs.add(uniqueSlug);
    // Mengembalikan produk dengan slug
    return {
      ...product,
      slug: uniqueSlug
    };
  });
};

export const generateBasicToken = (token: any) => {
  function base64 (string: any) {
    return Buffer.from(string).toString('base64')
  }
  return base64(token);
}
