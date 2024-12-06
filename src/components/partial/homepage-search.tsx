'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

function HomepageSearch() {
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
  }, 300);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (params.has('query')) {
      params.delete('query');
      replace(pathname);
    }
  }, []);

  return (
    <div className="relative">
      <Search className="absolute w-6 h-6 top-1/2 left-2 transform -translate-y-1/2" />
      <Input
        type="text"
        placeholder="Where do yo want to go"
        className="rounded-full pl-12"
        onChange={(event) => { handleSearch(event.target.value)}}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  )
}

export default HomepageSearch;