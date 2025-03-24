'use client'

import React from 'react';
import { useQueryState } from 'nuqs';
import { searchParams } from '@/lib/searchparams-type';
import { useLocation } from './location.context';

function LocationChecker({ locations }: { locations: any }) {
  const { checkTargetLocation, isLoading, error } = useLocation();
  const [locParam] = useQueryState('location', searchParams.location);

  // Find selected location from locations
  const location = locParam && locParam.trim() !== '' ? locations.find((loc: any) => loc.name?.toLowerCase().includes(locParam.toLowerCase())) : null;
  
  const defaultCoordinates = {
    // Marina
    latitude: -6.951320,
    longitude: 110.389429

    // Kantor Puri for checking saja
    // latitude: -6.9932,
    // longitude: 110.4215
  };
  
  const maxRadius = 20; // meters

  React.useEffect(() => {
    const checkLocation = async () => {
      if (location && location.latitude && location.longitude) {
        console.log("Checking location:", location.name);
        await checkTargetLocation(
          parseFloat(location.latitude),
          parseFloat(location.longitude),
          maxRadius
        );
      } else {
        await checkTargetLocation(
          defaultCoordinates.latitude,
          defaultCoordinates.longitude,
          maxRadius
        );
      }
    };
    
    checkLocation();
  }, [location, checkTargetLocation, maxRadius, locParam]);

  return null;
}

export default LocationChecker;