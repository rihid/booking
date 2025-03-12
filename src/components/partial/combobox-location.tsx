'use client';

import React from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, MapPin, XIcon } from 'lucide-react';
import { cn } from '@/assets/styles/utils';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useFilterStore } from '@/providers/store-providers/filter-provider';
import { LocationType } from '@/store/filter';

function ComboboxLocation({
  locations
}: {
  locations: Array<LocationType>
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { location, setLocation } = useFilterStore(state => state);
  const [query, setQuery] = React.useState<string>('');

  const filteredLocation = query === '' ? locations : locations.filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()));

  const handleLocationSelect = (value: LocationType | null) => {
    setQuery(value ? value.name : '');
    setLocation(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('location', value.name);
    } else {
      params.delete('location');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const onClickClear = (e: React.MouseEvent) => {
    e.preventDefault();
    handleLocationSelect(null);
  };

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const locationName = params.get('location')?.toString();
    const locationVal = locations.find(loc => loc.name === locationName) || null;

    setQuery(locationName || '');
    setLocation(locationVal);
  }, [searchParams, locations, setLocation]);

  return (
    <div className="relative">
      <Combobox value={location} onChange={handleLocationSelect}>
        <div className="relative">
          <ComboboxInput
            placeholder='Select Location'
            className={cn(
              'w-full rounded-full border-none bg-background px-3 py-2 text-sm text-muted-foreground',
              'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0'
            )}
            displayValue={(loc: LocationType) => loc?.name || ''}
            onChange={(event) => setQuery(event.target.value)}
          />
          {(query || location) && (
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
          {filteredLocation.map(loc => (
            <ComboboxOption
              key={loc.id}
              value={loc}
              className="group flex cursor-pointer items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-slate-100"
            >
              <MapPin className="size-6 text-muted-foreground" />
              <div>
                <h6 className="text-sm font-normal text-muted-foreground">{loc.name}</h6>
                {loc?.address && (
                  <span className="text-xs/4 font-light text-muted-foreground leading-[6px] tracking-tight">
                    {loc?.address.length > 40 ? `${loc?.address.slice(0, 40)}...` : loc?.address}
                  </span>
                )}
              </div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}

export default ComboboxLocation;
