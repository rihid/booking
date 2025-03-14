'use client';

import React from 'react'
import { Input } from '@/components/ui/input'
import { Search, XIcon } from 'lucide-react'
import { cn } from '@/assets/styles/utils';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useQueryState } from 'nuqs';
import { searchParams } from '@/lib/searchparams-type';
import { Spinner } from '@/components/ui/spinner';

function SearchFilter() {
  const params = useParams();
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
  }, 100);
  const handleSearch = (e: React.MouseEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value
    debouncedSetSearch(value)
  }
  return (
    <form className="relative" data-pending={isPending ? true : undefined}>
      {isPending ?
        <span className="absolute top-1/2 left-2 transform -translate-y-1/2">
          <Spinner size="xsmall" />
        </span> :
        <Search className="absolute w-5 h-5 top-1/2 left-2 transform -translate-y-1/2" />
      }
      <Input
        type="text"
        autoComplete='off'
        placeholder="Select trip"
        className={cn(
          'rounded-full pl-12 border-none bg-transparent text-sm font-normal text-muted-foreground focus-visible:ring-offset-0 focus-visible:ring-0'
        )}
        onChange={handleSearch}
        value={search}
      />
      <button
        type="button"
        className={cn(
          'group absolute inset-y-0 right-0 px-2.5 invisible',
          search ? 'visible' : ''
        )}
        onClick={() => {
          setSearch(null)
        }}
      >
        <XIcon className="w-3 h-3 fill-white/60 group-data-[hover]:fill-white" />
      </button>
    </form>
  )
}

export default SearchFilter