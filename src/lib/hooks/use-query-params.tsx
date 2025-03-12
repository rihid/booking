/*
  *
  * https://samir-mirzaliyev.medium.com/how-to-implement-a-custom-usequeryparams-hook-for-next-js-app-b80609e5071c
  * 
*/
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export const useQueryParams = <
  T extends Record<string, string | number | boolean | unknown>,
>() => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Memoize the query parameters to avoid recomputation on each render
  const queryParam = React.useMemo(() => {
    const query = new URLSearchParams();
    searchParams.forEach((value, key) => {
      query.append(key, value);
    });
    return query;
  }, [searchParams]);

  // Set a new query parameter or update an existing one
  const setQueryParam = <K extends keyof T>(name: K, value: T[K]) => {
    const newQueryParams = new URLSearchParams(queryParam);
    newQueryParams.set(String(name), String(value));
    router.replace(`${pathname}?${newQueryParams.toString()}`, { scroll: false });
  };

  // Delete a query parameter
  const deleteQueryParam = <K extends keyof T>(name: K) => {
    const newQueryParams = new URLSearchParams(queryParam);
    newQueryParams.delete(String(name));
    router.replace(`${pathname}?${newQueryParams.toString()}`, { scroll: false });
  };

  // Get the value of a specific query parameter
  const getQueryParam = <K extends keyof T>(name: K): T[K] | undefined => {
    const value = queryParam.get(String(name));
    if (value === null) return undefined;

    return value as T[K];
  };

  return {
    queryParam,
    setQueryParam,
    getQueryParam,
    deleteQueryParam, // Add deleteQueryParam to the returned object
  };
};
