'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
// import ComboboxLocation from './combobox-location';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { cn } from '@/assets/styles/utils';

function HomepageSearch({
  locations,
}: {
  locations: any;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // locations
  const [selectedPerson, setSelectedPerson] = React.useState('');
  const [query, setQuery] = React.useState('')

  const filteredPeople = query === '' ? locations : locations.filter((loc: any) => {
    return loc.name.toLowerCase().includes(query.toLowerCase())
  })

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
  console.log('selected: ', selectedPerson)
  return (
    <div className="relative">
      <div className="grid grid-cols-2 divide-x item-center justify-between h-10 w-full rounded-full border border-input bg-background text-sm">
        <div className="relative">
          <Search className="absolute w-5 h-5 top-1/2 left-2 transform -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Advance ride"
            className="rounded-full pl-12 border-none bg-transparent focus-visible:ring-offset-0"
            onChange={(event) => { handleSearch(event.target.value) }}
            defaultValue={searchParams.get('query')?.toString()}
          />
        </div>
        {/* <ComboboxLocation 
          locations={locations} 
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
        /> */}
        {/* location */}
        <div className="relative">
          <Combobox value={selectedPerson} onChange={(value: any) => setSelectedPerson(value)} onClose={() => setQuery('')}>
            <div className="relative">
              <ComboboxInput
                placeholder='Select Location'
                className={cn(
                  'w-full rounded-full border-none bg-background px-3 py-2 text-sm text-muted-foreground',
                  // 'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                )}
                displayValue={(person: any) => person?.name}
                onChange={(event) => setQuery(event.target.value)}
              />
              <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
              </ComboboxButton>
            </div>
            <ComboboxOptions
              anchor="bottom"
              transition
              className={cn(
                'z-[9999999] w-[var(--input-width)] rounded-lg border border-slate-100 bg-white p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                'mt-2',
                'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
              )}
            >
              {filteredPeople.map((person: any) => (
                <ComboboxOption
                  key={person.id}
                  value={person}
                  className="group flex cursor-pointer items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-slate-100"
                >
                  <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                  <div className="text-sm text-muted-foreground">{person.name}</div>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
        </div>
      </div>
    </div>
  )
}

export default HomepageSearch;