import { parseAsString, createSearchParamsCache, parseAsArrayOf } from 'nuqs/server';

export const searchParams = {
  search: parseAsString.withDefault(''),
  location: parseAsString.withDefault(''),
  ots: parseAsString.withDefault('')
};
export const searchParamsCache = createSearchParamsCache(searchParams);