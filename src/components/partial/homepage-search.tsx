'use client';

import React, { use } from 'react';
import { Search, XIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import ComboboxLocation from './combobox-location ';
import { cn } from '@/assets/styles/utils';
import { useFilterStore } from '@/providers/store-providers/filter-provider';

function HomepageSearch({
  locations,
}: {
  query: any;
  locations: any;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { search, setSearch } = useFilterStore(state => state)

  const [inputValue, setInputValue] = React.useState<string>('')

  const onClickClear = () => {
    setSearch('')
    setInputValue('')
    const params = new URLSearchParams(searchParams);
    if (params.has('query')) {
      params.delete('query');
      replace(pathname)
    }
  }
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      setSearch(term)
      setInputValue(term)
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 50);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    console.log(searchParams.get('query')?.toString())
    if (params.has('query')) {
      setInputValue(searchParams.get('query')?.toString() as string)
    }
  }, [searchParams]);

  // const handleSearch = (term: any) => {
  //   const params = new URLSearchParams(searchParams);
  //   if (term) {
  //     setSearch(term)
  //     params.set('query', term);
  //   } else {
  //     params.delete('query');
  //   }
  //   replace(`${pathname}?${params.toString()}`);
  // }

  // const handleSearch = (term: string) => {
  //   setSearch(term);
  //   setInputValue(term);
  // }

  // React.useEffect(() => {
  //   console.log(search)
  //   const params = new URLSearchParams(searchParams);
  //   if (search) {
  //     params.set('query', search);
  //   } else {
  //     params.delete('query');
  //   }
  //   replace(`${pathname}?${params.toString()}`);
  // }, []);

  return (
    <div className="relative">
      <div className="grid grid-cols-2 divide-x item-center justify-between h-10 w-full rounded-full border border-input bg-background text-sm">
        <div className="relative">
          <Search className="absolute w-5 h-5 top-1/2 left-2 transform -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Select trip"
            className={cn(
              'rounded-full pl-12 border-none bg-transparent text-sm font-normal text-muted-foreground focus-visible:ring-offset-0 focus-visible:ring-0'
            )}
            onChange={(e) => {
              handleSearch(e.target.value)
              setInputValue(e.target.value)
            }}
            value={inputValue}
          />
          <button
            type="button"
            className={cn(
              'group absolute inset-y-0 right-0 px-2.5 invisible',
              inputValue ? 'visible' : ''
            )}
            onClick={onClickClear}
          >
            <XIcon className="w-3 h-3 fill-white/60 group-data-[hover]:fill-white" />
          </button>
        </div>
        <ComboboxLocation locations={locations} />
      </div>
    </div>
  )
}

export default HomepageSearch;