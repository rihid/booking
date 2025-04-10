'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, XIcon } from 'lucide-react';
import { cn } from '@/assets/styles/utils';
import { useQueryState } from 'nuqs';
import { searchParams } from '@/lib/searchparams-type';
import { Spinner } from '@/components/ui/spinner';
import { useDebouncedCallback } from 'use-debounce';

function SearchFilter() {
  const [inputValue, setInputValue] = React.useState('');
  const [isPending, startTransition] = React.useTransition();
  
  const [search, setSearch] = useQueryState(
    'search',
    searchParams.location.withOptions({
      shallow: false,
      startTransition,
    }),
  );

  const debouncedSetSearch = useDebouncedCallback((value) => {
    setSearch(value || null);
  }, 250);

  const handleSearch = (e: React.MouseEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    setInputValue(value);
    debouncedSetSearch(value);
  };

  React.useEffect(() => {
    setInputValue(search || '');
  }, [search]);

  return (
    <form className="relative" data-pending={isPending ? true : undefined}>
      {isPending ? (
        <span className="absolute top-1/2 left-2 transform -translate-y-1/2">
          <Spinner size="xsmall" />
        </span>
      ) : (
        <Search className="absolute w-5 h-5 top-1/2 left-2 transform -translate-y-1/2" />
      )}
      <Input
        type="text"
        autoComplete="off"
        placeholder="Select trip"
        className={cn(
          'rounded-full pl-12 border-none bg-transparent text-sm font-normal text-muted-foreground focus-visible:ring-offset-0 focus-visible:ring-0'
        )}
        onChange={handleSearch}
        value={inputValue}
      />
      <button
        type="button"
        className={cn(
          'group absolute inset-y-0 right-0 px-2.5 invisible',
          inputValue ? 'visible' : ''
        )}
        onClick={() => {
          setInputValue('');
          setSearch(null);
        }}
      >
        <XIcon className="w-3 h-3 fill-white/60 group-data-[hover]:fill-white" />
      </button>
    </form>
  );
}

export default SearchFilter;