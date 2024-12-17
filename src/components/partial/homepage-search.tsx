'use client';

import React from 'react';
import { Search, XIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import ComboboxLocation from './combobox-location';
import { cn } from '@/assets/styles/utils';
import { useLocationStore } from '@/providers/store-providers/location-provider';

function HomepageSearch({
  locations,
}: {
  locations: any;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { setSearch, search } = useLocationStore(state => state)

  const [inputValue, setInputValue] = React.useState<string>('')

  const handleSearch = (term: string) => {
    setSearch(term);
    setInputValue(term);
  }

  const onClickClear = () => {
    setInputValue('')
    setSearch('')
  }
  
  // const handleSearch = useDebouncedCallback((term: string) => {
  //   setInputValue(term);
  //   const params = new URLSearchParams(searchParams);
  //   if (term) {
  //     params.set('query', term);
  //   } else {
  //     params.delete('query');
  //   }
  //   replace(`${pathname}?${params.toString()}`);
  // }, 50);

  // React.useEffect(() => {
  //   const params = new URLSearchParams(searchParams);
  //   if (params.has('query')) {
  //     params.delete('query');
  //     replace(pathname);
  //   }
  // }, []);
  return (
    <div className="relative">
      <div className="grid grid-cols-2 divide-x item-center justify-between h-10 w-full rounded-full border border-input bg-background text-sm">
        <div className="relative">
          <Search className="absolute w-5 h-5 top-1/2 left-2 transform -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Trip"
            className={cn(
              'rounded-full pl-12 border-none bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0'
            )}
            onChange={(e) => { handleSearch(e.target.value) }}
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
        <ComboboxLocation
          locations={locations}
        />
      </div>
    </div>
  )
}

export default HomepageSearch;