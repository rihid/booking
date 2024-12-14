'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import ComboboxLocation from './combobox-location';

function HomepageSearch({
  locations,
}: {
  locations: any;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 50);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (params.has('query')) {
      params.delete('query');
      replace(pathname);
    }
  }, []);
  return (
    <div className="relative">
      <div className="grid grid-cols-2 divide-x item-center justify-between h-10 w-full rounded-full border border-input bg-background text-sm">
        <div className="relative">
          <Search className="absolute w-5 h-5 top-1/2 left-2 transform -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Trip"
            className="rounded-full pl-12 border-none bg-transparent focus-visible:ring-offset-0"
            onChange={(event) => { handleSearch(event.target.value) }}
            defaultValue={searchParams.get('query')?.toString()}
          />
        </div>
        <ComboboxLocation
          locations={locations}
        />
      </div>
    </div>
  )
}

export default HomepageSearch;