'use client';

import React from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, MapPin, XIcon } from 'lucide-react';
import { cn } from '@/assets/styles/utils';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useFilterStore } from '@/providers/store-providers/filter-provider';

function ComboboxLocationUnused({
  locations,
}: {
  locations: any;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { location, setLocation } = useFilterStore(state => state);
  const [selectedLocation, setSelectedLocation] = React.useState('');
  const [query, setQuery] = React.useState<string>('');

  const filteredLocation = query === '' ? locations : locations.filter((loc: any) => {
    return loc.name.toLowerCase().includes(query.toLowerCase())
  })

  const handleLocationSelect = (value: any) => {
    setSelectedLocation(value)
    setLocation(value)
  }
  const onClickClear = () => {
    setQuery('')
    setSelectedLocation('')
    setLocation(null)
  }
  return (
    <div className="relative">
      <Combobox
        value={location}
        onChange={(value: any) => handleLocationSelect(value)} onClose={() => setQuery('')}
      >
        <div className="relative">
          <ComboboxInput
            placeholder='Select Location'
            className={cn(
              'w-full rounded-full border-none bg-background px-3 py-2 text-sm text-muted-foreground',
              // 'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50'
            )}
            displayValue={(location: any) => {
              return location?.name
            }}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            type='button'
            className={cn(
              'absolute !cursor-pointer inset-y-0 right-4 px-2.5 invisible',
              query || location ? 'visible' : ''
            )}
            onClick={onClickClear}
          >
            <XIcon className="w-3 h-3 fill-white/60 group-data-[hover]:fill-white" />
          </button>
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
          {filteredLocation.map((location: any) => (
            <ComboboxOption
              key={location.id}
              value={location}
              className="group flex cursor-pointer items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-slate-100"
            >
              {/* <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" /> */}
              <div>
                <MapPin className="size-6 text-muted-foreground" />
              </div>
              <div>
                <h6 className="text-sm font-normal text-muted-foreground">{location.name}</h6>
                <span className="text-xs/4 font-light text-muted-foreground leading-[6px] tracking-tight">{location.address && location.address.length > 40 ? location.address.slice(0, 40) + '...' : location.address}</span>
              </div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  )
}

export default ComboboxLocationUnused;