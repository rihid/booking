'use client';

import React from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { cn } from '@/assets/styles/utils';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useLocationStore } from '@/providers/store-providers/location-provider';

function ComboboxLocation({
  locations,
}: {
  locations: any;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { location, setLocation } = useLocationStore(state => state);
  const [selectedLocation, setSelectedLocation] = React.useState('');
  const [query, setQuery] = React.useState('');

  const filteredLocation = query === '' ? locations : locations.filter((loc: any) => {
    return loc.name.toLowerCase().includes(query.toLowerCase())
  })

  // const handleLocationSelect = (location: any) => {
  //   setSelectedLocation(location);
  //   const params = new URLSearchParams(searchParams.toString());
  //   if (location) {
  //     params.set('ref', location.name.toLowerCase());
  //   } else {
  //     params.delete('ref');
  //   }
  //   replace(`${pathname}?${params.toString()}`);
  // };
  console.log(selectedLocation)
  return (
    <div className="relative">
      <Combobox value={selectedLocation} onChange={(value: any) => setSelectedLocation(value)} onClose={() => setQuery('')}>
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
          {filteredLocation.map((person: any) => (
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
  )
}

export default ComboboxLocation;