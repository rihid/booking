'use client'

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useFilterStore } from '@/providers/store-providers/filter-provider';

interface Coordinate {
  latitude: number;
  longitude: number;
}

const initialCoordinate: Coordinate = {
  // Marina
  latitude: -6.951320,
  longitude: 110.389429
}

function LocationChecker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const { location, setLocation } = useFilterStore(state => state);
  const [coordinate, setCoordinate] = React.useState<Coordinate>(initialCoordinate)
  const maxRadius = 20 // meters

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    /*
      * using harvesine
      * https://www.geeksforgeeks.org/haversine-formula-to-find-distance-between-two-points-on-a-sphere/
    */
    const rad = 6371e3;
    let dLat = (lat2 - lat1) * Math.PI / 180.0;
    let dLon = (lon2 - lon1) * Math.PI / 180.0;

    lat1 = (lat1) * Math.PI / 180.0;
    lat2 = (lat2) * Math.PI / 180.0;

    let a = Math.pow(Math.sin(dLat / 2), 2) +
      Math.pow(Math.sin(dLon / 2), 2) *
      Math.cos(lat1) *
      Math.cos(lat2);

    let c = 2 * Math.asin(Math.sqrt(a));
    return rad * c;
  }
  
  const setOtsParams = (isInRadius: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const hasOts = params.has('ots');
    
    if (isInRadius && !hasOts) {
      params.set('ots', 'true');
      replace(`${pathname}?${params.toString()}`);
    } else if (!isInRadius && hasOts) {
      params.delete('ots');
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const checkLocation = async (): Promise<void> => {
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation not supported in this browser');
      }

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;

          const distance = calculateDistance(
            latitude,
            longitude,
            coordinate.latitude,
            coordinate.longitude
          );

          const isInRadius = distance <= maxRadius;
          setOtsParams(isInRadius);

          console.log(`Jarak: ${distance.toFixed(2)} meter`);
          console.log('current lat:', latitude)
          console.log('current lon:', longitude)
        },
        (error: GeolocationPositionError) => {
          console.error('Error getting location:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } catch (error: any) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  React.useEffect(() => {
    if (location && location.latitude && location.longitude) {
      setCoordinate({
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude)
      });
    } else {
      setCoordinate(initialCoordinate);
    }
  }, [location]);

  React.useEffect(() => {
    checkLocation();
  }, [router, searchParams, coordinate]);

  return null
}

export default LocationChecker