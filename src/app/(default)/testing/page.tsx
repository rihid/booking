'use client'
import React from 'react'
import { Calendar } from '@/components/ui/calendar'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Rating from '@/components/ui/rating';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductListLoader } from '@/components/partial/loader';
import { useCounterStore } from '@/providers/store-providers/testing-provider';

function Testing() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state,
  )
  // const fetchToken = async () => {
  //   const response = await fetch('/api/auth/jwt', {
  //     credentials: 'include',
  //   });
  //   if (response.ok) {
  //     const data = await response.json();
  //     return data.token;
  //   }
  //   return null;
  // };
  // React.useEffect(() => {
  //   fetchToken();
  // }, [])
  return (
    <div>
      <Calendar
        mode="single"
        captionLayout='dropdown-years'
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
      />

      <div className="">
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <Rating />
      </div>
      <div>
        <ProductListLoader />
      </div>
      <div>
        <div>
          Count: {count}
          <hr />
          <button type="button" onClick={() => void incrementCount()}>
            Increment Count
          </button>
          <button type="button" onClick={() => void decrementCount()}>
            Decrement Count
          </button>
        </div>
      </div>
    </div>
  )
}

export default Testing