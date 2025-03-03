'use client';

import React from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, MapPin, XIcon } from 'lucide-react';
import { cn } from '@/assets/styles/utils';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useFilterStore } from '@/providers/store-providers/filter-provider';

function ComboboxLocation({
  locations,
}: {
  locations: any;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { location, setLocation } = useFilterStore(state => state);
  const [selectedLocation, setSelectedLocation] = React.useState<any>(null);
  const [query, setQuery] = React.useState<string>('');

  const filteredLocation = query === '' ? locations : locations.filter((loc: any) => {
    return loc.name.toLowerCase().includes(query.toLowerCase())
  });

  const handleLocationSelect = (value: any) => {
    setSelectedLocation(value);
    setQuery(value ? value.name : '');
    setLocation(value);

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('location', value.name);
    } else {
      params.delete('location');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const onClickClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setQuery('');
    setSelectedLocation(null);
    setLocation(null);

    const params = new URLSearchParams(searchParams);
    params.delete('location');
    replace(`${pathname}?${params.toString()}`);
  };

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (params.has('location')) {
      const locationName = params.get('location')?.toString();
      const locationVal = locations.find((loc: any) => loc.name === locationName);

      if (locationVal) {
        setSelectedLocation(locationVal);
        setQuery(locationName as string);
        setLocation(locationVal);
      }
    } else {
      setSelectedLocation(null);
      setQuery('');
      setLocation(null);
    }
  }, [searchParams, locations, setLocation]);

  return (
    <div className="relative">
      <Combobox
        value={selectedLocation}
        onChange={(value: any) => handleLocationSelect(value)}
      >
        <div className="relative">
          <ComboboxInput
            placeholder='Select Location'
            className={cn(
              'w-full rounded-full border-none bg-background px-3 py-2 text-sm text-muted-foreground',
              'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50'
            )}
            displayValue={(location: any) => location?.name || ''}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={() => {
              if (query && !selectedLocation) {
                const matchedLocation = locations.find(
                  (loc: any) => loc.name.toLowerCase() === query.toLowerCase()
                );
                if (matchedLocation) {
                  handleLocationSelect(matchedLocation);
                } else if (!matchedLocation) {
                  setQuery(selectedLocation?.name || '');
                }
              }
            }}
          />
          {(query || selectedLocation) && (
            <button
              type='button'
              className="absolute z-40 cursor-pointer inset-y-0 right-7 px-1.5"
              onClick={onClickClear}
            >
              <XIcon className="w-3 h-3 fill-white/60 hover:fill-white" />
            </button>
          )}
          <ComboboxButton className="group absolute inset-y-0 right-0 pl-1.5 pr-2.5">
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
              <div>
                <MapPin className="size-6 text-muted-foreground" />
              </div>
              <div>
                <h6 className="text-sm font-normal text-muted-foreground">{location.name}</h6>
                <span className="text-xs/4 font-light text-muted-foreground leading-[6px] tracking-tight">
                  {location.address && location.address.length > 40
                    ? location.address.slice(0, 40) + '...'
                    : location.address}
                </span>
              </div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}

export default ComboboxLocation;