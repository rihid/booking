'use client';

import React from 'react';
import { Search, XIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import ComboboxLocation from './combobox-location';
import { cn } from '@/assets/styles/utils';
import { useFilterStore } from '@/providers/store-providers/filter-provider';
import { useQueryParams } from '@/lib/hooks/use-query-params';

function HomepageSearch({
  locations,
}: {
  locations: any;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { search, setSearch } = useFilterStore(state => state);

  const onClickClear = () => {
    setSearch('');
    const params = new URLSearchParams(searchParams);
    if (params.has('query')) {
      params.delete('query');
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      setSearch(term);
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 50);

  React.useEffect(() => {
    const initialQuery = searchParams.get('query')?.toString() || '';
    setSearch(initialQuery);
  }, [searchParams, setSearch]);

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
            onChange={(e) => handleSearch(e.target.value)}
            value={search}
          />
          <button
            type="button"
            className={cn(
              'group absolute inset-y-0 right-0 px-2.5 invisible',
              search ? 'visible' : ''
            )}
            onClick={onClickClear}
          >
            <XIcon className="w-3 h-3 fill-white/60 group-data-[hover]:fill-white" />
          </button>
        </div>
        <ComboboxLocation locations={locations} />
      </div>
    </div>
  );
}

export default HomepageSearch;
